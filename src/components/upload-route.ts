export type UploadDocumentKind = 'Pedidos' | 'Origem';
export type UploadResponse =
	| { ordersProcessed: number; itemsCreated?: number }
	| { updatedOrders: number }
	| { error: string };

export function getUploadRoute(typeDoc: UploadDocumentKind) {
	return typeDoc === 'Pedidos' ? '/api/upload' : '/api/upload-origin';
}

export function getUploadError(
	responseOk: boolean,
	response: UploadResponse,
): string | null {
	if (responseOk && !('error' in response)) return null;
	return 'error' in response
		? response.error
		: 'Algo deu errado, tente novamente.';
}
