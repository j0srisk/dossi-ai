const Button = ({ children, ...props }) => {
	return (
		<button
			className={`w-full h-full rounded-md justify-center flex items-center text-white gap-2  px-2 py-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-600 hover:bg-opacity-10 transition-all`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
