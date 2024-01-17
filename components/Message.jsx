import Reference from '@/components/Reference';

export default function Message({ message, setActiveDocument, setReference, documents, children }) {
	return (
		<div
			className={`flex w-full items-center justify-center p-6 text-neutral-900  ${
				message.role === 'user' ? 'bg-white' : 'bg-neutral-100'
			}`}
		>
			<div className="flex w-full max-w-screen-md gap-6">
				<div
					className={`flex h-8 w-8 flex-shrink-0 items-center justify-center text-white ${
						message.role === 'user' ? 'rounded-full bg-accent' : 'rounded-lg bg-neutral-700'
					}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="h-4 w-4"
					>
						{message.role === 'user' && (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							/>
						)}

						{message.role === 'assistant' && (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
							/>
						)}
					</svg>
				</div>
				<div className="flex flex-col gap-6 pt-1">
					{message.content}
					{children}
					{message.referencePage || message.referenceDocument ? (
						<>
							{documents ? (
								<Reference
									setActiveDocument={setActiveDocument}
									setReference={setReference}
									document={documents.find((document) => document.id === message.referenceDocument)}
									page={message.referencePage}
								/>
							) : (
								<Reference
									setActiveDocument={setActiveDocument}
									setReference={setReference}
									page={message.referencePage}
								/>
							)}
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}
