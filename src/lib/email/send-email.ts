import "server-only";

import { Resend } from "resend";

type SendEmailInput = {
	to: string;
	subject: string;
	text: string;
};

export async function sendEmail({ to, subject, text }: SendEmailInput) {
	const resend = new Resend(process.env.RESEND_API_KEY);
	const response = await resend.emails.send({
		from: "JD Analytics <onboarding@resend.dev>",
		to: [to],
		subject,
		text,
	});

	if (response.error) throw new Error(response.error.message);
	return response.data;
}
