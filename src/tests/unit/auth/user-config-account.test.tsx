// @vitest-environment jsdom

import { StrictMode } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UserConfigAccount from '@/app/dashboard/profile/_components/user-config-account';

vi.mock('@/actions/user/update-self', () => ({
	updateSelfAction: vi.fn(),
}));

vi.mock('sonner', () => ({
	toast: {
		error: vi.fn(),
		success: vi.fn(),
	},
}));

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('UserConfigAccount', () => {
	it('validates on submit without updating the form during Controller render', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<StrictMode>
				<UserConfigAccount />
			</StrictMode>,
		);

		const submit = screen.getByRole('button', { name: /Salvar Configurações/ });

		expect(submit.hasAttribute('disabled')).toBe(false);

		fireEvent.click(submit);

		await waitFor(() => {
			expect(screen.getAllByText('Este campo deve conter no mínimo 8 dígitos'))
				.toHaveLength(2);
		});

		await waitFor(() => {
			const messages = consoleError.mock.calls.flat().map(String).join('\n');

			expect(messages).not.toContain('Cannot update a component');
		});
	});
});
