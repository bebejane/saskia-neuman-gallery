import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Link from "next/link";
import truncateMarkdown from "markdown-truncate";
import remarkBreaks from "remark-breaks";

const Markdown = ({ children, truncate, className }) => {
	if (!children) return null;

	children = !truncate ? children : truncateMarkdown(children, { limit: truncate, ellipsis: true });

	return (
		<ReactMarkdown
			remarkPlugins={[gfm, remarkBreaks]}
			children={children}
			className={className}
			components={{
				a: ({ node, ...props }) => (
					<Link prefetch={false} href={props.href} scroll={false}>
						{props.children[0]}
					</Link>
				),
			}}
		/>
	);
};

export default Markdown;
