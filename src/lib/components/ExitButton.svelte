<script lang="ts">
    import { goto } from '$app/navigation';
	function clicked() {
		const raw = localStorage.getItem('auth');
		const auth = raw ? JSON.parse(raw) : null;
		const isLoggedIn = auth?.loggedIn;
		goto(isLoggedIn ? '/library' : '/');
	}
</script>

<button class="exit-button" onclick={clicked}>✕</button>


<style>
	.exit-button {
		position: absolute;
		top: -180px;
		left: 0;
		width: 45px;
		height: 45px;
		background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%);
		color: #6b5437;
		border: 2px solid #d4a574;
		border-radius: 50%;
		font-size: 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		z-index: 10;
		box-shadow: 0 4px 12px rgba(107, 84, 55, 0.15);
		font-weight: bold;
	}

	.exit-button:hover {
		background: linear-gradient(135deg, #8b6f47 0%, #6b5437 100%);
		color: #f5e6d3;
		border-color: #6b5437;
		box-shadow: 0 6px 16px rgba(107, 84, 55, 0.3);
		transform: translateY(-2px);
	}

	.exit-button:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(107, 84, 55, 0.2);
	}
</style>