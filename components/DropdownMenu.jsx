export default function DropDownMenu({ children, top }) {
	return (
		<>
			<div
				className={`absolute right-0 z-30 flex flex-col justify-center overflow-visible rounded-lg border border-neutral-200 bg-white p-1 shadow-lg ${top}`}
			>
				{children}
			</div>
			<div className="fixed left-0 top-0 z-20 h-full w-full bg-black bg-opacity-10" />
		</>
	);
}
