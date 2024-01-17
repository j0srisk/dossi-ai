import Link from 'next/link';

const LandingPage = () => {
	return (
		<div className="flex w-full gap-2">
			<Link
				href="/auth/login"
				className="flex h-full w-full items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10 hover:shadow-lg"
			>
				<p className="text-center text-base font-bold text-white">Sign In</p>
			</Link>
			<Link
				href="/auth/login"
				className="flex h-full w-full items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10 hover:shadow-lg"
			>
				<p className="text-center text-base font-bold text-white">Sign Up</p>
			</Link>
		</div>
	);
};

export default LandingPage;
