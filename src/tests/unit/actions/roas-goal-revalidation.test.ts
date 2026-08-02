import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
	requireAdmin: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	revalidatePath: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock('@/lib/prisma', () => ({
	prisma: { roasGoal: { create: mocks.create, update: mocks.update } },
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));

describe('ROAS goal mutations', () => {
	beforeEach(() => {
		mocks.requireAdmin.mockResolvedValue(undefined);
		mocks.create.mockResolvedValue({ id: 'created', roas: 4 });
		mocks.update.mockResolvedValue({ id: 'updated', roas: 5 });
	});

	it('revalidates the marketing goals page after creation succeeds', async () => {
		const { CreateRoasGoalAction } = await import('@/actions/roasGoal/create');

		await CreateRoasGoalAction({
			goalDateRef: new Date('2026-08-01T00:00:00.000Z'),
			roas: 4,
		});

		expect(mocks.revalidatePath).toHaveBeenCalledWith('/dashboard/goals-marketing');
	});

	it('revalidates the marketing goals page after update succeeds', async () => {
		const { UpdateRoasGoalAction } = await import('@/actions/roasGoal/update');

		await UpdateRoasGoalAction({ goalId: 'updated', roas: 5 });

		expect(mocks.revalidatePath).toHaveBeenCalledWith('/dashboard/goals-marketing');
	});
});
