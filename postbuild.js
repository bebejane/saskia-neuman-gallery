const path = require("path");
const fs = require("fs");

const CSS_PATH = path.resolve(__dirname, "./.next/static/css");
const CSS_FILENAMES = fs.readdirSync(CSS_PATH);

console.log(`Merging ${CSS_FILENAMES.length} CSS files...`);

const GLOBAL_CSS_FILENAME = CSS_FILENAMES.find((file) => {
	const FILE_PATH = path.join(CSS_PATH, file);
	const data = fs.readFileSync(FILE_PATH, "utf8");
	return data.startsWith("html");
});

if (!GLOBAL_CSS_FILENAME) {
	console.error("No global CSS file found!");
	process.exit(1);
}

const GLOBAL_CSS_PATH = path.join(CSS_PATH, GLOBAL_CSS_FILENAME);

CSS_FILENAMES.filter((name) => name !== GLOBAL_CSS_FILENAME).forEach((file) => {
	const FILE_PATH = path.join(CSS_PATH, file);
	const data = fs.readFileSync(FILE_PATH, "utf8");

	fs.appendFileSync(GLOBAL_CSS_PATH, data);
	fs.truncateSync(FILE_PATH, 0);
});

console.log("Done!");
