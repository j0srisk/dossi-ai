import useUser from '../hooks/useUser';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ children }) => {
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);

	const { signOut } = useUser();
	const navigate = useNavigate();

	return (
		<div className="z-20 flex h-[72px] items-center justify-between border-b border-neutral-700 bg-zinc-900 px-4 font-ar-one-sans shadow-md">
			{children ? (
				// Render the provided children
				children
			) : (
				// Render a default navbar if no children are provided
				<>
					<button
						className="group flex items-center justify-center gap-3 rounded-md p-2 font-ar-one-sans text-white shadow-sm"
						onClick={() => navigate('/')}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="h-8 w-8 stroke-accent transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:stroke-accent"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
							/>
						</svg>

						<h1 className="text-center text-3xl font-bold text-white ">Dossi - AI</h1>
					</button>
					<div className="relative flex flex-1 items-center justify-end gap-6 font-ar-one-sans text-neutral-700">
						<button
							className="text-md text-center font-bold transition-all duration-300 ease-in-out hover:text-white"
							onClick={() => navigate('/')}
						>
							Collections
						</button>
						<button className="text-md text-center font-bold transition-all duration-300 ease-in-out hover:text-white">
							Documents
						</button>
						<button className="text-md text-center font-bold transition-all duration-300 ease-in-out hover:text-white">
							GitHub
						</button>
						<button
							className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-700 text-neutral-700 transition-all duration-300 ease-in-out hover:border-accent hover:bg-accent hover:text-white"
							onClick={() => setAccountMenuOpen(!accountMenuOpen)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="h-5 w-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/>
							</svg>
						</button>
						{accountMenuOpen && (
							<div className="absolute right-0 top-10 flex flex-col gap-2 rounded-md border border-neutral-300 bg-white p-4 px-6 text-zinc-900 shadow-sm">
								<div className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="h-4 w-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
									<p
										className="w-fit whitespace-nowrap text-center hover:cursor-pointer"
										onClick={() => navigate('/account')}
									>
										Account
									</p>
								</div>
								<div className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="h-4 w-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
										/>
									</svg>

									<p
										className="w-fit whitespace-nowrap text-center hover:cursor-pointer"
										onClick={() => signOut()}
									>
										Sign Out
									</p>
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default Navbar;
