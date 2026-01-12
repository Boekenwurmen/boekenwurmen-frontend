<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { getContext, onMount } from 'svelte';
	import '../css/login.css';
	import PasswordInputWithToggle from '$lib/components/PasswordInputWithToggle.svelte';
	import T from '$lib/components/T.svelte';
	import { I18n } from '$lib/i18n/i18n.svelte.js';

	let name = '';
	let code = '';
	let message: string = '';

	const languageContext = getContext('language');
	let translator = $state(new I18n(languageContext?.selectedLang || 'en'));
	let currentLang = $state(languageContext?.selectedLang || 'en');

	// Load translations when language changes
	$effect(() => {
		const lang = languageContext?.selectedLang || 'en';
		if (lang !== currentLang) {
			currentLang = lang;
			const newTranslator = new I18n(lang);
			newTranslator.load().then(() => {
				translator = newTranslator;
			});
		}
	});

	onMount(() => {
		translator.load();
	});

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
			message = translator.t('fillNameAndCode');
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
				message = translator.t('incorrectNameOrCode');
			}
		} catch (e) {
			message = translator.t('networkError');
		}
	}
</script>

<div class="book-page book-page-left">
	<div class="page-number"><T key="loginTitle" fallback="Log in" /></div>
	<div class="login-content">
		<div class="page-content">
			<p><T key="loginPrompt" fallback="Enter your name and code to access the library." /></p>
		</div>
		<form class="login-form story-box" on:submit|preventDefault={onSubmit}>
			<h2 class="page-title"><T key="loginTitle" fallback="Log in" /></h2>
			<label>
				<span><T key="name" fallback="Name" /></span>
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
				<span><T key="code" fallback="Code" /></span>
				<PasswordInputWithToggle
					bind:value={code}
					name="code"
					autocomplete="current-password"
					required
					inputClass="story-input"
					containerClass="login-password"
					buttonClass="login-eye"
					iconClass="login-eye-icon"
					ariaLabelShow={translator.t('showCode')}
					ariaLabelHide={translator.t('hideCode')}
				/>
			</label>
			<button type="submit" class="story-button story-button-wide" aria-label="Login">
				<T key="loginTitle" fallback="Log in" />
			</button>
			<div class="login-links">
				<a href="/login/forgot" aria-label="Forgot password"><T key="forgotPassword" fallback="Forgot password?" /></a>
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
