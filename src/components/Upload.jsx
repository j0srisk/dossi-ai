const Upload = () => {
	return (
		<button className="flex items-center justify-center gap-1 rounded-md border-2 border-dashed border-neutral-500 p-2 text-neutral-500">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="h-4 w-4"
			>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>

			<p className="text-center text-base ">Upload PDF</p>
		</button>
	);
};

export default Upload;
