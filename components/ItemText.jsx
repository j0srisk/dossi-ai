export default function ItemText({ text, subtext }) {
	return (
		<div className="relative flex w-full flex-col">
			<div className="text-lg font-bold">{text}</div>
			{subtext && <p className="text-sm text-neutral-500">{subtext}</p>}
		</div>
	);
}
