'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
	const router = useRouter();

	return (
		<button
			className="flex h-full w-full items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10"
			onClick={() => router.back()}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="h-4 w-4"
			>
				<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
			</svg>

			<p className="flex-1 text-left text-sm font-bold">Back</p>
		</button>
	);
}
