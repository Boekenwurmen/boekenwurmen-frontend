<script lang="ts">
	import { page } from '$app/state';
	import './css/errors.css';
</script>

<div class="error-page" role="main" aria-labelledby="error-title">
	<div class="card">
		{#if page.status === 404}
			<h1 id="error-title" class="title">404: Pagina niet gevonden</h1>
			<p class="sub">De pagina die je zoekt bestaat niet.</p>
			<a class="btn" href="/">Ga naar startpagina</a>
		{:else}
			<h1 id="error-title" class="title">{page.status}: {page.error?.message}</h1>
			<a class="btn" href="/">Ga naar startpagina</a>
		{/if}
	</div>
</div>

<style src="./css/errors.css"></style>
