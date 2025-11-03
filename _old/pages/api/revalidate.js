import { withRevalidate } from "dato-nextjs-utils/hoc";
import { apiQuery } from "dato-nextjs-utils/api";
import { GetExhibitionById } from "/graphql";

export default withRevalidate(async (record, revalidate) => {
	const paths = [];
	const { api_key } = record.model;
	const { slug } = record;

	switch (api_key) {
		case "start":
			paths.push(`/`);
			break;
		case "about":
		case "external_link":
			paths.push(`/about`);
			break;
		case "exhibition":
			paths.push(`/exhibitions/${slug}`);
			break;
		case "happening":
			paths.push(`/happenings/${slug}`);
			break;
		case "artist":
			paths.push(`/artists/${slug}`);
			break;
		case "press":
			const { exhibition } = await apiQuery(GetExhibitionById, {
				variables: { id: record.exhibition },
			});
			exhibition && paths.push(`/exhibitions/${exhibition.slug}`);
			break;
		default:
			break;
	}

	await revalidate(paths);
});
