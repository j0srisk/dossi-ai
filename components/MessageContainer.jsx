'use client';

import Message from '@/components/Message';

const MessageContainer = ({ messages }) => {
	console.log(messages);
	return (
		<div className="flex h-full flex-col gap-4 bg-white">
			{messages.map((message) => (
				<div className="w-full" key={message.id}>
					<Message role={message.role} text={message.content} />
				</div>
			))}
		</div>
	);
};

export default MessageContainer;
