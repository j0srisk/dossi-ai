const Reference = ({ setActiveDocument, setReference, document, page }) => {
	return (
		<button
			className="hover:shadow-mc flex h-full w-fit items-center justify-center rounded-md border border-neutral-300 bg-white text-zinc-600 shadow-sm transition-all hover:bg-neutral-700 hover:bg-opacity-10 hover:text-neutral-700"
			onClick={() => setReference(document, page)}
		>
			{document && (
				<>
					<p className="px-2 py-1">{document.name}</p>
					<div className="h-full w-[1px] bg-neutral-300"></div>
				</>
			)}
			<p className="min-w-[30px] px-2 py-1 font-bold">{page}</p>
		</button>
	);
};

export default Reference;
