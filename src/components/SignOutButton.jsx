import useUser from '../hooks/useUser';

const SignOutButton = () => {
	const { signOut } = useUser();

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<button
			className="rounded-md flex items-center text-white gap-2 justify-between flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all text-sm"
			onClick={handleSignOut}
		>
			<p className="font-bold text-white">Sign Out</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-4 h-4"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
				/>
			</svg>
		</button>
	);
};

export default SignOutButton;
