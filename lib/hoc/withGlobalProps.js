import { apiQuery, SEOQuery } from 'dato-nextjs-utils/api';
import { GetGlobal } from '/graphql';

export default function withGlobalProps(opt = {}, callback) {
	callback = typeof opt === 'function' ? opt : callback;

	const revalidate = parseInt(process.env.REVALIDATE_TIME || 60);

	const queries = [GetGlobal];
	const params = {};

	if (opt.query) queries.push(opt.query);
	if (opt.queries) queries.push.apply(queries, opt.queries);
	if (opt.model) queries.push(SEOQuery(opt.model));

	return async (context) => {
		const props = await apiQuery(queries, params, context.preview);

		if (callback) return await callback({ context, props: { ...props }, revalidate });
		else return { props: { ...props }, context, revalidate };
	};
}
