<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getBook, type Book, type Page } from '$lib/adminApi';

	const bookId = $derived(Number($page.params.id));

	let book = $state<Book | null>(null);
	let loading = $state(true);
	let error = $state('');

	// Selected page for detail view
	let selectedPageIndex = $state<number | null>(null);

	onMount(async () => {
		await loadBook();
	});

	async function loadBook() {
		loading = true;
		error = '';

		const res = await getBook(bookId);
		if (res.error) {
			error = res.error;
			loading = false;
			return;
		}

		if (res.data) {
			book = res.data;
		}

		loading = false;
	}

	function getTypeColor(type: string): string {
		switch (type) {
			case 'ending':
				return 'bg-green-100 text-green-700';
			case 'bad ending':
				return 'bg-red-100 text-red-700';
			default:
				return 'bg-blue-100 text-blue-700';
		}
	}

	function getTypeLabel(type: string): string {
		switch (type) {
			case 'ending':
				return '🎉 Goed einde';
			case 'bad ending':
				return '❌ Slecht einde';
			default:
				return '📄 Pagina';
		}
	}

	function truncate(text: string, length: number): string {
		if (text.length <= length) return text;
		return text.slice(0, length) + '...';
	}

	const pages = $derived(book?.pages ?? []);
	const selectedPage = $derived(selectedPageIndex !== null ? pages[selectedPageIndex] : null);
</script>

<svelte:head>
	<title>{book?.title || 'Boek'} - Admin</title>
</svelte:head>

{#if loading}
	<div class="py-12 text-center text-slate-500">Laden...</div>
{:else if error}
	<div class="mx-auto max-w-2xl">
		<div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
			{error}
		</div>
		<a href="/admin/books" class="text-amber-600 hover:underline">← Terug naar boeken</a>
	</div>
{:else if book}
	<div class="mx-auto max-w-6xl space-y-6">
		<!-- Header -->
		<div class="flex items-center gap-4">
			<a href="/admin/books" class="rounded-lg p-2 transition-colors hover:bg-slate-200"> ← </a>
			<div class="min-w-0 flex-1">
				<h1 class="text-2xl font-bold text-slate-800">{book.title}</h1>
				<p class="text-slate-500">
					{book.author}
					{#if book.coAuthors?.length}
						<span class="text-slate-400">
							& {book.coAuthors.join(', ')}
						</span>
					{/if}
				</p>
			</div>
			{#if book.category}
				<span
					class="rounded-full bg-amber-100 px-4 py-2 text-base font-semibold text-amber-700 uppercase shadow-sm"
				>
					{book.category}
				</span>
			{/if}
		</div>

		<!-- Book Info Card -->
		<div class="rounded-xl bg-white p-6 shadow-sm">
			<div class="flex gap-6">
				{#if book.coverImageUrl}
					<div class="aspect-[16/9] w-64 shrink-0 overflow-hidden rounded-lg bg-slate-200">
						<img src={book.coverImageUrl} alt={book.title} class="h-full w-full object-cover" />
					</div>
				{:else}
					<div
						class="flex aspect-[16/9] w-64 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-4xl"
					>
						📕
					</div>
				{/if}
				<div class="min-w-0 flex-1">
					{#if book.description}
						<p class="mb-4 text-slate-600">{book.description}</p>
					{/if}
					<div class="flex flex-wrap gap-4 text-sm text-slate-500">
						<span>📅 {book.createdAt || 'Onbekend'}</span>
						<span>📄 {book.pageCount} pagina's</span>
						<span>
							🎯 {book.goodEndings} goede einde(s)
						</span>
						<span>
							❌ {book.badEndings} slechte einde(s)
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Pages Section -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Pages List -->
			<div class="rounded-xl bg-white shadow-sm">
				<div class="border-b border-slate-200 p-4">
					<h2 class="font-semibold text-slate-800">📄 Pagina's ({pages.length})</h2>
				</div>

				{#if pages.length === 0}
					<div class="p-8 text-center text-slate-500">
						<p class="mb-4 text-4xl">📭</p>
						<p>Dit boek heeft nog geen pagina's.</p>
					</div>
				{:else}
					<div class="max-h-[600px] divide-y divide-slate-100 overflow-y-auto">
						{#each pages as pg, index}
							<button
								onclick={() => (selectedPageIndex = index)}
								class="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-slate-50 {selectedPageIndex ===
								index
									? 'bg-amber-50'
									: ''}"
							>
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-sm font-bold text-slate-600"
								>
									{index + 1}
								</div>
								<div class="min-w-0 flex-1">
									<p class="line-clamp-2 text-sm text-slate-700">
										{truncate(pg.story, 80)}
									</p>
									<div class="mt-1 flex items-center gap-2">
										<span class="rounded px-2 py-0.5 text-xs {getTypeColor(pg.type)}">
											{getTypeLabel(pg.type)}
										</span>
										<span class="text-xs text-slate-400">
											{pg.options?.length || 0} keuzes
										</span>
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Page Detail -->
			<div class="rounded-xl bg-white shadow-sm">
				<div class="border-b border-slate-200 p-4">
					<h2 class="font-semibold text-slate-800">
						{#if selectedPage && selectedPageIndex !== null}
							📖 Pagina {selectedPageIndex + 1} Details
						{:else}
							📖 Selecteer een pagina
						{/if}
					</h2>
				</div>

				{#if selectedPage}
					<div class="space-y-4 p-4">
						<!-- Page Type -->
						<div>
							<span class="rounded-full px-3 py-1 text-sm {getTypeColor(selectedPage.type)}">
								{getTypeLabel(selectedPage.type)}
							</span>
						</div>

						<!-- Story Content -->
						<div>
							<h3 class="mb-2 text-sm font-medium text-slate-500">Verhaal</h3>
							<div class="rounded-lg bg-slate-50 p-4">
								<p class="whitespace-pre-wrap text-slate-700">{selectedPage.story}</p>
							</div>
						</div>

						<!-- Options -->
						{#if selectedPage.options?.length}
							<div>
								<h3 class="mb-2 text-sm font-medium text-slate-500">
									Keuzes ({selectedPage.options.length})
								</h3>
								<div class="space-y-2">
									{#each selectedPage.options as option}
										<div
											class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
										>
											<button
												onclick={() => (selectedPageIndex = option.toPage)}
												class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-amber-100 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-200"
												title="Ga naar pagina {option.toPage}"
											>
												{option.toPage}
											</button>
											<div class="min-w-0 flex-1">
												<p class="text-sm text-slate-700">{option.name}</p>
												<span class="text-xs {getTypeColor(option.type)}">
													{option.type}
												</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<div class="p-8 text-center text-slate-500">
						<p class="mb-2 text-4xl">👈</p>
						<p>Klik op een pagina om de details te bekijken</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
