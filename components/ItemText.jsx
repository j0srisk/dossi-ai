export default function ItemText({ text, subtext }) {
	return (
		<div className="relative flex w-full flex-col overflow-hidden ">
			<div className="whitespace-nowrap text-lg font-bold">{text}</div>
			{subtext && <p className="text-sm text-neutral-500">{subtext}</p>}
		</div>
	);
}
