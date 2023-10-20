export default function FaqItem({ active, setActive, index, question, answer }) {
	return (
		<div className="flex w-full flex-col p-4 hover:cursor-pointer" onClick={() => setActive(index)}>
			<div className="flex w-full items-center justify-between gap-4">
				<p className="text-lg">{question}</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className="h-5 w-5"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
			</div>
			{active === index && <p className="mt-2 text-sm text-neutral-500">{answer}</p>}
		</div>
	);
}
