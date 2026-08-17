'use client';

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

type DashboardOverviewContextValue = {
	hasMultipleOrganizations: boolean;
	setHasMultipleOrganizations: (value: boolean) => void;
};

const DashboardOverviewContext =
	createContext<DashboardOverviewContextValue | null>(null);

export function DashboardOverviewProvider({ children }: { children: ReactNode }) {
	const [hasMultipleOrganizations, setHasMultipleOrganizations] = useState(false);
	const value = useMemo(
		() => ({ hasMultipleOrganizations, setHasMultipleOrganizations }),
		[hasMultipleOrganizations],
	);

	return (
		<DashboardOverviewContext.Provider value={value}>
			{children}
		</DashboardOverviewContext.Provider>
	);
}

export function DashboardOverviewModeSync({
	hasMultipleOrganizations,
}: {
	hasMultipleOrganizations: boolean;
}) {
	const { setHasMultipleOrganizations } = useDashboardOverview();

	useEffect(() => {
		setHasMultipleOrganizations(hasMultipleOrganizations);
		return () => setHasMultipleOrganizations(false);
	}, [hasMultipleOrganizations, setHasMultipleOrganizations]);

	return null;
}

export function useDashboardOverview() {
	const context = useContext(DashboardOverviewContext);
	if (!context) {
		throw new Error(
			'useDashboardOverview must be used within DashboardOverviewProvider',
		);
	}
	return context;
}
