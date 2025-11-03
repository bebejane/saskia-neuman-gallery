import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
//import { Block } from '@/components';
import { DraftMode } from 'next-dato-utils/components';

export default async function Home() {
	const { start, draftUrl } = await apiQuery(StartDocument);
	return (
		<>
			<div className={s.container}>Start</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
