// @vitest-environment jsdom

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { TruncatedText } from '@/components/ui/truncated-text';

it('renders the complete value and makes CSS responsible for ellipsis', () => {
	render(<TruncatedText value='Cliente com nome completo e extenso' />);

	const value = screen.getByTitle('Cliente com nome completo e extenso');
	expect(value.textContent).toBe('Cliente com nome completo e extenso');
	expect(value.className).toContain('truncate');
	expect(value.textContent).not.toContain('...');
});
