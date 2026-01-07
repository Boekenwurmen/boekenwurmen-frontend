<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	export let value: string = '';
	export let name: string = '';
	export let autocomplete: HTMLInputAttributes['autocomplete'] = 'current-password';
	export let required: boolean = false;
	export let placeholder: string = '';
	export let id: string | undefined;

	// Styling hooks (defaults match existing login pages)
	export let inputClass: string = 'story-input';
	export let containerClass: string = 'login-password';
	export let buttonClass: string = 'login-eye';
	export let iconClass: string = 'login-eye-icon';

	// A11y labels
	export let ariaLabelShow: string = 'Toon code';
	export let ariaLabelHide: string = 'Verberg code';

	let show = false;
	$: ariaLabel = show ? ariaLabelHide : ariaLabelShow;
</script>

<div class={containerClass}>
	<input
		{id}
		type={show ? 'text' : 'password'}
		class={inputClass}
		bind:value
		{name}
		{autocomplete}
		{placeholder}
		{required}
	/>
	<button class={buttonClass} type="button" aria-label={ariaLabel} on:click={() => (show = !show)}>
		{#if show}
			<svg
				class={iconClass}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path
					d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.1-3.09 3.36-5.66 6.26-7.03"
				/>
				<path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-2.3 3.8" />
				<path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
				<path d="M1 1l22 22" />
			</svg>
		{:else}
			<svg
				class={iconClass}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
				<circle cx="12" cy="12" r="3" />
			</svg>
		{/if}
	</button>
</div>
