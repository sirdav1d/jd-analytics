/** @format */

'use server';

import { Resend } from 'resend';

const key = process.env.RESEND_API_KEY;
const resend = new Resend(key);

interface SendMailActionProps {
	email: string;
	subject: string;
	message: string;
}

export async function SendMailAction({
	email,
	message,
	subject,
}: SendMailActionProps) {
	try {
		const resp = await resend.emails.send({
			from: 'JD Analytics <onboarding@resend.dev>',
			to: [email],
			subject: subject,
			html: `<p>${message}</p>`,
		});

		if (resp.error) {
			return {
				ok: false,
				data: null,
				error: resp.error,
			};
		}
		return {
			ok: true,
			data: resp.data,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			ok: false,
			data: null,
			error: error,
		};
	}
}
