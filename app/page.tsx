import s from './page.module.scss';
import { AllExhibitionsStartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode, InfiniteScrollClient } from 'next-dato-utils/components';
import { Article } from '@/components/Article';
import { StartLink } from '@/components/StartLink';
import { Loader } from '@/components/Loader';

export default async function Home({}: PageProps<'/'>) {
	const variables = { first: 5 };
	const { allExhibitions, draftUrl } = await apiQuery(AllExhibitionsStartDocument, {
		variables,
	});
	const cover = allExhibitions[0];
	const image = cover?.image ?? null;
	const href = `/exhibitions/${cover.slug}`;

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
						query={AllExhibitionsStartDocument}
						variables={variables}
						initial={allExhibitions.map((exhibition, idx) => ({
							...exhibition,
							image:
								idx === 0 ? { ...exhibition.image, responsiveImage: undefined } : exhibition.image,
						}))}
						loader={
							<div className={s.loading}>
								<Loader />
							</div>
						}
					>
						{StartLink}
					</InfiniteScrollClient>
				</div>
			</Article>
			<DraftMode url={draftUrl} path='/' />
		</>
	);
}
