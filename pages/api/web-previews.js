import { withWebPreviewsEdge } from "dato-nextjs-utils/hoc";

export default withWebPreviewsEdge(async ({ item, itemType }) => {
	let path = null;

	const { slug } = item.attributes;
	const { api_key } = itemType.attributes;

	switch (api_key) {
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
		default:
			break;
	}

	return path;
});
