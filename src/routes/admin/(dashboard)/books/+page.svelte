<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getBooks, deleteBook, type Book } from '$lib/adminApi';

	let books = $state<Book[]>([]);
	let loading = $state(true);
	let error = $state('');
	let search = $state('');
	let categoryFilter = $state('all');

	// Delete confirmation
	let deletingBook = $state<Book | null>(null);
	let deleteLoading = $state(false);

	onMount(async () => {
		await loadBooks();
	});

	async function loadBooks() {
		loading = true;
		error = '';
		const res = await getBooks();
		if (res.error) {
			error = res.error;
		} else if (res.data) {
			books = res.data;
		}
		loading = false;
	}

	const categories = $derived([
		'all',
		...Array.from(new Set(books.map((b) => b.category)))
	]);

	const filteredBooks = $derived(() => {
		let list = books;

		// Filter by search
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(
				(b) =>
					b.title.toLowerCase().includes(q) ||
					b.author.toLowerCase().includes(q) ||
					(b.description || '').toLowerCase().includes(q)
			);
		}

		// Filter by category
		if (categoryFilter !== 'all') {
			list = list.filter((b) => b.category === categoryFilter);
		}

		// Sort by newest first
		return [...list].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	});

	function openDelete(book: Book) {
		deletingBook = book;
	}

	function closeDelete() {
		deletingBook = null;
	}

	async function confirmDelete() {
		if (!deletingBook) return;
		deleteLoading = true;

		const res = await deleteBook(deletingBook.id);
		if (!res.error) {
			await loadBooks();
		}
		deleteLoading = false;
		closeDelete();
	}
</script>

<svelte:head>
	<title>Boeken - Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-bold text-slate-800">📚 Boeken Beheer</h1>
		<a
			href="/admin/books/new"
			class="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700"
		>
			<span>➕</span>
			<span>Nieuw Boek</span>
		</a>
	</div>

	<!-- Search & Filters -->
	<div class="rounded-xl bg-white p-4 shadow-sm">
		<div class="flex flex-col gap-4 sm:flex-row">
			<div class="flex-1">
				<input
					type="search"
					bind:value={search}
					placeholder="Zoek op titel, auteur of beschrijving..."
					class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
				/>
			</div>
			<select
				bind:value={categoryFilter}
				class="rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
			>
				{#each categories() as cat}
					<option value={cat}>{cat === 'all' ? 'Alle categorieën' : cat}</option>
				{/each}
			</select>
			<button
				onclick={loadBooks}
				class="rounded-lg bg-slate-100 px-4 py-2 transition-colors hover:bg-slate-200"
			>
				🔄 Vernieuwen
			</button>
		</div>
	</div>

	{#if loading}
		<div class="py-12 text-center text-slate-500">Laden...</div>
	{:else if error}
		<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
	{:else}
		<div class="mb-2 text-sm text-slate-500">
			{filteredBooks().length} van {books.length} boeken
		</div>

		<!-- Books Grid -->
		<div class="grid gap-6 md:grid-cols-2">
			{#each filteredBooks() as book}
				<div class="group relative overflow-hidden rounded-xl bg-white shadow-sm">
					<!-- Cover -->
					<div
						class="relative flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200"
					>
						{#if book.coverImageUrl}
							<img src={book.coverImageUrl} alt={book.title} class="h-full w-full object-cover" />
						{:else}
							<span class="text-6xl">📕</span>
						{/if}

						{#if book.isIntroduction}
							<div
								class="absolute top-2 left-2 rounded-full bg-purple-600 px-2 py-1 text-xs text-white"
							>
								Introductie
							</div>
						{/if}

						<!-- Hover actions -->
						<div
							class="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<a
								href="/admin/books/{book.id}"
								class="rounded-full bg-white p-3 text-slate-700 transition-colors hover:bg-amber-100"
								title="Bewerken"
							>
								✏️
							</a>
							<button
								onclick={() => openDelete(book)}
								class="rounded-full bg-white p-3 text-slate-700 transition-colors hover:bg-red-100"
								title="Verwijderen"
							>
								🗑️
							</button>
						</div>
					</div>

					<!-- Info -->
					<div class="p-4">
						<h3 class="truncate font-semibold text-slate-800" title={book.title}>{book.title}</h3>
						<p class="truncate text-sm text-slate-500">{book.author}</p>
						<div class="mt-2 flex items-center justify-between">
							<span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
								>{book.category}</span
							>
							<span class="text-xs text-slate-400">{book.year}</span>
						</div>
					</div>
				</div>
			{:else}
				<div class="col-span-full py-12 text-center text-slate-500">
					<p class="text-4xl mb-4">📭</p>
					<p>Geen boeken gevonden</p>
					<a href="/admin/books/new" class="text-amber-600 hover:underline mt-2 inline-block">
						Voeg je eerste boek toe →
					</a>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Delete Confirmation Modal -->
{#if deletingBook}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-xl font-semibold text-slate-800">Boek Verwijderen</h2>
			<p class="mb-6 text-slate-600">
				Weet je zeker dat je <strong>"{deletingBook.title}"</strong> wilt verwijderen? Alle pagina's worden
				ook verwijderd. Dit kan niet ongedaan worden gemaakt.
			</p>
			<div class="flex gap-3">
				<button
					onclick={closeDelete}
					class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50"
				>
					Annuleren
				</button>
				<button
					onclick={confirmDelete}
					disabled={deleteLoading}
					class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
				>
					{deleteLoading ? 'Verwijderen...' : 'Verwijderen'}
				</button>
			</div>
		</div>
	</div>
{/if}
