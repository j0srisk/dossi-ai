import useUser from '../hooks/useUser';
import { supabase } from '../services/supabase';
import Bubble from './chat/Bubble';
import { useState, useEffect, useCallback, useRef } from 'react';

const ChatContainer = ({
	collectionId,
	documentId,
	collections,
	documents,
	setDocumentFile,
	setPageNumber,
}) => {
	const messagesRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const [document, setDocument] = useState(null);
	const [collection, setCollection] = useState(null);
	const [generating, setGenerating] = useState(false);
	const [content, setContent] = useState('');

	const { profile } = useUser();

	useEffect(() => {
		if (documentId) {
			const currentDocument = documents.find((document) => document.id === documentId);
			setDocument(currentDocument);
			setCollection(null);
		} else {
			const currentCollection = collections.find((collection) => collection.id === collectionId);
			setCollection(currentCollection);
			setDocument(null);
		}
	}, [collectionId, documentId, collections, documents]);

	const loadMessages = useCallback(async () => {
		// wait for document or collection to be set
		if (!document && !collection) {
			return;
		}

		let query = supabase.from('chats').select('*');

		if (document) {
			query = query.eq('document', document.id);
		} else if (collection) {
			query = query.eq('collection', collection.id);
		}

		const { data, error } = await query;

		if (error) {
			console.log('error fetching chat');
			alert(error.message);
		} else {
			setMessages(data[0].messages);
			console.log('messages: ', data[0].messages);
		}
	}, [document, collection]);

	useEffect(() => {
		loadMessages();
	}, [document, collection, loadMessages]);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	const sendMessage = async (content) => {
		if (!content) {
			return;
		}
		setGenerating(true);
		const updatedMessagesWithUser = [...messages, { role: 'user', content }];

		setMessages(updatedMessagesWithUser);
		setContent('');

		const requestBody = {
			query: content,
		};

		if (document) {
			requestBody.document = document.id;
		} else if (collection) {
			requestBody.collection = collection.id;
		}

		const { error, response } = await fetch('/.netlify/functions/api/generate-with-references', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': profile.api_key,
			},
			body: JSON.stringify(requestBody),
		}).then((response) => response.json());

		console.log('response: ', response);
		if (error) {
			console.log('error generating response');
			alert(error.message);
		} else {
			setGenerating(false);
			const updatedMessagesWithAssistant = [...updatedMessagesWithUser, response];

			setMessages(updatedMessagesWithAssistant);
		}
	};

	return (
		<div className="w-full h-full flex flex-col items-center">
			<div className="w-full flex flex-row items-center justify-center gap-1 p-3 text-zinc-900 border-b border-neutral-300 shadow-sm ">
				{document && (
					<>
						<p className="text-center text-base font-bold">Chatting with</p>
						<p className="text-center text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">
							{document.name}
						</p>
					</>
				)}
				{collection && (
					<>
						<p className="text-center text-base font-bold">Chatting with</p>
						<p className="text-center text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">
							{collection.name}
						</p>
						<p className="text-center text-base font-bold ">collection</p>
					</>
				)}
			</div>
			<div
				className="w-full flex flex-1 flex-col items-start justify-start gap-4 h-full overflow-scroll px-3 py-3 max-w-screen-md"
				ref={messagesRef}
			>
				{messages.map((message, index) => (
					<Bubble
						key={index}
						role={message.role}
						content={message.content}
						setDocumentFile={setDocumentFile}
						setPageNumber={setPageNumber}
						referenceDocument={documents.find(
							(document) => document.id === message.referenceDocument,
						)}
						referencePage={message.referencePage}
					/>
				))}
				{generating && (
					<Bubble
						role="assistant"
						content={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6 animate-spin stroke-neutral-300"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
						}
					/>
				)}
			</div>
			<div className="flex flex-row items-center justify-center w-full border-t border-neutral-300 shadow-sm">
				<div className="max-w-screen-md w-full flex h-full p-3">
					<input
						type="text"
						placeholder="Type a message..."
						value={content}
						onChange={(e) => setContent(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && content && generating === false) {
								sendMessage(content);
							}
						}}
						className="w-full flex-1 rounded-l-md p-2 bg-transparent border-neutral-300 border border-r-0 outline-none text-zinc-900 shadow-sm"
					/>
					<button
						className="h-full rounded-r-md bg-gradient-to-r from-cyan-500 to-blue-500 p-2 text-white hover:from-cyan-600 hover:to-blue-600 hover:bg-opacity-90 hover:shadow-md px-6"
						onClick={() => sendMessage(content)}
						disabled={generating}
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
		</div>
	);
};

export default ChatContainer;
