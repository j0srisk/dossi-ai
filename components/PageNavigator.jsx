export default function PageNavigator({ numPages, page, setPage }) {
	return (
		<div className="group absolute right-6 top-6 z-20 flex items-center  gap-2 rounded-md border border-neutral-300 bg-white p-1 text-neutral-300 opacity-50 shadow-sm hover:bg-neutral-700 hover:bg-opacity-10 hover:opacity-100 hover:shadow-md">
			<button
				className="flex h-full items-center justify-center hover:text-neutral-700 "
				onClick={() => setPage(page - 1)}
				disabled={page === 1}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
					/>
				</svg>
			</button>
			<p className="group-hover:text-neutral-700">
				{page} / {numPages}
			</p>
			<button
				className="flex h-full items-center justify-center  hover:text-neutral-700 "
				onClick={() => setPage(page + 1)}
				disabled={page === numPages}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
					/>
				</svg>
			</button>
		</div>
	);
}
