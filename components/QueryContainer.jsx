'use client';

import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export default function QueryContainer({ topic, updateMessages, setGenerating, chatId }) {
	const [text, setText] = useState('');

	const sendMessage = async (text) => {
		if (!text) {
			return;
		}

		setText('');
		setGenerating(true);
		updateMessages({ role: 'user', content: text });

		let endpoint;

		if (topic.type === 'document') {
			endpoint = 'documentId';
		} else if (topic.type === 'collection') {
			endpoint = 'collectionId';
		}

		console.log(chatId);

		const body = {
			query: text,
			[endpoint]: topic.id,
			chatId: chatId,
		};

		fetch('/api/chat', {
			method: 'POST',
			body: JSON.stringify(body),
		})
			.then((response) => {
				if (response.status === 500) {
					throw new Error('Internal Server Error');
				}

				return response.json();
			})
			.then((data) => updateMessages(data))
			.then(() => {
				setGenerating(false);
			})
			.catch((error) => {
				updateMessages({ role: 'assistant', content: error.message });
				console.error(error);
			});
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
