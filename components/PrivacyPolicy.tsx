import s from './PrivacyPolicy.module.scss';
import { Markdown } from 'next-dato-utils/components';

export type PrivacyPolicyProps = {
	content: string;
};

export default function PrivacyPolicy({ content }: PrivacyPolicyProps) {
	return (
		<div className={s.privacy}>
			<div className={s.wrap}>
				<h1>Privacy policy</h1>
				{content && <Markdown className={s.content} content={content} />}
			</div>
			<div
				className={s.close}
				//onClick={onClose}
			>
				×
			</div>
		</div>
	);
}
