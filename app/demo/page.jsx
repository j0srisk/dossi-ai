import { getTopic } from '@/app/c/utils';
import BackButton from '@/components/BackButton';
import ChatContainer from '@/components/ChatContainer';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DemoPage() {
	const topic = { type: 'collection', id: 'demo' };

	const messages = [];

	return (
		<div className="flex h-screen w-screen flex-col">
			<>
				<Navbar>
					<div className="flex flex-1 items-center">
						<div className="w-fit">
							<BackButton />
						</div>
					</div>
					<div className="flex gap-1 font-inter">
						<p className="text-center text-base font-bold text-white">Chatting with</p>
						<div className="flex">
							<p className="bg-gradient-to-r from-accent to-lime-400 bg-clip-text text-center text-base font-bold text-transparent">
								Demo
							</p>
						</div>
						<p className="text-center text-base font-bold text-white">Collection</p>
					</div>
					<div className="flex flex-1 items-center justify-end">
						<div className="w-fit">
							<button className="flex h-full w-full items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10">
								<p className="flex-1 text-left text-sm font-bold">New Chat</p>
							</button>
						</div>
					</div>
				</Navbar>
				<ChatContainer topic={topic} messages={messages} />
			</>
		</div>
	);
}
