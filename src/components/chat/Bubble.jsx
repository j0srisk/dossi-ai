const Bubble = ({
	role,
	content,
	setPageNumber,
	referencePage,
	referenceDocument,
	handleSetDocument,
}) => {
	return (
		<div className={`w-full flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`h-fit flex flex-col gap-2 w-fit max-w-[85%] rounded-md border border-neutral-300 p-3 items-start text-white ${
					role === 'user' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-neutral-700'
				}`}
			>
				{content}
				{referenceDocument && (
					<div className="flex flex-row  gap-2 w-full">
						<p>Reference:</p>
						<button
							onClick={() => {
								handleSetDocument(referenceDocument, referencePage);
							}}
							className="flex gap-2"
						>
							<p className="font-bold">{referenceDocument.name} </p>
							<p className="font-bold bg-gradient-to-br from-cyan-500 to-blue-500 h-6 w-6 aspect-square flex items-center justify-center rounded-full">
								{referencePage}{' '}
							</p>
						</button>
					</div>
				)}
				{!referenceDocument && referencePage && (
					<div className="flex flex-row items-center justify-start gap-2 w-full">
						<p>Reference:</p>
						<button
							onClick={() => setPageNumber(referencePage)}
							className="bg-gradient-to-br from-cyan-500 to-blue-500 h-6 w-6 aspect-square flex items-center justify-center rounded-full"
						>
							<p className="font-bold">{referencePage} </p>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Bubble;
