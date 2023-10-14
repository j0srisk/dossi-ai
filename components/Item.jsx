export default function Item({ children, menuOpen }) {
	return (
		<div className="group relative flex h-16 w-full items-center justify-between gap-2 rounded-lg py-2 text-neutral-900 transition-all duration-300 ease-in-out">
			{children}
			<div
				className={`absolute -left-2 z-10  h-full w-[calc(100%+1rem)] rounded-lg bg-neutral-100 ${
					menuOpen ? 'block' : 'hidden group-hover:block'
				}`}
			/>
		</div>
	);
}
