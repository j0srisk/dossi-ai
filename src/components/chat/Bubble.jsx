const Bubble = ({
	role,
	content,
	scrollToPage,
	referencePage,
	referenceDocument,
	handleSetDocument,
}) => {
	return (
		<div
			className={`w-full flex text-zinc-900 p-6 items-center outline outline-1 outline-neutral-300 justify-center ${
				role === 'user' ? 'bg-white' : 'bg-neutral-100'
			}`}
		>
			<div className="max-w-screen-md flex w-full gap-6">
				<div
					className={`h-8 w-8 flex flex-shrink-0 items-center justify-center text-white ${
						role === 'user' ? 'bg-blue-500 rounded-full' : 'bg-neutral-700 rounded-md'
					}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-4 h-4"
					>
						{role === 'user' && (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							/>
						)}

						{role === 'assistant' && (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
							/>
						)}
					</svg>
				</div>
				<div className="flex flex-col gap-6">
					{content}
					{referenceDocument && (
						<div className="flex flex-row gap-2 w-full">
							<button
								className="rounded-md flex items-center h-full text-zinc-600 gap-2 justify-center bg-white border-neutral-300 border shadow-sm hover:shadow-mc hover:bg-neutral-700 hover:text-neutral-700 hover:bg-opacity-10 transition-all"
								onClick={() => {
									handleSetDocument(referenceDocument, referencePage);
								}}
							>
								<p className="pl-2 py-1">{referenceDocument.name}</p>
								<div className="h-full w-[1px] bg-neutral-300"></div>
								<p className="font-bold pr-2 py-1 min-w-[30px]">{referencePage}</p>
							</button>
						</div>
					)}
					{!referenceDocument && referencePage && (
						<div className="flex flex-row gap-2 w-full">
							<button
								className="rounded-md flex items-center h-full text-neutral-600 gap-2 justify-center bg-white border-neutral-300 border shadow-sm hover:shadow-md hover:bg-neutral-700 hover:text-neutral-700 hover:bg-opacity-10 transition-all"
								onClick={() => {
									scrollToPage(referencePage);
								}}
							>
								<p className="font-bold px-2 py-1 min-w-[30px]">Page {referencePage}</p>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Bubble;
