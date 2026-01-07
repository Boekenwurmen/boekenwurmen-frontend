<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import '../../css/login.css';

	let name = '';
	let newCode = '';
	let showNewCode = false;
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
				<div class="login-password">
					<input
						type={showNewCode ? 'text' : 'password'}
						class="story-input"
						bind:value={newCode}
						name="code"
						autocomplete="new-password"
						required
					/>
					<button
						class="login-eye"
						type="button"
						aria-label={showNewCode ? 'Verberg code' : 'Toon code'}
						on:click={() => (showNewCode = !showNewCode)}
					>
						{#if showNewCode}
							<svg
								class="login-eye-icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path
									d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.1-3.09 3.36-5.66 6.26-7.03"
								/>
								<path
									d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-2.3 3.8"
								/>
								<path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
								<path d="M1 1l22 22" />
							</svg>
						{:else}
							<svg
								class="login-eye-icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						{/if}
					</button>
				</div>
			</label>
			<button type="submit" class="story-button story-button-wide">Reset code</button>
		</form>

		{#if message}
			<p class="login-error">{message}</p>
		{/if}
	</div>
</div>
