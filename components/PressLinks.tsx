import s from './PressLinks.module.scss';
import { format, isAfter } from 'date-fns';

const sortDates = (a, b) => (isAfter(new Date(a.date), new Date(b.date)) ? 1 : -1);

export default function PressLinks({ press }) {
	return (
		<div className={s.pressLinks}>
			{press.map(({ date, source, author, url }, idx) => (
				<div key={idx} className={s.block}>
					<h3>{format(new Date(date), 'dd.MM.yyyy')}</h3>
					<a href={url} targer='new'>
						<b>{source}&nbsp;↗</b>
						<br />
						{author}
					</a>
				</div>
			))}
		</div>
	);
}
