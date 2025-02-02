/** @format */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function ResetPassForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'form'>) {
	return (
		<form
			className={cn('flex flex-col gap-6', className)}
			{...props}>
			<div className='grid gap-6'>
				<div className='grid gap-2'>
					<Label htmlFor='email'>E-mail</Label>
					<Input
						id='email'
						type='email'
						placeholder='admin@email.com'
						required
					/>
				</div>
				<Button
					type='submit'
					className='w-full font-semibold'>
					Enviar Nova Senha
				</Button>
			</div>
		</form>
	);
}
