<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import '../css/login.css';
	let name = '';
	let code = '';
	let message: string = '';

	onMount(() => {
		try {
			const raw = localStorage.getItem('auth');
			if (raw) {
				const auth = JSON.parse(raw);
				if (auth?.loggedIn && auth?.name && auth?.id) {
					goto('/library');
				}
			}
		} catch {}
	});

	async function onSubmit(event: Event) {
		event.preventDefault();
		message = '';
		if (!name.trim() || !code.trim()) {
			message = 'Vul je naam en code in.';
			return;
		}
		try {
			const res = await fetch(`${PUBLIC_API_URL}/clients/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: name.trim(), code: code.trim() })
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data?.success && data?.client?.id) {
				// Persist a lightweight auth flag (cookies are HttpOnly on backend origin)
				localStorage.setItem(
					'auth',
					JSON.stringify({ loggedIn: true, id: data.client.id, name: data.client.name })
				);
				goto('/library');
			} else {
				message = data?.message || 'Naam of code is onjuist.';
			}
		} catch (e) {
			message = 'Netwerkfout tijdens inloggen.';
		}
	}
</script>

<div class="book-content">
	<div class="book-page book-page-left">
		<div class="page-number">Login</div>
		<div class="login-content">
			<div class="page-content">
				<p>Voer je naam en code in om naar de bibliotheek te gaan.</p>
			</div>
			<form class="login-form story-box" on:submit|preventDefault={onSubmit}>
				<h2 class="page-title">Log in</h2>
				<label>
					<span>Naam</span>
					<input
						type="text"
						class="story-input"
						bind:value={name}
						name="name"
						autocomplete="name"
						required
					/>
				</label>
				<label>
					<span>Code</span>
					<input
						type="password"
						class="story-input"
						bind:value={code}
						name="code"
						autocomplete="current-password"
						required
					/>
				</label>
				<button type="submit" class="story-button story-button-wide" aria-label="Login">
					Log in
				</button>
				{#if message}
					<p style="margin-top:.6rem;color:#b00020">{message}</p>
				{/if}
			</form>
		</div>
	</div>
	<div class="book-page book-page-right">
		<div class="page-number">&nbsp;</div>
	</div>
</div>
