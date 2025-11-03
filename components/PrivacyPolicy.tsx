import s from './PrivacyPolicy.module.scss';
import Markdown from '@/lib/dato@/components/Markdown';

export default function PrivacyPolicy({ onClose, content }) {
	return (
		<div className={s.privacy}>
			<div className={s.wrap}>
				<h1>Privacy policy</h1>
				<Markdown className={s.content}>{content}</Markdown>
			</div>
			<div className={s.close} onClick={onClose}>
				×
			</div>
		</div>
	);
}
