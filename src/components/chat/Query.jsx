import { useRef, useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const Query = ({ sendMessage, text, setText, generating }) => {
	const refContainer = useRef(null);
	const [width, setWidth] = useState(null);

	const handleResize = () => {
		setWidth(refContainer.current.offsetWidth - 8);
	};

	useEffect(() => {
		if (refContainer.current) {
			handleResize();
		}

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<>
			<div
				className="w-full flex flex-1 rounded-md border-neutral-300 border outline-none text-zinc-900 max-w-screen-md"
				ref={refContainer}
			>
				<TextareaAutosize
					className="outline-none resize-none w-full p-2 rounded-md"
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
					className="flex items-center group hover:cursor-pointer px-2 h-full"
					onClick={() => sendMessage(text)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5 text-neutral-300 group-hover:text-blue-500 "
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
