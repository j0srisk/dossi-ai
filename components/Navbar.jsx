import AccountIcon from '@/components/AccountIcon';
import Link from 'next/link';

export default function Navbar({ children }) {
	return (
		<div className="z-20 flex h-[72px] items-center justify-between border-b border-neutral-700 bg-neutral-900 px-4 font-ar-one-sans shadow-md">
			{children ? (
				// Render the provided children
				children
			) : (
				// Render a default navbar if no children are provided
				<>
					<Link
						href="/"
						className="group flex items-center justify-center gap-3 rounded-md p-2 font-ar-one-sans text-white shadow-sm"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							className="h-8 w-8 transition-all duration-300 ease-in-out group-hover:scale-110"
						>
							<defs>
								<linearGradient id="gradient" gradientTransform="rotate(45)">
									<stop offset="50%" stopColor="#49CC5F" />
									<stop offset="100%" stopColor="#a3e635" />
								</linearGradient>
							</defs>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
								stroke="url(#gradient)"
							/>
						</svg>

						<h1 className="text-center text-3xl font-bold text-white ">Dossi - AI</h1>
					</Link>
					<div className="relative flex flex-1 items-center justify-end gap-6 font-ar-one-sans text-neutral-700">
						<Link
							href="/collections"
							className="text-md text-center font-bold transition-all duration-300 ease-in-out hover:text-white"
						>
							Collections
						</Link>
						<Link
							href="/documents"
							className="text-md text-center font-bold transition-all duration-300 ease-in-out hover:text-white"
						>
							Documents
						</Link>
						<Link
							href="/chats"
							className="text-md text-center font-bold transition-all duration-300 ease-in-out hover:text-white"
						>
							Chats
						</Link>
						<AccountIcon />
					</div>
				</>
			)}
		</div>
	);
}
