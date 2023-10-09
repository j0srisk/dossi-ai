import useUser from '../hooks/useUser';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ children }) => {
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);

	const { signOut } = useUser();
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-between h-[72px] px-4 bg-zinc-900 shadow-md z-20  font-ar-one-sans">
			{children ? (
				// Render the provided children
				children
			) : (
				// Render a default navbar if no children are provided
				<>
					<div className="flex items-center gap-3 p-2 rounded-md shadow-sm text-white font-ar-one-sans">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-8 h-8 stroke-blue-500 hover:stroke-white transition-all"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
							/>
						</svg>

						<h1 className="text-center text-3xl text-white font-bold ">Dossi - AI</h1>
					</div>
					<div className="relative flex-1 flex items-center justify-end gap-6 font-ar-one-sans">
						<button
							className="text-center text-md text-white font-bold hover:underline hover:cursor-pointer"
							onClick={() => navigate('/')}
						>
							Collections
						</button>
						<button className="text-center text-md text-white font-bold hover:underline hover:cursor-pointer">
							Documents
						</button>
						<button className="text-center text-md text-white font-bold hover:underline hover:cursor-pointer">
							GitHub
						</button>
						<button
							className="w-8 h-8 text-neutral-700 rounded-full items-center flex justify-center border-neutral-700 border hover:bg-blue-500 hover:text-white transition-all"
							onClick={() => setAccountMenuOpen(!accountMenuOpen)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/>
							</svg>
						</button>
						{accountMenuOpen && (
							<div className="absolute top-10 right-0 p-4 px-6 gap-2 bg-white border text-zinc-900 border-neutral-300 rounded-md flex flex-col shadow-sm">
								<p
									className="text-center w-fit whitespace-nowrap hover:cursor-pointer"
									onClick={() => navigate('/account')}
								>
									Account
								</p>
								<p
									className="text-center w-fit whitespace-nowrap hover:cursor-pointer"
									onClick={() => signOut()}
								>
									Sign Out
								</p>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default Navbar;
