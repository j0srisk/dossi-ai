'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AccountDropdown = () => {
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);
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
			{accountMenuOpen && (
				<div className="absolute right-0 top-10 flex flex-col rounded-md border border-neutral-300 bg-white py-4 text-zinc-900 shadow-sm">
					<Link href="/account" className="flex items-center gap-2 px-6 py-1 hover:bg-neutral-200">
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
						<p className="w-fit whitespace-nowrap text-center hover:cursor-pointer">Account</p>
					</Link>
					<div
						className="flex items-center gap-2 px-6 py-1 hover:bg-neutral-200"
						onClick={() => signOut()}
					>
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

						<p className="w-fit whitespace-nowrap text-center hover:cursor-pointer">Sign Out</p>
					</div>
				</div>
			)}
		</button>
	);
};

export default AccountDropdown;
