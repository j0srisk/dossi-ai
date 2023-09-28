const Bubble = ({ message, user, loadDocument }) => {
	return (
		<div className={`w-full flex ${user ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`h-fit max-w-[85%] rounded-md p-3 text-white ${
					user ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-neutral-500'
				}`}
			>
				{message}
				<button onClick={() => loadDocument('b2f6d0f9-c0ee-4bb6-b2cf-4515755a3fad')}>DOC</button>
			</div>
		</div>
	);
};

export default Bubble;
