const Document = ({ id, activeDocument, setActiveDocument }) => {
	const handleClick = () => {
		setActiveDocument(id);
	};

	return (
		<button
			className={`flex rounded-md border-2 p-2 ${
				id === activeDocument ? 'border-neutral-800 bg-neutral-800' : 'border-transparent'
			}`}
			onClick={handleClick}
		>
			<p className="text-left text-base">DocumentName.pdf</p>
		</button>
	);
};

export default Document;
