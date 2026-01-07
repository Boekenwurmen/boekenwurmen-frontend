<script>
	import { getContext } from 'svelte';
	import { getProgress } from '../userActions.js';
	import { page } from '$app/stores';

	/**
	 * @type {number[]}
	 */
	const pageContext = getContext('page');

	/**
	 * @type {{id: null | number, name: null | string}}
	 */
	const client = getContext('client');

	let percentage = $state(0);
	let loading = $state(false);

	const baseUrl = $page.url.origin;

	async function fetchProgress() {
		if (!pageContext) return;
		
		const clientId = client?.id;
		const bookId = Number(pageContext[1]);
		const pageNum = Number(pageContext[0]);
		
		console.log('[ProgressBar] Fetching progress:', { clientId, bookId, pageNum });
		
		if (!clientId || !bookId) {
			console.log('[ProgressBar] Missing clientId or bookId, skipping');
			return;
		}

		loading = true;
		const result = await getProgress(baseUrl, clientId, bookId);
		console.log('[ProgressBar] Progress result:', result);
		percentage = result.percentage;
		loading = false;
	}

	$effect(() => {
		// Force dependency on pageContext by accessing it
		if (!pageContext) return;
		const pageNum = pageContext[0];
		const bookId = pageContext[1];
		
		console.log('[ProgressBar] Effect triggered with page:', pageNum, 'book:', bookId);
		fetchProgress();
	});
</script>

<div class="progress-container">
	<div class="progress-bar-wrapper">
		<div class="progress-bar" style="width: {percentage}%"></div>
	</div>
	<p class="progress-text">
		{percentage}% compleet
	</p>
</div>

<style>
	.progress-container {
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.progress-bar-wrapper {
		width: 100%;
		height: 24px;
		background: #e0e0e0;
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #4caf50, #45a049);
		transition: width 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 8px;
		color: white;
		font-weight: bold;
		font-size: 12px;
	}

	.progress-text {
		margin: 0;
		font-size: 14px;
		color: #666;
		text-align: center;
	}
</style>
