export default function ItemText({ text, subtext, badge }) {
	return (
		<div className="relative flex w-full flex-col overflow-hidden ">
			<div className="flex items-center gap-2">
				<div className="whitespace-nowrap text-lg font-bold">{text}</div>
				{badge && (
					<div className="flex h-fit items-center justify-center rounded-md bg-accent p-0.5 px-1 text-xs font-bold text-white">
						{badge}
					</div>
				)}
			</div>
			{subtext && <p className="text-sm text-neutral-500">{subtext}</p>}
		</div>
	);
}
