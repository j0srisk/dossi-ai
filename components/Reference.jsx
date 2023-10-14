export default function Reference({ setActiveDocument, setReference, document, page }) {
	return (
		<button
			className="flex h-full w-fit items-center justify-center rounded-lg border border-neutral-300 bg-white text-sm font-bold text-neutral-900 shadow-sm transition-all duration-300 ease-out hover:bg-neutral-700 hover:bg-opacity-10"
			onClick={() => setReference(document, page)}
		>
			{document && <p className="px-2 py-1">{document.name}</p>}
			{document && page && <div className="h-full w-[1px] bg-neutral-300"></div>}
			{page && <p className="min-w-[30px] px-2 py-1">{page}</p>}
		</button>
	);
}
