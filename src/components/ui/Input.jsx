import { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
	return (
		<input
			ref={ref}
			className="rounded-md text-sm focus:outline-0 focus:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10 bg-transparent flex items-center text-white gap-2 justify-start flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all"
			{...props}
		/>
	);
});

Input.displayName = 'Input';

export default Input;
