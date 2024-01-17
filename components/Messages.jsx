import Message from './Message';

export default function Messages({ clientMessages, documents, setActiveDocument, setReference }) {
	return (
		<>
			{clientMessages.map((message, index) => (
				<div className="w-full" key={index}>
					<Message
						message={message}
						setActiveDocument={setActiveDocument}
						setReference={setReference}
						documents={documents}
					/>
				</div>
			))}
		</>
	);
}
