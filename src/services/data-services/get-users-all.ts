/** @format */

import 'server-only';
import { GET as readUsers } from '@/app/api/services/user-get-all/route';

export async function FetchAllUsers() {
	const response = await readUsers();
	return response.json();
}
