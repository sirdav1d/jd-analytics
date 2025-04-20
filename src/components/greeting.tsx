/** @format */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Greeting() {
	const pathname = usePathname();

	function normalizePathname(pathname: string) {
		if (pathname == '/dashboard') {
			return 'Visão Geral';
		}

		if (pathname == '/dashboard/users') {
			return 'Gestão de Usuários';
		}

		if (pathname == '/dashboard/profile') {
			return 'Seu Perfil';
		}
		if (pathname == '/dashboard/marketing') {
			return 'Gestão de Marketing';
		}
		if (pathname == '/dashboard/comercial') {
			return 'Gestão Comercial';
		}
		if (pathname == '/dashboard/goals') {
			return 'Gestão de Meta';
		}
		if (pathname == '/dashboard/goals-result') {
			return 'Acompanhamento de Meta';
		}
		if (pathname == '/dashboard/upload') {
			return 'Upload de CSV para base de dados';
		}
	}

	return (
		<p className='font-bold text-2xl xl:text-4xl text-balance md:text-pretty'>
			{normalizePathname(pathname)}
		</p>
	);
}
