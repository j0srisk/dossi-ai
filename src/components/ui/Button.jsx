const Button = ({ children, ...props }) => {
	return (
		<button
			className={`flex h-full w-full items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10 hover:shadow-lg`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
