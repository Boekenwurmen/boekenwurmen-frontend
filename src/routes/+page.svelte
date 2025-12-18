<script>
	import './css/startscherm.css';
</script>

<div class="start-frame">
	<div class="start-screen">
		<!-- Animated background layer from startscherm.css -->
		<div class="fx-bg" aria-hidden="true">
			<div class="container"></div>
		</div>

		<!-- Centered content -->
		<div class="content-wrap">
			<div class="title-wrap">
				<h1 class="start-title">Boekenwurmen</h1>
			</div>
			<div class="button-wrap">
				<a href="/read" class="button" aria-label="Start spel">Start</a>
			</div>
			<div class="leaderboard-wrap">
				<button
					id="continue-button"
					class="button button--small"
					data-spine="Boekenwurmen"
					aria-label="Ga verder"
					onclick={() => (window.location.href = '/login')}
				>
					<span class="book-cover"></span>
					<span class="cover-subtitle">Verder lezen</span>
					<span class="bookmark" aria-hidden="true"></span>
				</button>
			</div>
			<div class="leaderboard-wrap">
				<a href="/leaderboard" class="button button--small" aria-label="Toon ranglijst"
					>Leaderboard</a>
			</div>
		</div>
	</div>
</div>
