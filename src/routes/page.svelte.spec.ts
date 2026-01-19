import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render h1', () => {
		render(Page);

		// Use screen.getByRole instead of page.getByRole
		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading).toBeInTheDocument();
	});
});
