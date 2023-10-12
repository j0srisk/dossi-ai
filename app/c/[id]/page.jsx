import ChatContainer from '@/components/ChatContainer';
import DeleteChatButton from '@/components/DeleteChatButton';
import Navbar from '@/components/Navbar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Page({ params }) {
	const supabase = createServerComponentClient({ cookies });

	let topic = null;
	let messages = null;

	const { data: collection } = await supabase
		.from('collections')
		.select()
		.eq('id', params.id)
		.single();

	if (!collection) {
		const { data: document } = await supabase
			.from('documents')
			.select()
			.eq('id', params.id)
			.single();

		if (!document) {
			return <div>Document or Collection could not be found</div>;
		} else {
			topic = document;
			topic.type = 'document';
		}
	} else {
		topic = collection;
		topic.type = 'collection';
	}

	if (!topic) {
		return <div>Document or Collection could not be found</div>;
	}

	const { data: chats } = await supabase.from('chats').select().eq(topic.type, topic.id);
	messages = chats[0].messages || [];

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
				<div className="font-inter flex gap-1">
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
					<DeleteChatButton topic={topic} />
				</div>
			</Navbar>
			<ChatContainer topic={topic} messages={messages} />
		</div>
	);
}
