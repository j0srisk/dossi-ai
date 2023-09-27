import Bubble from './chat/Bubble';

const ChatContainer = () => {
	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex flex-1 flex-col items-start justify-start gap-4">
				<Bubble message={'Program Message'} user={false} />
				<Bubble message={'User Message'} user={true} />
			</div>
			<div className="flex flex-row items-center justify-center gap-2">
				<input
					type="text"
					placeholder="Type a message..."
					className="w-full flex-1 rounded-md p-2 bg-transparent border-neutral-500 border outline-none text-white"
					style={{ overflowY: 'auto', resize: 'none' }}
				/>
				<button className="h-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 p-2  hover:from-cyan-600 hover:to-blue-600 hover:bg-opacity-90 hover:shadow-md px-6">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 flex-shrink-0"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default ChatContainer;
