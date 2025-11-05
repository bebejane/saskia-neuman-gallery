import s from './page.module.scss';
import { Markdown } from 'next-dato-utils/components';
import { apiQuery } from 'next-dato-utils/api';
import { PrivacyPolicyDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export type PrivacyPolicyProps = {
	content: string;
};

export default async function PrivacyPolicy({}: PageProps<'/about/privacy'>) {
	const { about } = await apiQuery(PrivacyPolicyDocument);
	if (!about) return notFound();
	const { privacyPolicy } = about;

	return (
		<div className={s.privacy}>
			<div className={s.wrap}>
				<h1>Privacy policy</h1>
				<Markdown className={s.content} content={privacyPolicy} />
				<Link href={'/about'} className={s.close} scroll={false}>
					×
				</Link>
			</div>
		</div>
	);
}
