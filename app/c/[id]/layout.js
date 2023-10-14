import { getTopic } from '@/app/c/utils';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ChatLayout({ params, children }) {
	const topic = await getTopic(params.id);

	if (!topic) {
		//redirect('/c');
	}

	return (
		<div className="flex h-screen w-screen flex-col">
			<Navbar>
				<div className="flex flex-1 items-center">
					<div className="w-fit">
						<Link
							href="/collections"
							className="flex h-full w-full items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="h-4 w-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 19.5L8.25 12l7.5-7.5"
								/>
							</svg>

							<p className="flex-1 text-left text-sm font-bold">Collections</p>
						</Link>
					</div>
				</div>
				<div className="flex gap-1 font-inter">
					<p className="text-center text-base font-bold text-white">Chatting with</p>
					<div className="flex">
						<p className="bg-gradient-to-r from-accent to-lime-400 bg-clip-text text-center text-base font-bold text-transparent">
							{topic.name}
						</p>
					</div>
					{topic.type === 'collection' && (
						<p className="text-center text-base font-bold text-white">Collection</p>
					)}
				</div>
				<div className="flex flex-1 items-center justify-end">
					<div className="w-fit">
						<Link
							href={'/c/' + topic.id}
							className="flex h-full w-full items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10"
						>
							<p className="flex-1 text-left text-sm font-bold">New Chat</p>
						</Link>
					</div>
				</div>
			</Navbar>
			{children}
		</div>
	);
}
