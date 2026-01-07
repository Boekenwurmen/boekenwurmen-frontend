<script lang="ts">
	let verhaalTekst =
		'Je opent een oud boek. De pagina’s fluisteren jouw naam. Om verder te gaan, moet je een keuze maken.';

	let email = '';
	let wachtwoord = '';

	function inloggen(): void {
		verhaalTekst =
			'Je zet een stap naar voren. Herinneringen keren terug terwijl het pad zich voor je ontvouwt...';
	}

	function registreren(): void {
		verhaalTekst =
			'Een lege pagina ligt voor je. Een nieuw verhaal staat op het punt te beginnen...';
	}
</script>

<div class="container">
	<div class="boek">
		<h1>Jouw Verhaal Begint</h1>

		<p class="verhaal">{verhaalTekst}</p>

		<input
			type="email"
			bind:value={email}
			placeholder="E-mailadres"
		/>

		<input
			type="password"
			bind:value={wachtwoord}
			placeholder="Wachtwoord"
		/>

		<div class="keuzes">
			<button type="button" on:click={inloggen}>
				Ga Verder
			</button>

			<button type="button" on:click={registreren}>
				Nieuw Verhaal Starten
			</button>
		</div>

		<p class="footer">Elke keuze bepaalt jouw pad</p>
	</div>
</div>

<style>
	.container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(1deg, orange, #4b2e1e);
		font-family: serif;
	}

	.boek {
		background: #3b2618;
		padding: 3rem;
		width: 480px;
		max-width: 90vw;
		border-radius: 16px;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.55);
		color: #f5e6c8;
	}

	h1 {
		text-align: center;
		margin-bottom: 1rem;
	}

	.verhaal {
		font-size: 1rem;
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	input {
		width: 100%;
		padding: 0.8rem;
		margin-bottom: 1rem;
		border-radius: 8px;
		border: none;
		font-family: inherit;
		font-size: 0.95rem;
	}

	.keuzes {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	button {
		flex: 1;
		padding: 0.8rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		background: #c9a45c;
		color: #2c1b0f;
		font-family: inherit;
		font-size: 0.9rem;
		transition: background 0.2s ease, transform 0.1s ease;
	}

	button:hover {
		background: #e3c37a;
		transform: translateY(-1px);
	}

	.footer {
		text-align: center;
		font-size: 0.8rem;
		margin-top: 1.5rem;
		opacity: 0.7;
	}
</style>
