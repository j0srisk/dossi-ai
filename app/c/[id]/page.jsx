import { getTopic, getMessages, getDocuments } from '@/app/c/utils';
import BackButton from '@/components/BackButton';
import ChatContainer from '@/components/ChatContainer';
import Message from '@/components/Message';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

//page for existing chats
const ChatPage = async ({ params }) => {
	const topic = await getTopic(params.id);
	let documents = null;

	if (!topic) {
		redirect('/404');
	}

	if (topic.type === 'collection') {
		documents = await getDocuments(topic.id);
	}

	return (
		<div className="flex h-screen w-screen flex-col">
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
							{topic.name}
						</p>
					</div>
					{topic.type === 'collection' && (
						<p className="text-center text-base font-bold text-white">Collection</p>
					)}
				</div>
				<div className="flex flex-1 items-center justify-end"></div>
			</Navbar>
			<ChatContainer topic={topic} documents={documents} />
		</div>
	);
};

export default ChatPage;
