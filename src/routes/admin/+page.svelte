<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { adminLogin, getAccessToken } from '$lib/adminApi';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	onMount(() => {
		// If already logged in, redirect to dashboard
		if (getAccessToken()) {
			goto('/admin/dashboard');
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		if (!email.trim() || !password.trim()) {
			error = 'Vul e-mail en wachtwoord in.';
			loading = false;
			return;
		}

		const res = await adminLogin(email.trim(), password);

		if (res.error) {
			error = res.status === 401 ? 'Ongeldige inloggegevens.' : res.error;
			loading = false;
			return;
		}

		goto('/admin/dashboard');
	}
</script>

<svelte:head>
	<title>Admin Login - Boekenwurmen</title>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4"
>
	<div class="w-full max-w-md">
		<div class="rounded-2xl bg-white p-8 shadow-xl">
			<div class="mb-8 text-center">
				<h1 class="text-3xl font-bold text-slate-800">🔐 Admin Portal</h1>
				<p class="mt-2 text-slate-500">Boekenwurmen Beheer</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-6">
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-slate-700">
						E-mailadres
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						class="w-full rounded-lg border border-slate-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500"
						placeholder="admin@boekenwurmen.nl"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-slate-700">
						Wachtwoord
					</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						class="w-full rounded-lg border border-slate-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500"
						placeholder="••••••••"
						required
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg bg-amber-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-amber-700 disabled:bg-amber-400"
				>
					{loading ? 'Inloggen...' : 'Inloggen'}
				</button>
			</form>

			<div class="mt-6 text-center">
				<a href="/login" class="text-sm text-slate-500 transition-colors hover:text-amber-600">
					← Terug naar gebruikers login
				</a>
			</div>
		</div>
	</div>
</div>
