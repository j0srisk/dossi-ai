export default function ItemMenuButton({ setMenuOpen }) {
	return (
		<div
			className="relative flex h-full animate-grow items-center justify-center rounded-lg border border-neutral-300 bg-white px-1 shadow-sm transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-neutral-700 hover:bg-opacity-10"
			onClick={() => {
				setMenuOpen(true);
			}}
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
					d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
				/>
			</svg>
		</div>
	);
}
