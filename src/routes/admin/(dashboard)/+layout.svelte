<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getAdminMe, adminLogout, getAccessToken, clearTokens, type Admin } from '$lib/adminApi';

	let { children } = $props();
	let admin = $state<Admin | null>(null);
	let loading = $state(true);
	let sidebarOpen = $state(false);

	const navItems = [
		{ href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
		{ href: '/admin/clients', label: 'Gebruikers', icon: '👥' },
		{ href: '/admin/books', label: 'Boeken', icon: '📚' }
	];

	onMount(async () => {
		const token = getAccessToken();
		if (!token) {
			goto('/admin');
			return;
		}

		const res = await getAdminMe();
		if (res.error || !res.data?.admin) {
			clearTokens();
			goto('/admin');
			return;
		}

		admin = res.data.admin;
		loading = false;
	});

	async function handleLogout() {
		await adminLogout();
		goto('/admin');
	}

	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}
</script>

<svelte:head>
	<title>Admin - Boekenwurmen</title>
</svelte:head>

{#if loading}
	<div class="flex min-h-screen items-center justify-center bg-slate-100">
		<div class="text-slate-500">Laden...</div>
	</div>
{:else}
	<div class="flex min-h-screen bg-slate-100">
		<!-- Mobile sidebar backdrop -->
		{#if sidebarOpen}
			<div
				class="fixed inset-0 z-40 bg-black/50 lg:hidden"
				onclick={() => (sidebarOpen = false)}
				onkeydown={(e) => e.key === 'Escape' && (sidebarOpen = false)}
				role="button"
				tabindex="0"
				aria-label="Sluit menu"
			></div>
		{/if}

		<!-- Sidebar -->
		<aside
			class="fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-800 text-white transition-transform lg:static lg:transform-none {sidebarOpen
				? 'translate-x-0'
				: '-translate-x-full lg:translate-x-0'}"
		>
			<div class="border-b border-slate-700 p-6">
				<h1 class="text-xl font-bold">Boekenwurmen</h1>
				<p class="mt-1 text-sm text-slate-400">Admin Panel</p>
			</div>

			<nav class="space-y-2 p-4">
				{#each navItems as item}
					<a
						href={item.href}
						onclick={() => (sidebarOpen = false)}
						class="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors {isActive(
							item.href
						)
							? 'bg-amber-600 text-white'
							: 'text-slate-300 hover:bg-slate-700'}"
					>
						<span>{item.icon}</span>
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>

			<div class="absolute right-0 bottom-0 left-0 border-t border-slate-700 p-4">
				<div class="mb-2 flex items-center gap-3 px-4 py-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-sm font-bold"
					>
						{admin?.name?.charAt(0).toUpperCase() || 'A'}
					</div>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium">{admin?.name || 'Admin'}</p>
						<p class="truncate text-xs text-slate-400">{admin?.email}</p>
					</div>
				</div>
				<button
					onclick={handleLogout}
					class="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-slate-300 transition-colors hover:bg-slate-700"
				>
					<span>🚪</span>
					<span>Uitloggen</span>
				</button>
			</div>
		</aside>

		<!-- Main content -->
		<div class="flex min-w-0 flex-1 flex-col">
			<!-- Top bar -->
			<header class="flex items-center gap-4 bg-white px-4 py-3 shadow-sm lg:px-6">
				<button
					onclick={() => (sidebarOpen = !sidebarOpen)}
					class="rounded-lg p-2 transition-colors hover:bg-slate-100 lg:hidden"
					aria-label="Toggle menu"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
				<a
					href="/"
					class="rounded-lg bg-slate-200 px-4 py-2 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-300"
				>
					← Terug naar de website
				</a>
			</header>

			<!-- Page content -->
			<main class="flex-1 overflow-auto p-4 lg:p-6">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
