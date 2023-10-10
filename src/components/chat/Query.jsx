import TextareaAutosize from 'react-textarea-autosize';

const Query = ({ sendMessage, text, setText, generating }) => {
	return (
		<>
			<div className="flex w-full max-w-screen-md flex-1 rounded-md border border-neutral-300 text-zinc-900 shadow-sm outline-none">
				<TextareaAutosize
					className="w-full resize-none rounded-md p-2 outline-none "
					rows={1}
					maxRows={10}
					placeholder="Type a message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey && text && generating === false) {
							e.preventDefault();
							sendMessage(text);
						}
					}}
				/>
				<div
					className="group flex h-full items-center rounded-r-md border-neutral-300 px-2 hover:cursor-pointer"
					onClick={() => sendMessage(text)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={`h-5 w-5 group-hover:text-accent ${
							text ? 'text-zinc-900' : 'text-gray-400 '
						}}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
						/>
					</svg>
				</div>
			</div>
		</>
	);
};

export default Query;
