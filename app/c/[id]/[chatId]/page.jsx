import { getTopic, getMessages } from '@/app/c/utils';
import ChatContainer from '@/components/ChatContainer';
import { redirect } from 'next/navigation';

//page for existing chats
const ChatPage = async ({ params }) => {
	if (
		!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(params.chatId)
	) {
		redirect('/c');
	}

	const topic = await getTopic(params.id);

	const messages = await getMessages(params.chatId);

	if (!messages) {
		//redirect('/c');
	}

	return <ChatContainer topic={topic} messages={messages} chatId={params.chatId} />;
};

export default ChatPage;
