const Bubble = ({ role, content, loadDocument }) => {
	return (
		<div className={`w-full flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`h-fit max-w-[85%] rounded-xl p-3 text-white ${
					role === 'user' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-neutral-500'
				}`}
			>
				{content}
				{/*
				<button onClick={() => loadDocument('b2f6d0f9-c0ee-4bb6-b2cf-4515755a3fad')}>DOC</button>
				*/}
			</div>
		</div>
	);
};

export default Bubble;
