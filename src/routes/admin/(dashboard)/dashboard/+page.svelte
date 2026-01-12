<script lang="ts">
	import { onMount } from 'svelte';
	import { getClients, getBooks, type Client, type Book } from '$lib/adminApi';

	let clients = $state<Client[]>([]);
	let books = $state<Book[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const [clientsRes, booksRes] = await Promise.all([getClients(), getBooks()]);

		if (clientsRes.data) {
			clients = clientsRes.data;
		}
		if (booksRes.data) {
			books = booksRes.data;
		}
		loading = false;
	});

	const stats = $derived([
		{ label: 'Gebruikers', value: clients.length, icon: '👥', color: 'bg-blue-500' },
		{ label: 'Boeken', value: books.length, icon: '📚', color: 'bg-green-500' },
		{
			label: 'Totale Score van gebruikers',
			value: clients.reduce((sum, c) => sum + (c.score ?? 0), 0),
			icon: '⭐',
			color: 'bg-amber-500'
		}
	]);

	const topClients = $derived(
		[...clients].sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 5)
	);

	const recentBooks = $derived(
		[...books]
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 5)
	);
</script>

<svelte:head>
	<title>Dashboard - Admin</title>
</svelte:head>

<div class="space-y-6">
	<h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>

	{#if loading}
		<div class="text-slate-500">Laden...</div>
	{:else}
		<!-- Stats Grid -->
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{#each stats as stat}
				<div class="rounded-xl bg-white p-6 shadow-sm">
					<div class="flex items-center gap-4">
						<div
							class="{stat.color} flex h-12 w-12 items-center justify-center rounded-lg text-2xl text-white"
						>
							{stat.icon}
						</div>
						<div>
							<p class="text-2xl font-bold text-slate-800">{stat.value}</p>
							<p class="text-sm text-slate-500">{stat.label}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Top Users -->
			<div class="rounded-xl bg-white shadow-sm">
				<div class="flex items-center justify-between border-b border-slate-100 p-4">
					<h2 class="font-semibold text-slate-800">🏆 Top Gebruikers</h2>
					<a
						href="/admin/clients"
						class="rounded-lg bg-amber-100 px-3 py-2 text-base font-semibold text-amber-700 transition-colors hover:bg-amber-200"
						>Bekijk alle gebruikers →</a
					>
				</div>
				<div class="divide-y divide-slate-100">
					{#each topClients as client, i}
						<div class="flex items-center gap-4 p-4">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-600"
							>
								{i + 1}
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate font-medium text-slate-800">{client.name}</p>
							</div>
							<div class="font-semibold text-amber-600">{client.score ?? 0} pts</div>
						</div>
					{:else}
						<div class="p-4 text-slate-500 text-center">Geen gebruikers gevonden</div>
					{/each}
				</div>
			</div>

			<!-- Recent Books -->
			<div class="rounded-xl bg-white shadow-sm">
				<div class="flex items-center justify-between border-b border-slate-100 p-4">
					<h2 class="font-semibold text-slate-800">📖 Recente Boeken</h2>
					<a
						href="/admin/books"
						class="rounded-lg bg-amber-100 px-3 py-2 text-base font-semibold text-amber-700 transition-colors hover:bg-amber-200"
						>Bekijk alle boeken →</a
					>
				</div>
				<div class="divide-y divide-slate-100">
					{#each recentBooks as book}
						<div class="flex items-center gap-4 p-4">
							<div class="flex h-14 w-10 items-center justify-center rounded bg-slate-200 text-lg">
								📕
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate font-medium text-slate-800">{book.title}</p>
								<p class="truncate text-sm text-slate-500">{book.author}</p>
							</div>
							{#if book.isIntroduction}
								<span class="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700"
									>Intro</span
								>
							{/if}
						</div>
					{:else}
						<div class="p-4 text-slate-500 text-center">Geen boeken gevonden</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="rounded-xl bg-white p-6 shadow-sm">
			<h2 class="mb-4 font-semibold text-slate-800">⚡ Snelle Acties</h2>
			<div class="flex flex-wrap gap-3">
				<a
					href="/admin/books/new"
					class="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700"
				>
					<span>➕</span>
					<span>Nieuw Boek</span>
				</a>
				<a
					href="/admin/clients"
					class="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-white transition-colors hover:bg-slate-700"
				>
					<span>👥</span>
					<span>Beheer Gebruikers</span>
				</a>
			</div>
		</div>
	{/if}
</div>
