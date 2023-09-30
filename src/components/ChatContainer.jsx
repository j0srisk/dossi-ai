import { supabase } from '../services/supabase';
import Bubble from './chat/Bubble';
import { useState, useEffect, useCallback } from 'react';

const ChatContainer = ({ collection, document, loadDocument }) => {
	const [content, setContent] = useState('');
	const [generating, setGenerating] = useState(false);
	const [messages, setMessages] = useState([]);

	const loadChat = useCallback(async () => {
		if (document) {
			const { data, error } = await supabase.from('chats').select('*').eq('document', document.id);
			if (error) {
				console.log('error fetching chat');
				alert(error.message);
			} else {
				setMessages(data[0].messages);
				console.log('data: ', data[0].messages);
			}
		}
	}, [document]);

	useEffect(() => {
		loadChat();
	}, [document, loadChat]);

	const sendMessage = async (content) => {
		if (!content) {
			return;
		}
		setGenerating(true);
		const updatedMessagesWithUser = [...messages, { role: 'user', content }];

		setMessages(updatedMessagesWithUser);
		setContent('');
		const { error, response } = await fetch('/.netlify/functions/api/generate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ query: content, documentId: document.id }),
		}).then((response) => response.json());

		console.log('response: ', response);
		if (error) {
			console.log('error generating response');
			alert(error.message);
		} else {
			setGenerating(false);
			const updatedMessagesWithAssistant = [
				...updatedMessagesWithUser,
				{ role: 'assistant', content: response },
			];

			setMessages(updatedMessagesWithAssistant);
		}
	};

	return (
		<div className="w-full h-full flex flex-col gap-2 items-center max-w-screen-md">
			<div className="w-full flex flex-row items-center justify-center gap-1 p-3 bg-transparent rounded-md border border-transparent">
				{document && (
					<>
						<p className="text-center text-base font-bold text-white">Chatting with:</p>
						<p className="text-center text-base text-cyan-500 font-bold">{document.name}</p>
					</>
				)}
				{!document && (
					<>
						<p className="text-center text-base font-bold text-white">Chatting with entire:</p>
						<p className="text-center text-base text-cyan-500 font-bold">{collection.name}</p>
					</>
				)}
			</div>
			<div className="w-full flex flex-1 flex-col items-start justify-start gap-4 h-full overflow-scroll">
				{messages.map((message, index) => (
					<Bubble
						key={index}
						role={message.role}
						content={message.content}
						loadDocument={loadDocument}
					/>
				))}
				{generating && (
					<Bubble role="assistant" content="Generating response..." loadDocument={loadDocument} />
				)}
			</div>
			<div className="flex flex-row items-center justify-center w-full">
				<input
					type="text"
					placeholder="Type a message..."
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							sendMessage(content);
						}
					}}
					className="w-full flex-1 rounded-l-md p-2 bg-transparent border-neutral-500 border border-r-0 outline-none text-white"
				/>
				<button
					className="h-full rounded-r-md bg-gradient-to-r from-cyan-500 to-blue-500 p-2 text-white hover:from-cyan-600 hover:to-blue-600 hover:bg-opacity-90 hover:shadow-md px-6"
					onClick={() => sendMessage(content)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 flex-shrink-0"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default ChatContainer;
