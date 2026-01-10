<script lang="ts">
	let { children } = $props();
</script>

<!-- Admin routes don't use the book page styling -->
<div class="admin-root">
	{@render children()}
</div>

<style>
	.admin-root {
		position: fixed;
		inset: 0;
		z-index: 100;
		overflow: auto;
	}
</style>
