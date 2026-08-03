/** @format */

import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function createMediaQueryStore(query: string) {
	return {
		getSnapshot() {
			return window.matchMedia(query).matches;
		},
		getServerSnapshot() {
			return false;
		},
		subscribe(onStoreChange: () => void) {
			const mediaQueryList = window.matchMedia(query);
			mediaQueryList.addEventListener('change', onStoreChange);
			return () => mediaQueryList.removeEventListener('change', onStoreChange);
		},
	};
}

const mobileStore = createMediaQueryStore(MOBILE_QUERY);

export function useIsMobile() {
	return React.useSyncExternalStore(
		mobileStore.subscribe,
		mobileStore.getSnapshot,
		mobileStore.getServerSnapshot,
	);
}

const TABLET_BREAKPOINT = 1024;
const TABLET_QUERY = `(max-width: ${TABLET_BREAKPOINT - 1}px)`;
const tabletStore = createMediaQueryStore(TABLET_QUERY);

export function useIsTablet() {
	return React.useSyncExternalStore(
		tabletStore.subscribe,
		tabletStore.getSnapshot,
		tabletStore.getServerSnapshot,
	);
}
