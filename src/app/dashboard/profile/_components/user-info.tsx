/** @format */

'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { $Enums } from '@prisma/client';
import { Briefcase, Building2, Mail, UserIcon } from 'lucide-react';

import { useState } from 'react';

type UserInfoProps = {
	organization: {
		name: string;
	};
} & {
	name: string;
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	password: string;
	role: $Enums.Role;
	organizationId: string;
};

export default function UserInfo({ user }: { user: UserInfoProps }) {
	const [isEditing, setIsEditing] = useState(false);
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg md:text-2xl flex justify-between items-center'>
					Informações do Usuário
					<Button onClick={() => setIsEditing(!isEditing)}>
						{isEditing ? 'Salvar Alterações' : 'Editar Perfil'}
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-8 '>
				<div className='flex items-center space-x-4'>
					<UserIcon className='text-red-600' />
					<div>
						<p className='font-medium text-sm md:text-base'>Nome Completo</p>
						{isEditing ? (
							<Input
								defaultValue={user.name}
								className='mt-1'
							/>
						) : (
							<p className='text-muted-foreground'>{user.name}</p>
						)}
					</div>
				</div>
				<div className='flex items-center space-x-4'>
					<Mail className='text-red-600' />
					<div>
						<p className='font-medium text-sm md:text-base'>
							E-mail Corporativo
						</p>
						<p className='text-muted-foreground text-sm'>{user.email}</p>
					</div>
				</div>
				<div className='flex items-center space-x-4'>
					<Briefcase className='text-red-600' />
					<div>
						<p className='font-medium text-sm md:text-base'>Cargo na Empresa</p>
						<p className='text-muted-foreground text-sm'>
							{user.role == 'ADMIN' ? 'Administrador' : 'Gerente'}
						</p>
					</div>
				</div>
				<div className='flex items-center space-x-4'>
					<Building2 className='text-red-600' />
					<div>
						<p className='font-medium text-sm md:text-base'>Unidade</p>
						<p className='text-muted-foreground text-sm'>
							{user.organization.name}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
