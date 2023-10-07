import useUser from '../hooks/useUser';
import { supabase } from '../services/supabase';
import Bubble from './chat/Bubble';
import Query from './chat/Query';
import { useState, useEffect, useCallback, useRef } from 'react';

const ChatContainer = ({
	collectionId,
	documentId,
	collections,
	documents,
	setPageNumber,
	handleSetDocument,
}) => {
	const messagesRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const [document, setDocument] = useState(null);
	const [collection, setCollection] = useState(null);
	const [generating, setGenerating] = useState(false);
	const [text, setText] = useState('');

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
		setText('');

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
		<div className="h-full w-full flex flex-col items-center flex-1 bg-white">
			<div className="flex flex-1 flex-col overflow-scroll w-full" ref={messagesRef}>
				{messages.map((message, index) => (
					<Bubble
						key={index}
						role={message.role}
						content={message.content}
						setPageNumber={setPageNumber}
						referenceDocument={documents.find(
							(document) => document.id === message.referenceDocument,
						)}
						referencePage={message.referencePage}
						handleSetDocument={handleSetDocument}
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
								className="w-8 h-8 animate-spin stroke-neutral-300"
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
			<div className="flex flex-col h-fit items-center justify-center p-3 w-full border-t border-neutral-300">
				<Query sendMessage={sendMessage} text={text} setText={setText} generating={generating} />
			</div>
		</div>
	);
};

export default ChatContainer;
