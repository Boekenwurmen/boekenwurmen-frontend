<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import '../css/login.css';
	import PasswordInputWithToggle from '$lib/components/PasswordInputWithToggle.svelte';
	let name = '';
	let code = '';
	let message: string = '';

	if (typeof window !== 'undefined') {
		try {
			const raw = localStorage.getItem('auth');
			if (raw) {
				const auth = JSON.parse(raw);
				if (auth?.loggedIn && auth?.name && auth?.id) {
					goto('/library');
				}
			}
		} catch {}
	}

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
				message = 'Je naam of code is onjuist.';
			}
		} catch (e) {
			message = 'Er is een netwerkfout opgetreden tijdens het inloggen.';
		}
	}
</script>

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
				<PasswordInputWithToggle
					bind:value={code}
					name="code"
					autocomplete="current-password"
					required
					inputClass="story-input"
					containerClass="login-password"
					buttonClass="login-eye"
					iconClass="login-eye-icon"
					ariaLabelShow="Toon code"
					ariaLabelHide="Verberg code"
				/>
			</label>
			<button type="submit" class="story-button story-button-wide" aria-label="Login">
				Log in
			</button>
			<div class="login-links">
				<a href="/login/forgot" aria-label="Wachtwoord vergeten">Wachtwoord vergeten?</a>
			</div>
			<div class="login-links">
				<a href="/read?type=register" aria-label="Wachtwoord vergeten">Account aanmaken</a>
			</div>
			{#if message}
				<p class="login-error">{message}</p>
			{/if}
		</form>
	</div>
</div>
