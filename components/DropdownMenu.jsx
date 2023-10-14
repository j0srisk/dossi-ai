export default function DropDownMenu({ children, top, setMenuOpen }) {
	return (
		<>
			<div
				className={`absolute right-0 z-50 flex flex-col justify-center overflow-visible rounded-lg border border-neutral-200 bg-white p-1 shadow-lg ${top}`}
				onClick={() => setMenuOpen(false)}
			>
				{children}
			</div>
			<div
				className="fixed left-0 top-0 z-40 h-full w-full bg-black bg-opacity-10"
				onClick={() => setMenuOpen(false)}
			/>
		</>
	);
}
