'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const QueryContainer = ({ topic, updateMessages }) => {
	const [text, setText] = useState('');

	const sendMessage = async (text) => {
		if (!text) {
			return;
		}

		updateMessages({ role: 'user', content: text });

		let endpoint;

		if (topic.type === 'document') {
			endpoint = 'documentId';
		} else if (topic.type === 'collection') {
			endpoint = 'collectionId';
		}

		const body = {
			query: text,
			[endpoint]: topic.id,
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
			.catch((error) => {
				updateMessages({ role: 'assistant', content: error.message });
				console.error(error);
			});

		setText('');
	};

	return (
		<div className="flex border-t border-neutral-300 p-4">
			<div className="flex w-full max-w-screen-md rounded-md border border-neutral-300 text-zinc-900 shadow-sm outline-none">
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
					className="group flex h-full items-center rounded-r-md border-neutral-300 px-2 hover:cursor-pointer"
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
};

export default QueryContainer;
