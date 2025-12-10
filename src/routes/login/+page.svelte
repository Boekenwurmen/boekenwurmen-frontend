<script lang="ts">
	import { goto } from '$app/navigation';
	let name = '';
	let code = '';

	function onSubmit(event: Event) {
		event.preventDefault();
		if (!name.trim() || !code.trim()) {
			alert('Vul je naam en code in.');
			return;
		}
		// In a real app, validate against backend. For now, proceed.
		goto('/library');
	}
</script>

<div class="book-content">
	<div class="book-page book-page-left">
		<div class="page-number">Login</div>
		<form class="login-form" on:submit={onSubmit}>
			<h2 class="page-title">Log in</h2>
			<label>
				<span>Naam</span>
				<input type="text" bind:value={name} name="name" autocomplete="name" required />
			</label>
			<label>
				<span>Code</span>
				<input type="password" bind:value={code} name="code" autocomplete="current-password" required />
			</label>
			<button type="submit" class="start-button book-like" aria-label="Login">
				<span class="book-cover">
					<span class="cover-subtitle">Login</span>
					<span class="bookmark" aria-hidden="true"></span>
				</span>
			</button>
		</form>
	</div>
	<div class="book-page book-page-right">
		<div class="page-number">Info</div>
		<div class="page-content">
			<p>Voer je naam en code in om naar de bibliotheek te gaan.</p>
		</div>
	</div>
</div>

<style>
	.login-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 320px;
	}
	label span { display: block; margin-bottom: 0.25rem; }
	input { padding: 0.5rem 0.75rem; border: 1px solid #ccc; border-radius: 4px; }
</style>
