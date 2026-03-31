import s from './page.module.scss';
import { AllExhibitionsDocument, StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode, InfiniteScrollClient } from 'next-dato-utils/components';
import { Article } from '@/components/Article';
import { StartLink } from '@/components/StartLink';

export default async function Home({}: PageProps<'/'>) {
	const { start, draftUrl } = await apiQuery(StartDocument);

	const links = start?.links;

	if (!links || !links.length) return null;

	const cover = links[0];
	const image = cover?.image ?? null;
	const path =
		cover.__typename === 'HappeningRecord'
			? `/happenings`
			: cover.__typename === 'ExhibitionRecord'
				? `/exhibitions`
				: null;

	const href = cover?.__typename === 'ExternalLinkRecord' ? cover.url : `${path}/${cover.slug}`;

	const variables = { first: 5 };
	const { allExhibitions, draftUrl: draftUrlExhibitions } = await apiQuery(AllExhibitionsDocument, {
		variables,
	});

	return (
		<>
			<Article
				image={image as FileField}
				href={href}
				noMargin={true}
				isHome={true}
				color={[255, 255, 255]}
			>
				<div className={s.container}>
					<InfiniteScrollClient
						id={'exhibitions'}
						query={AllExhibitionsDocument}
						variables={variables}
						initial={allExhibitions.map((exhibition, idx) => ({
							...exhibition,
							image: idx === 0 ? undefined : exhibition.image,
						}))}
					>
						{StartLink}
					</InfiniteScrollClient>
				</div>
			</Article>
			<DraftMode url={[draftUrl, draftUrlExhibitions]} path='/' />
		</>
	);
}
