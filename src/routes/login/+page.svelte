<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import '../css/login.css';
	let name = '';
	let code = '';
	let showCode = false;
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
				<div class="login-password">
					<input
						type={showCode ? 'text' : 'password'}
						class="story-input"
						bind:value={code}
						name="code"
						autocomplete="current-password"
						required
					/>
					<button
						class="login-eye"
						type="button"
						aria-label={showCode ? 'Verberg code' : 'Toon code'}
						on:click={() => (showCode = !showCode)}
					>
						{#if showCode}
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
			<button type="submit" class="story-button story-button-wide" aria-label="Login">
				Log in
			</button>
			<div class="login-links">
				<a href="/login/forgot" aria-label="Wachtwoord vergeten">Wachtwoord vergeten?</a>
			</div>
			{#if message}
				<p class="login-error">{message}</p>
			{/if}
		</form>
	</div>
</div>
