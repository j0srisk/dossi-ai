import Link from 'next/link';

export default function ItemButtonContainer({ href, text }) {
	if (!href) {
		href = '/';
	}

	return (
		<Link
			href={href}
			className="flex h-full animate-grow items-center rounded-lg border border-neutral-300 bg-white px-4 shadow-sm transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-neutral-700 hover:bg-opacity-10"
		>
			<p className="whitespace-nowrap text-xs font-bold">{text}</p>
		</Link>
	);
}
