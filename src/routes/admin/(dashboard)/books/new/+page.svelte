<script lang="ts">
	import { goto } from '$app/navigation';
	import { createBook } from '$lib/adminApi';

	let form = $state({
		title: '',
		author: '',
		description: '',
		coverUrl: '',
		category: 'Avontuur',
		year: new Date().getFullYear()
	});
	let error = $state('');
	let loading = $state(false);

	const categories = [
		'Avontuur',
		'Fantasie',
		'Sprookjes',
		'Educatief',
		'Dieren',
		'Humor',
		'Mysterie'
	];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		if (!form.title.trim() || !form.author.trim()) {
			error = 'Titel en auteur zijn verplicht.';
			loading = false;
			return;
		}

		const res = await createBook({
			title: form.title.trim(),
			author: form.author.trim(),
			description: form.description.trim() || undefined,
			coverUrl: form.coverUrl.trim() || undefined,
			category: form.category,
			year: form.year
		});

		if (res.error) {
			error = res.error;
			loading = false;
			return;
		}

		if (res.data?.id) {
			goto(`/admin/books/${res.data.id}`);
		} else {
			goto('/admin/books');
		}
	}
</script>

<svelte:head>
	<title>Nieuw Boek - Admin</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">
	<div class="flex items-center gap-4">
		<a href="/admin/books" class="rounded-lg p-2 transition-colors hover:bg-slate-200"> ← </a>
		<h1 class="text-2xl font-bold text-slate-800">📖 Nieuw Boek</h1>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6 rounded-xl bg-white p-6 shadow-sm">
		<div class="grid gap-6 sm:grid-cols-2">
			<div class="sm:col-span-2">
				<label for="title" class="mb-1 block text-sm font-medium text-slate-700">
					Titel <span class="text-red-500">*</span>
				</label>
				<input
					id="title"
					type="text"
					bind:value={form.title}
					class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
					placeholder="De Magische Boom"
					required
				/>
			</div>

			<div class="sm:col-span-2">
				<label for="author" class="mb-1 block text-sm font-medium text-slate-700">
					Auteur <span class="text-red-500">*</span>
				</label>
				<input
					id="author"
					type="text"
					bind:value={form.author}
					class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
					placeholder="Jan Jansen"
					required
				/>
			</div>

			<div class="sm:col-span-2">
				<label for="description" class="mb-1 block text-sm font-medium text-slate-700">
					Beschrijving
				</label>
				<textarea
					id="description"
					bind:value={form.description}
					rows="3"
					class="w-full resize-none rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
					placeholder="Een korte beschrijving van het boek..."
				></textarea>
			</div>

			<div>
				<label for="category" class="mb-1 block text-sm font-medium text-slate-700">
					Categorie
				</label>
				<select
					id="category"
					bind:value={form.category}
					class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
				>
					{#each categories as cat}
						<option value={cat}>{cat}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="year" class="mb-1 block text-sm font-medium text-slate-700"> Jaar </label>
				<input
					id="year"
					type="number"
					bind:value={form.year}
					class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
					min="1900"
					max="2100"
				/>
			</div>

			<div class="sm:col-span-2">
				<label for="coverUrl" class="mb-1 block text-sm font-medium text-slate-700">
					Cover URL
				</label>
				<input
					id="coverUrl"
					type="url"
					bind:value={form.coverUrl}
					class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
					placeholder="https://example.com/cover.jpg"
				/>
				<p class="mt-1 text-xs text-slate-500">Optioneel: een URL naar de cover afbeelding</p>
			</div>
		</div>

		{#if error}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				{error}
			</div>
		{/if}

		<div class="flex gap-3 border-t border-slate-200 pt-4">
			<a
				href="/admin/books"
				class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-slate-700 transition-colors hover:bg-slate-50"
			>
				Annuleren
			</a>
			<button
				type="submit"
				disabled={loading}
				class="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700 disabled:bg-amber-400"
			>
				{loading ? 'Aanmaken...' : 'Boek Aanmaken'}
			</button>
		</div>
	</form>

	<p class="text-center text-sm text-slate-500">
		Na het aanmaken kun je pagina's toevoegen aan het boek.
	</p>
</div>
