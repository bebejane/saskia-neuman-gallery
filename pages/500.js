import Link from "next/link";

export default function FiveZeroZero() {
	return (
		<div id="error-505">
			<h1>500 - Server-side error occurred</h1>
			<Link prefetch={false} href="/">
				Go back home
			</Link>
		</div>
	);
}
