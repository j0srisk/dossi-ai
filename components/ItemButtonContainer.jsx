export default function ItemButtonContainer({ children, menuOpen }) {
	return (
		<div
			className={`h-full items-center gap-2 py-2 ${menuOpen ? 'flex' : 'hidden group-hover:flex'} `}
		>
			{children}
		</div>
	);
}
