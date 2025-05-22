/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { $Enums } from '@prisma/client';
import { Briefcase, Mail, UserIcon } from 'lucide-react';
import UserForm from './user-form';

type UserInfoProps = {
	name: string;
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	password: string;
	role: $Enums.Role;
};

export default function UserInfo({ user }: { user: UserInfoProps }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-lg md:text-2xl flex justify-between items-center'>
					Informações do Usuário
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-8 '>
				<div className='flex items-center space-x-4'>
					<UserIcon className='text-red-600' />
					<div className='w-full'>
						<UserForm
							name={user.name!}
							email={user.email!}
						/>
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
			</CardContent>
		</Card>
	);
}
