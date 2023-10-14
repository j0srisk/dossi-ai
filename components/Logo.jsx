export default function Logo() {
	return (
		<div className="flex w-full flex-col items-center justify-center p-6">
			<div className="flex items-center gap-3 rounded-md p-2 font-ar-one-sans text-white shadow-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className="h-14 w-14 stroke-white transition-all duration-500 ease-in-out group-hover:stroke-accent"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
					/>
				</svg>

				<h1 className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-center text-6xl font-bold text-white">
					Dossi
				</h1>
			</div>
		</div>
	);
}
