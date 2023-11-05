'use client';

import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export default function QueryContainer({ topic, updateMessages, setGenerating, chatId }) {
	const [text, setText] = useState('');

	const getAssistantMessage = async (userMessage) => {
		const text = userMessage.content;

		let endpoint;

		if (topic.type === 'document') {
			endpoint = 'documentId';
		} else if (topic.type === 'collection') {
			endpoint = 'collectionId';
		}

		//creates the body of the request
		const body = {
			messages: [userMessage],
			[endpoint]: topic.id,
		};

		//gets ai response
		const res = await fetch('/api/generate', {
			method: 'POST',
			body: JSON.stringify(body),
		});

		const data = await res.json();

		return data.choices[0].message;
	};

	const getPreviousMessages = async () => {
		const res = await fetch(`/api/chat/${chatId}`);

		const data = await res.json();

		return data.messages;
	};

	const sendMessage = async (text) => {
		//don't send empty messages
		if (!text) {
			return;
		}

		//clear the input
		setText('');
		//show the loading indicator
		setGenerating(true);
		//adds the message to the local chat state
		updateMessages({ role: 'user', content: text });

		//creates array of previous messages from the database
		const previousMessages = await getPreviousMessages();

		//creates the user message object
		const userMessage = { role: 'user', content: text };

		//creates the ai message object
		//TODO: modify this to provide context
		const assistantMessage = await getAssistantMessage(userMessage);

		//updates the database with the new messages

		await fetch(`/api/chat/${chatId}`, {
			method: 'PATCH',
			body: JSON.stringify({
				messages: [...previousMessages, userMessage, assistantMessage],
			}),
		});

		updateMessages(assistantMessage);
		setGenerating(false);
	};

	return (
		<div className="flex w-full items-center justify-center border-t border-neutral-300 p-4">
			<div className="flex w-full max-w-screen-md items-center justify-center rounded-md border border-neutral-300 text-zinc-900 shadow-sm outline-none">
				<TextareaAutosize
					className="w-full resize-none rounded-md p-2 outline-none "
					rows={1}
					maxRows={10}
					placeholder="Type a message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							sendMessage(text);
						}
					}}
				/>
				<div
					className="group flex h-full items-center justify-center rounded-r-md border-neutral-300 px-2 hover:cursor-pointer"
					onClick={() => sendMessage(text)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={`h-5 w-5 group-hover:text-accent ${
							text ? 'text-zinc-900' : 'text-gray-400 '
						}}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}
