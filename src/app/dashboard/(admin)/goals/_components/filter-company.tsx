/** @format */

'use client';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import React, { useState } from 'react';

export default function FilterCompany() {
	const [customerType, setCustomerType] = useState('');
	return (
		<Select
			value={customerType}
			onValueChange={setCustomerType}>
			<SelectTrigger className='w-full md:w-60 mb-5'>
				<SelectValue placeholder='Unidade' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='new'>JD Centro</SelectItem>
				<SelectItem value='recurring'>JD Icaraí</SelectItem>
			</SelectContent>
		</Select>
	);
}
