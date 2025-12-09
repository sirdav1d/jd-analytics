/** @format */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Greeting() {
	const pathname = usePathname();

	function normalizePathname(pathname: string) {
		if (pathname == '/dashboard') {
			return 'Visão Geral Centro Vs. Icaraí';
		}

		if (pathname == '/dashboard/users') {
			return 'Gestão de Usuários';
		}

		if (pathname == '/dashboard/profile') {
			return 'Seu Perfil';
		}
		if (pathname == '/dashboard/marketing') {
			return 'Gestão de Marketing - Produtos';
		}if (pathname == '/dashboard/marketing-servs') {
			return 'Gestão de Marketing - Serviços';
		}	if (pathname == '/dashboard/ecommerce') {
			return 'Gestão de Marketing - Ecommerce';
		}
		if (pathname == '/dashboard/comercial') {
			return 'Gestão Comercial';
		}
		if (pathname == '/dashboard/goals-comercial') {
			return 'Gestão de Meta';
		}
		if (pathname == '/dashboard/goals-marketing') {
			return 'Gestão de Meta';
		}
		if (pathname == '/dashboard/goals-result') {
			return 'Acompanhamento de Meta';
		}
		if (pathname == '/dashboard/upload') {
			return 'Importar Base de Dados';
		}
	}

	return (
		<p className='font-bold text-2xl xl:text-4xl text-balance md:text-pretty'>
			{normalizePathname(pathname)}
		</p>
	);
}
