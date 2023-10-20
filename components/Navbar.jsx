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
							<Link
								href="/auth/login"
								className="group relative flex rounded-lg bg-neutral-700 p-0.5"
							>
								<div className="text-md z-20 rounded-[6px] bg-neutral-900 p-1 px-2 text-center transition-all duration-300 ease-in-out group-hover:text-white">
									Sign In
								</div>
								<div className="absolute right-0 top-0 h-full w-full rounded-lg bg-gradient-to-br from-[#49CC5F] from-10% to-[#a3e635] opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100" />
							</Link>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
