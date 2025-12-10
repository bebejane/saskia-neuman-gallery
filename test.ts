import 'dotenv/config';
import { apiQuery } from 'next-dato-utils/api';
import fs from 'fs';
import { MenuDocument } from '@/graphql';

(async () => {
	const menu = await apiQuery(MenuDocument);
	fs.writeFileSync('./menu.json', JSON.stringify(menu, null, 2));
})();
