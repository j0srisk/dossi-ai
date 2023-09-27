const Bubble = ({ message, user }) => {
	return (
		<div className={`w-full flex ${user ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`h-fit max-w-[85%] rounded-md p-3 ${
					user ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-neutral-500'
				}`}
			>
				{message}
			</div>
		</div>
	);
};

export default Bubble;
