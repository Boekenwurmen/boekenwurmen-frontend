<div class="book-content">
	<div class="book-page book-page-left">
		<div class="page-number">1</div>
		<div class="start-screen">
			<div class="start-container">
				<h1 class="page-title">Boekenwurmen</h1>
				<p class="sr-only">Druk op de knop om het spel te starten</p>
				<button id="start-button" class="start-button book-like" data-spine="Boekenwurmen" aria-label="Start spel" onclick={() => window.location.href = '/read'}>
					<span class="book-cover">
						<span class="cover-subtitle">Start</span>
						<span class="bookmark" aria-hidden="true"></span>
					</span>
					<span class="visually-hidden">Start het spel</span>
				</button>
				<!-- Continue button to navigate to login page -->
				<button id="continue-button" class="start-button book-like" data-spine="Boekenwurmen" aria-label="Ga verder" onclick={() => window.location.href = '/login'} style="margin-top: 1rem;">
					<span class="book-cover">
						<span class="cover-subtitle">Continue</span>
						<span class="bookmark" aria-hidden="true"></span>
					</span>
					<span class="visually-hidden">Ga verder naar login</span>
				</button>
			</div>
		</div>
	</div>
	<div class="book-page book-page-right">
		<div class="page-number">2</div>
		<div class="page-content">
			<p>Welkom in Boekenwurmen!</p>
		</div>
	</div>
</div>
