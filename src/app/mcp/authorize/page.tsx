import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { createConsentSnapshot, parseAuthorizationRequest, completeAuthorization } from '@/mcp/oauth/authorization';
import { OAuthError } from '@/mcp/oauth/protocol';

type AuthorizePageProps = {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toSearchParams(input: Record<string, string | string[] | undefined>) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(input)) {
		if (Array.isArray(value)) {
			for (const item of value) params.append(key, item);
			continue;
		}
		if (value !== undefined) params.set(key, value);
	}

	return params;
}

function safeErrorMessage(error: unknown) {
	if (error instanceof OAuthError && error.code !== 'server_error') return error.message;

	return 'Não foi possível preparar esta autorização.';
}

function clientRegistrationLabel(client: { registrationSource: 'dcr' | 'cimd'; clientOrigin?: string }) {
	if (client.registrationSource === 'cimd') return `CIMD: ${client.clientOrigin ?? 'origem não informada'}`;

	return 'DCR: cliente registrado dinamicamente neste JD';
}

export default async function AuthorizePage({ searchParams }: AuthorizePageProps) {
	const query = toSearchParams(await searchParams);
	const errorMessage = query.get('error');
	if (errorMessage) {
		return <main className='flex min-h-svh items-center justify-center p-6'><Card className='w-full max-w-lg'><CardHeader><CardTitle>Autorização indisponível</CardTitle><CardDescription>{errorMessage === 'authorization_expired' ? 'A autorização expirou. Inicie o fluxo novamente no agente.' : 'Não foi possível concluir a autorização.'}</CardDescription></CardHeader></Card></main>;
	}

	let authorization;
	try {
		authorization = await parseAuthorizationRequest(query);
	} catch (error) {
		return <main className='flex min-h-svh items-center justify-center p-6'><Card className='w-full max-w-lg'><CardHeader><CardTitle>Solicitação inválida</CardTitle><CardDescription>{safeErrorMessage(error)}</CardDescription></CardHeader></Card></main>;
	}

	const user = await getCurrentUser();
	if (!user) {
		const callbackUrl = `/mcp/authorize?${query.toString()}`;
		redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
	}

	if (!user.isActive) return <main className='flex min-h-svh items-center justify-center p-6'><Card className='w-full max-w-lg'><CardHeader><CardTitle>Conta inativa</CardTitle><CardDescription>Esta conta não pode autorizar agentes.</CardDescription></CardHeader></Card></main>;

	const snapshot = createConsentSnapshot(authorization, user.id);

	async function submitConsent(formData: FormData) {
		'use server';

		try {
			const destination = await completeAuthorization(snapshot, formData);
			redirect(destination);
		} catch (error) {
			if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
			redirect('/mcp/authorize?error=authorization_expired');
		}
	}

	return (
		<main className='flex min-h-svh items-center justify-center bg-muted/30 p-6'>
			<Card className='w-full max-w-lg'>
				<CardHeader>
					<CardTitle>Autorizar acesso ao JD</CardTitle>
					<CardDescription>{authorization.client.clientName} quer consultar seus dados comerciais no JD.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4 text-sm'>
					<div><p className='font-medium'>Conta conectada</p><p className='text-muted-foreground'>{user.name} ({user.email})</p></div>
					<div><p className='font-medium'>Origem do cliente</p><p className='break-all text-muted-foreground'>{clientRegistrationLabel(authorization.client)}</p></div>
					<div><p className='font-medium'>Permissão</p><p className='text-muted-foreground'>Consultar indicadores e relatórios disponíveis para sua conta.</p></div>
					<div><p className='font-medium'>Retorno</p><p className='break-all text-muted-foreground'>{authorization.redirectUri}</p></div>
					{authorization.redirectUri.startsWith('http://') ? <p className='text-muted-foreground'>O retorno será feito para o agente local nesta máquina.</p> : null}
				</CardContent>
				<CardFooter className='gap-3'>
					<form action={submitConsent} className='flex w-full gap-3'>
						<Button type='submit' name='decision' value='approve' className='flex-1'>Autorizar</Button>
						<Button type='submit' name='decision' value='deny' variant='outline' className='flex-1'>Cancelar</Button>
					</form>
				</CardFooter>
			</Card>
		</main>
	);
}
