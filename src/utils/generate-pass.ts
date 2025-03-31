/** @format */

import { v4 as uuidv4 } from 'uuid';

export function generatePasswordWithUUID() {
	return uuidv4().replace(/-/g, '').slice(0, 12);
}

console.log(generatePasswordWithUUID());
