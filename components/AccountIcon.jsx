'use client';

import DropdownMenu from '@/components/DropdownMenu';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AccountIcon() {
	const [menuOpen, setMenuOpen] = useState(false);
	const supabase = createClientComponentClient();
	const router = useRouter();

	const signOut = async () => {
		console.log('signing out');
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
			return;
		}
		router.refresh();
	};

	return (
		<button
			className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-700 text-neutral-700 transition-all duration-300 ease-in-out hover:border-accent hover:bg-accent hover:text-white"
			onClick={() => setMenuOpen(!menuOpen)}
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
			{menuOpen && (
				<DropdownMenu top={'top-10'} setMenuOpen={setMenuOpen}>
					<Link
						href="/account"
						className="whitespace-nowrap rounded-md p-1 px-4 text-left font-inter text-xs font-bold text-neutral-900 hover:cursor-pointer hover:bg-accent hover:text-white"
					>
						Account Details
					</Link>
					<p
						className="whitespace-nowrap rounded-md p-1 px-4 text-left font-inter text-xs font-bold text-neutral-900 hover:cursor-pointer hover:bg-accent hover:text-white"
						onClick={signOut}
					>
						Sign Out
					</p>
				</DropdownMenu>
			)}
		</button>
	);
}
