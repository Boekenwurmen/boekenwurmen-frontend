<script lang="ts">
	import { onMount } from 'svelte';
	import { getClients, updateClient, deleteClient, type Client } from '$lib/adminApi';

	let clients = $state<Client[]>([]);
	let loading = $state(true);
	let error = $state('');
	let search = $state('');
	let sortBy = $state<'name' | 'score' | 'createdAt'>('score');
	let sortDir = $state<'asc' | 'desc'>('desc');

	// Edit modal state
	let editingClient = $state<Client | null>(null);
	let editForm = $state({ name: '', code: '', score: 0 });
	let editError = $state('');
	let editLoading = $state(false);

	// Delete confirmation
	let deletingClient = $state<Client | null>(null);
	let deleteLoading = $state(false);

	onMount(async () => {
		await loadClients();
	});

	async function loadClients() {
		loading = true;
		error = '';
		const res = await getClients();
		if (res.error) {
			error = res.error;
		} else if (res.data) {
			clients = res.data;
		}
		loading = false;
	}

	const filteredClients = $derived(() => {
		let list = clients;

		// Filter by search
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter((c) => c.name.toLowerCase().includes(q));
		}

		// Sort
		list = [...list].sort((a, b) => {
			let cmp = 0;
			if (sortBy === 'name') {
				cmp = a.name.localeCompare(b.name);
			} else if (sortBy === 'score') {
				cmp = a.score - b.score;
			} else if (sortBy === 'createdAt') {
				cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			}
			return sortDir === 'desc' ? -cmp : cmp;
		});

		return list;
	});

	function openEdit(client: Client) {
		editingClient = client;
		editForm = { name: client.name, code: client.code ?? '', score: client.score ?? 0 };
		editError = '';
	}

	function closeEdit() {
		editingClient = null;
		editError = '';
	}

	async function saveEdit() {
		if (!editingClient) return;
		editLoading = true;
		editError = '';

		const res = await updateClient(editingClient.id, {
			name: editForm.name,
			code: editForm.code,
			score: editForm.score
		});

		if (res.error) {
			editError = res.error;
		} else {
			await loadClients();
			closeEdit();
		}
		editLoading = false;
	}

	function openDelete(client: Client) {
		deletingClient = client;
	}

	function closeDelete() {
		deletingClient = null;
	}

	async function confirmDelete() {
		if (!deletingClient) return;
		deleteLoading = true;

		const res = await deleteClient(deletingClient.id);
		if (!res.error) {
			await loadClients();
		}
		deleteLoading = false;
		closeDelete();
	}

	function toggleSort(field: 'name' | 'score' | 'createdAt') {
		if (sortBy === field) {
			sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = field;
			sortDir = 'desc';
		}
	}
</script>

<svelte:head>
	<title>Gebruikers - Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="text-2xl font-bold text-slate-800">👥 Gebruikers Beheer</h1>
		<div class="text-sm text-slate-500">
			{filteredClients().length} van {clients.length} gebruikers
		</div>
	</div>

	<!-- Search & Filters -->
	<div class="rounded-xl bg-white p-4 shadow-sm">
		<div class="flex flex-col gap-4 sm:flex-row">
			<div class="flex-1">
				<input
					type="search"
					bind:value={search}
					placeholder="Zoek op naam..."
					class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
				/>
			</div>
			<button
				onclick={loadClients}
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
		<!-- Table -->
		<div class="overflow-hidden rounded-xl bg-white shadow-sm">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="border-b border-slate-200 bg-slate-50">
						<tr>
							<th class="px-6 py-4 text-left">
								<button
									onclick={() => toggleSort('name')}
									class="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
								>
									Naam
									{#if sortBy === 'name'}
										<span>{sortDir === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</button>
							</th>
							<th class="px-6 py-4 text-left">
								<button
									onclick={() => toggleSort('score')}
									class="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
								>
									Score
									{#if sortBy === 'score'}
										<span>{sortDir === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</button>
							</th>
							<th class="hidden px-6 py-4 text-left md:table-cell">
								<button
									onclick={() => toggleSort('createdAt')}
									class="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
								>
									Aangemaakt
									{#if sortBy === 'createdAt'}
										<span>{sortDir === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</button>
							</th>
							<th class="px-6 py-4 text-right">Acties</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each filteredClients() as client}
							<tr class="hover:bg-slate-50">
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700"
										>
											{client.name.charAt(0).toUpperCase()}
										</div>
										<span class="font-medium text-slate-800">{client.name}</span>
									</div>
								</td>
								<td class="px-6 py-4">
									<span class="font-semibold text-amber-600">{client.score ?? 0}</span>
								</td>
								<td class="hidden px-6 py-4 text-sm text-slate-500 md:table-cell">
									{new Date(client.createdAt).toLocaleDateString('nl-NL')}
								</td>
								<td class="px-6 py-4 text-right">
									<div class="flex items-center justify-end gap-2">
										<button
											onclick={() => openEdit(client)}
											class="rounded-lg p-2 text-slate-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
											title="Bewerken"
										>
											✏️
										</button>
										<button
											onclick={() => openDelete(client)}
											class="rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
											title="Verwijderen"
										>
											🗑️
										</button>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="px-6 py-12 text-center text-slate-500">
									Geen gebruikers gevonden
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<!-- Edit Modal -->
{#if editingClient}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-xl bg-white shadow-xl">
			<div class="border-b border-slate-200 p-6">
				<h2 class="text-xl font-semibold text-slate-800">Gebruiker Bewerken</h2>
			</div>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					saveEdit();
				}}
				class="space-y-4 p-6"
			>
				<div>
					<label for="edit-name" class="mb-1 block text-sm font-medium text-slate-700">Naam</label>
					<input
						id="edit-name"
						type="text"
						bind:value={editForm.name}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
						required
					/>
				</div>
				<div>
					<label for="edit-code" class="mb-1 block text-sm font-medium text-slate-700">Code</label>
					<input
						id="edit-code"
						type="text"
						bind:value={editForm.code}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
						required
					/>
				</div>
				<div>
					<label for="edit-score" class="mb-1 block text-sm font-medium text-slate-700">Score</label
					>
					<input
						id="edit-score"
						type="number"
						bind:value={editForm.score}
						class="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-amber-500"
						min="0"
						required
					/>
				</div>
				{#if editError}
					<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
						{editError}
					</div>
				{/if}
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={closeEdit}
						class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-50"
					>
						Annuleren
					</button>
					<button
						type="submit"
						disabled={editLoading}
						class="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-white transition-colors hover:bg-amber-700 disabled:bg-amber-400"
					>
						{editLoading ? 'Opslaan...' : 'Opslaan'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if deletingClient}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
			<h2 class="mb-4 text-xl font-semibold text-slate-800">Gebruiker Verwijderen</h2>
			<p class="mb-6 text-slate-600">
				Weet je zeker dat je <strong>{deletingClient.name}</strong> wilt verwijderen? Dit kan niet ongedaan
				worden gemaakt.
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
