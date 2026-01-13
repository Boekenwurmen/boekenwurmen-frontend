<script>
	import { getContext } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

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
	
	// Total pages in book 1 (from backend: 30 pages, 0-29)
	const TOTAL_PAGES = 30;

	$effect(() => {
		if (!pageContext) return;
		const pageNum = pageContext[0];
		const bookId = pageContext[1];
		const clickCount = pageContext[2];
		const clientId = client?.id;
		
		console.log('[ProgressBar] Effect triggered with page:', pageNum, 'book:', bookId, 'clicks:', clickCount);
		
		// Calculate progress locally based on current page
		// Only update after user has made choices (clickCount > 0)
		if (clickCount > 0 && pageNum > 0) {
			const newPercentage = Math.min(Math.round((pageNum / TOTAL_PAGES) * 100), 100);
			if (newPercentage > percentage) {
				percentage = newPercentage;
			}
		}
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
