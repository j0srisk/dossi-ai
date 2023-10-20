import { getTopic } from '@/app/c/utils';
import ChatContainer from '@/components/ChatContainer';
import { redirect } from 'next/navigation';

//page for new chats
const ChatPage = async ({ params }) => {
	const newChatId = crypto.randomUUID();

	redirect(`/c/${params.id}/${newChatId}`);

	{
		/*
	const topic = await getTopic(params.id);

	if (!topic) {
		return <div>Topic not found</div>;
	}


	return <ChatContainer topic={topic} />;
	*/
	}
};

export default ChatPage;
