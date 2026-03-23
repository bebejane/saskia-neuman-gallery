'use client';

import s from './NewsletterSignupForm.module.scss';
import { useActionState } from 'react';
import { signupToNewsletter } from '@/lib/actions/signupToNewsletter';

const initialState = {
	email: '',
	success: false,
};

export function NewsletterSignupForm() {
	const [state, formAction, pending] = useActionState(signupToNewsletter, initialState);

	return (
		<>
			<form className={s.newsletter} action={formAction}>
				<input type='email' name='email' placeholder='' required />
				<button type='submit' disabled={pending}>
					Subscribe
				</button>
			</form>
			{!pending && (
				<div className={s.status}>
					{state.error && <div className={s.error}>{state.error}</div>}
					{state.success && <div className={s.success}>Thank you for subscribing!</div>}
				</div>
			)}
		</>
	);
}
