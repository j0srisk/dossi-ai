'use client';

import DropdownMenu from '@/components/DropdownMenu';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AccountIcon() {
	const [menuOpen, setMenuOpen] = useState(false);

	const router = useRouter();

	const { data: session } = useSession();

	const handleSignOut = async () => {
		console.log('signing out');
		router.push('/');
		signOut();
	};

	return (
		<div className="group relative">
			<button
				className="relative flex h-8 w-8 items-center justify-center rounded-full bg-neutral-700 p-0.5"
				onClick={() => setMenuOpen(!menuOpen)}
			>
				<div className="z-20 flex h-full w-full items-center justify-center rounded-full bg-neutral-900 shadow-md">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2.25}
						className="h-5 w-5 stroke-current transition-all duration-500 ease-in-out group-hover:stroke-white"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
						/>
					</svg>
				</div>
			</button>
			<div className="absolute right-0 top-0 h-full w-full rounded-full bg-gradient-to-br from-[#49CC5F] from-10% to-[#a3e635] opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100" />
			{menuOpen && (
				<DropdownMenu top={'top-10'} setMenuOpen={setMenuOpen}>
					{session?.user?.name && (
						<p className="whitespace-nowrap p-1 px-4 text-left font-inter text-xs font-bold text-neutral-900">
							{session.user.name}
						</p>
					)}
					<Link
						href="/account"
						className="whitespace-nowrap rounded-md p-1 px-4 text-left font-inter text-xs font-bold text-neutral-900 hover:cursor-pointer hover:bg-accent hover:text-white"
					>
						Account Details
					</Link>
					<p
						className="whitespace-nowrap rounded-md p-1 px-4 text-left font-inter text-xs font-bold text-neutral-900 hover:cursor-pointer hover:bg-accent hover:text-white"
						onClick={handleSignOut}
					>
						Sign Out
					</p>
				</DropdownMenu>
			)}
		</div>
	);
}
