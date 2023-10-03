const Bubble = ({ role, content, loadDocument, handleSetPageNumber, referencePage }) => {
	return (
		<div className={`w-full flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`h-fit flex flex-col gap-2 w-fit max-w-[85%] rounded-xl p-3 text-white ${
					role === 'user' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-neutral-500'
				}`}
			>
				{content}
				{referencePage && (
					<div className="flex flex-row items-center justify-start gap-2 w-full">
						<p>Page:</p>
						<button
							onClick={() => handleSetPageNumber(referencePage)}
							className="bg-gradient-to-br from-cyan-500 to-blue-500 h-6 w-6 aspect-square flex items-center justify-center rounded-full"
						>
							<p className="font-bold">{referencePage} </p>
						</button>
					</div>
				)}
				{/*
				<button onClick={() => loadDocument('b2f6d0f9-c0ee-4bb6-b2cf-4515755a3fad')}>DOC</button>
				*/}
			</div>
		</div>
	);
};

export default Bubble;
