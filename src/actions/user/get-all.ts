/** @format */

'use server';

import { requireAdmin } from '@/lib/auth';
import { readAllSellers } from '@/services/data-services/get-sellers';

export default async function getAllSellers() {
	await requireAdmin();
	return readAllSellers();
}
