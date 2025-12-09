<script>
	import '../css/startscherm.css';
	const entries = [
		{ rank: 1, name: 'Ava', score: 1280 },
		{ rank: 2, name: 'Liam', score: 1175 },
		{ rank: 3, name: 'Noah', score: 1100 },
		{ rank: 4, name: 'Emma', score: 990 },
		{ rank: 5, name: 'Mila', score: 945 },
		{ rank: 6, name: 'Lucas', score: 900 },
		{ rank: 7, name: 'Sofia', score: 860 },
		{ rank: 8, name: 'Olivia', score: 825 },
		{ rank: 9, name: 'Ethan', score: 800 },
		{ rank: 10, name: 'Isla', score: 780 }
	];
</script>

<div class="start-frame">
	<div class="start-screen">
		<!-- Animated background layer from startscherm.css -->
		<div class="fx-bg" aria-hidden="true">
			<div class="container"></div>
		</div>

		<!-- Centered content like /read -->
		<div class="content-wrap" style="margin-top: 100px; gap: 1rem;">
			<div class="title-wrap">
				<h1 class="start-title">Leaderboard</h1>
			</div>

			<div class="ranglijst-card" role="region" aria-label="Ranglijst" style="margin-top: 0;">
				<div style="width: 100%; max-width: 900px;">
					<div
						style="border:1px solid #3b1c10; border-radius: 12px; overflow: hidden; background: goldenrod; box-shadow: 0 12px 28px rgba(0,0,0,0.3);"
					>
						<div
							style="display:grid; grid-template-columns: 90px 1fr 140px; padding: 1rem 1.25rem; background:#c2931b; color:#1f140b; font-weight:800; font-size: 1.1rem;"
						>
							<div>#</div>
							<div>Speler</div>
							<div style="text-align:right;">Score</div>
						</div>
						{#each entries as e}
							<div
								style="display:grid; grid-template-columns: 90px 1fr 140px; padding: 1.1rem 1.25rem; border-top:1px solid rgba(0,0,0,0.15); align-items: center; background: rgba(255,255,255,0.06);"
							>
								<div style="font-weight: 900; color:#3b1c10; font-size: 1.1rem;">{e.rank}</div>
								<div style="display:flex; align-items:center; gap:0.8rem;">
									{#if e.rank === 1}
										<!-- Gold trophy -->
										<svg
											width="36"
											height="36"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));"
										>
											<path d="M6 4h12v3a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V4Z" fill="#DAA520" />
											<path d="M18 4h3a2 2 0 0 1-2 2h-1V4Z" fill="#C2951A" />
											<path d="M6 4H3a2 2 0 0 0 2 2h1V4Z" fill="#C2951A" />
											<rect x="10" y="12" width="4" height="3" rx="1" fill="#C2951A" />
											<rect x="9" y="15" width="6" height="2" rx="1" fill="#B07D14" />
											<rect x="8" y="17" width="8" height="2" rx="1" fill="#8A6210" />
										</svg>
									{:else if e.rank === 2}
										<!-- Silver trophy -->
										<svg
											width="36"
											height="36"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));"
										>
											<path d="M6 4h12v3a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V4Z" fill="#C0C0C0" />
											<path d="M18 4h3a2 2 0 0 1-2 2h-1V4Z" fill="#A9A9A9" />
											<path d="M6 4H3a2 2 0 0 0 2 2h1V4Z" fill="#A9A9A9" />
											<rect x="10" y="12" width="4" height="3" rx="1" fill="#A9A9A9" />
											<rect x="9" y="15" width="6" height="2" rx="1" fill="#8F8F8F" />
											<rect x="8" y="17" width="8" height="2" rx="1" fill="#6F6F6F" />
										</svg>
									{:else if e.rank === 3}
										<!-- Bronze trophy -->
										<svg
											width="36"
											height="36"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));"
										>
											<path d="M6 4h12v3a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V4Z" fill="#CD7F32" />
											<path d="M18 4h3a2 2 0 0 1-2 2h-1V4Z" fill="#B36B29" />
											<path d="M6 4H3a2 2 0 0 0 2 2h1V4Z" fill="#B36B29" />
											<rect x="10" y="12" width="4" height="3" rx="1" fill="#B36B29" />
											<rect x="9" y="15" width="6" height="2" rx="1" fill="#9A5922" />
											<rect x="8" y="17" width="8" height="2" rx="1" fill="#7C481B" />
										</svg>
									{:else}
										<div style="width:36px; height:36px;"></div>
									{/if}

									<span style="font-weight:800; color:#1f140b; font-size: 1.05rem;">{e.name}</span>
								</div>
								<div style="text-align:right; font-weight:900; color:#1f140b; font-size: 1.05rem;">
									{e.score}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
