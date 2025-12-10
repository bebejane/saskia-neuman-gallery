export default function RootArticle({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
