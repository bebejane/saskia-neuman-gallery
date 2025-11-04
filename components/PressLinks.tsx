import s from './PressLinks.module.scss';
import { format } from 'date-fns';

export type PressLinksProps = {
	press: PressRecord[];
};

export default function PressLinks({ press }: PressLinksProps) {
	return (
		<div className={s.pressLinks}>
			{press.map(({ date, source, author, url }, idx) => (
				<div key={idx} className={s.block}>
					<h3>{format(new Date(date), 'dd.MM.yyyy')}</h3>
					{url && (
						<a href={url} target='_new'>
							<b>{source}&nbsp;↗</b>
							<br />
							{author}
						</a>
					)}
				</div>
			))}
		</div>
	);
}
