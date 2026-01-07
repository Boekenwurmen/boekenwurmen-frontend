<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import '../../css/login.css';
	import PasswordInputWithToggle from '$lib/components/PasswordInputWithToggle.svelte';

	let name = '';
	let newCode = '';
	let message: string = '';

	async function submitResetDirect(event: Event) {
		event.preventDefault();
		message = '';
		if (!name.trim() || !newCode.trim()) {
			message = 'Naam en nieuwe code zijn vereist.';
			return;
		}
		if (newCode.trim().length < 10) {
			message = 'Nieuwe code moet minimaal 10 tekens lang zijn.';
			return;
		}
		try {
			const res = await fetch(`${PUBLIC_API_URL}/clients/reset-direct`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: name.trim(), code: newCode.trim() })
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok && data?.success) {
				message = 'Je code is succesvol gewijzigd. Je kunt nu inloggen.';
				setTimeout(() => goto('/login'), 1200);
			} else {
				message = data?.message || 'Reset mislukt. Controleer je naam en probeer opnieuw.';
			}
		} catch (e) {
			message = 'Er is een netwerkfout opgetreden.';
		}
	}
</script>

<div class="book-page book-page-left">
	<div class="page-number">Wachtwoord vergeten</div>
	<div class="login-content">
		<div class="page-content">
			<p>Reset je code direct met je gebruikersnaam.</p>
		</div>

		<form class="login-form story-box" on:submit|preventDefault={submitResetDirect}>
			<h2 class="page-title">Code resetten</h2>
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
				<span>Nieuwe code</span>
				<PasswordInputWithToggle
					bind:value={newCode}
					name="code"
					autocomplete="new-password"
					required
					inputClass="story-input"
					containerClass="login-password"
					buttonClass="login-eye"
					iconClass="login-eye-icon"
					ariaLabelShow="Toon code"
					ariaLabelHide="Verberg code"
				/>
			</label>
			<button type="submit" class="story-button story-button-wide">Reset code</button>
		</form>

		{#if message}
			<p class="login-error">{message}</p>
		{/if}
	</div>
</div>
