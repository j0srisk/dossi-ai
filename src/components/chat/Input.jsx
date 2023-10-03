import { useState } from 'react';

const Input = ({ documentId, collectionId, generating, setGenerating, messages, setMessages }) => {
	const [query, setQuery] = useState('');

	const sendMessage = async (value) => {
		if (!value) {
			return;
		}
		setGenerating(true);
		const updatedMessagesWithUser = [...messages, { role: 'user', value }];

		setMessages(updatedMessagesWithUser);
		setQuery('');

		const requestBody = {
			query: value,
			collection: collectionId,
		};

		if (document) {
			requestBody.document = document.id;
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

	return null;
};

export default Input;
