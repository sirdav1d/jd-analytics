/** @format */

import { DataTable } from '../_components/data-table';
import { columns } from './_components/columns';

export default async function AdminPage() {
	const baseURL = process.env.NEXT_PUBLIC_API_URL;
	const response = await fetch(`${baseURL}/api/services/user-get-all`, {
		next: { tags: ['users'], revalidate: 60 },
	});

	const { data } = await response.json();
	return (
		<div className='w-full mx-auto pb-5'>
			<DataTable
				columns={columns}
				data={data}
			/>
		</div>
	);
}
