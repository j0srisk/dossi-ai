import { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
	return (
		<input
			ref={ref}
			className="flex flex-1 items-center justify-start gap-2 rounded-md border border-neutral-700 bg-transparent p-2 text-sm text-white shadow-md transition-all hover:bg-neutral-700 hover:bg-opacity-10 hover:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10 focus:shadow-lg focus:outline-0"
			{...props}
		/>
	);
});

Input.displayName = 'Input';

export default Input;
