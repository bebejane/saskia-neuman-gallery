'use client';

import { useState } from 'react';
import s from './PrivacyPolicy.module.scss';
import { Markdown } from 'next-dato-utils/components';

export type PrivacyPolicyProps = {
	content: string;
};

export default function PrivacyPolicy({ content }: PrivacyPolicyProps) {
	const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
	return (
		<>
			{showPrivacyPolicy && (
				<div className={s.wrap}>
					<h1>Privacy policy</h1>
					{content && <Markdown className={s.content} content={content} />}
					<div className={s.close} onClick={() => setShowPrivacyPolicy(false)}>
						×
					</div>
				</div>
			)}
			<a href='#privacy' onClick={() => setShowPrivacyPolicy(true)}>
				Privacy policy
			</a>
		</>
	);
}
