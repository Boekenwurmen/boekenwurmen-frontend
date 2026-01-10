<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { adminLogin, getAccessToken } from '$lib/adminApi';
	import PasswordInputWithToggle from '$lib/components/PasswordInputWithToggle.svelte';

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
	class="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4"
>
	<a
		href="/"
		class="absolute top-4 left-4 rounded-lg bg-gray-800 px-5 py-3 text-lg font-semibold text-white transition-colors hover:bg-gray-700"
	>
		← Terug
	</a>
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
						placeholder="E-mail"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-slate-700">
						Wachtwoord
					</label>
					<PasswordInputWithToggle
						id="password"
						bind:value={password}
						name="password"
						autocomplete="current-password"
						inputClass="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 transition-all focus:border-transparent focus:ring-2 focus:ring-amber-500"
						containerClass="relative"
						buttonClass="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
						iconClass="w-6 h-6"
						placeholder="••••••••"
						required={true}
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
		</div>
	</div>
</div>
