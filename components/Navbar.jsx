import AccountIcon from '@/components/AccountIcon';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Navbar({ children }) {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	return (
		<div className="z-40 flex h-[72px] items-center justify-between border-b border-neutral-700 bg-neutral-900 px-4 shadow-md">
			{children ? (
				// Render the provided children
				children
			) : (
				// Render a default navbar if no children are provided
				<div className="mx-auto flex w-full max-w-screen-xl">
					<Link
						href="/"
						className="group flex items-center justify-center gap-2 rounded-md text-white"
					>
						<div className="hidden items-center justify-center rounded-lg border-neutral-700 from-[#49CC5F] from-10% to-[#a3e635] p-1 shadow-md">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								className="h-7 w-7 transition-all duration-300 ease-in-out"
							>
								<defs>
									<linearGradient id="gradient" gradientTransform="rotate(90)">
										<stop offset="20%" stopColor="#49CC5F" />
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
						</div>

						<div className="flex items-start justify-center gap-2">
							<h1 className="text-center text-4xl font-bold text-white ">Dossi</h1>

							<div className="group relative mt-1 flex h-6 rounded-md bg-gradient-to-br from-[#49CC5F] from-10% to-[#a3e635] p-0.5">
								<div className="z-20 flex h-full w-full items-center justify-center rounded-[4px] border-neutral-700 bg-neutral-900 px-2 text-sm font-extrabold text-white shadow-md">
									AI
								</div>
							</div>
						</div>
					</Link>
					<div className="relative flex flex-1 items-center justify-end gap-6 font-bold text-neutral-700">
						{session ? (
							<>
								<Link
									href="/collections"
									className="text-md text-center transition-all duration-300 ease-in-out hover:text-white"
								>
									Collections
								</Link>
								<Link
									href="/documents"
									className="text-md text-center transition-all duration-300 ease-in-out hover:text-white"
								>
									Documents
								</Link>
								<Link
									href="/chats"
									className="text-md text-center transition-all duration-300 ease-in-out hover:text-white"
								>
									Chats
								</Link>
								<AccountIcon />
							</>
						) : (
							<div className="flex items-center justify-center gap-2">
								<Link
									href="/auth/login"
									className="flex h-full items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-neutral-600 hover:bg-opacity-10"
								>
									<p className="text-center text-base font-bold text-white">Log In</p>
								</Link>
								<Link
									href="/auth/signup"
									className="flex h-full  items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:border-accent-hover hover:bg-accent-hover"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="hidden h-5 w-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
										/>
									</svg>
									<p className="text-center text-base font-bold text-white">Sign Up</p>
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
