export default function ItemIcon({ svg }) {
	return (
		<div className="flex h-full items-center justify-center rounded-md border border-neutral-300 bg-white px-2 shadow-sm">
			{svg}
		</div>
	);
}
