import { withWebPreviewsEdge } from "dato-nextjs-utils/hoc";
import { apiQuery } from "dato-nextjs-utils/api";
import { GetExhibitionById } from "/graphql";

export const config = {
	runtime: "edge",
};

export default withWebPreviewsEdge(async ({ item, itemType }) => {
	let path = null;

	const { slug } = item.attributes;

	switch (itemType.attributes.api_key) {
		case "start":
			path = `/`;
			break;
		case "about":
		case "external_link":
			path = `/about`;
			break;
		case "exhibition":
			path = `/exhibitions/${slug}`;
			break;
		case "happening":
			path = `/happenings/${slug}`;
			break;
		case "artist":
			path = `/artists/${slug}`;
			break;
		case "press":
			const { exhibition } = await apiQuery(GetExhibitionById, {
				variables: { id: item.attributes.exhibition },
			});
			path = `/exhibitions/${exhibition?.slug}`;
			break;
		default:
			break;
	}

	return path;
});
