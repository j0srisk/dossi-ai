import LogInWithGoogleButton from '@/components/LogInWithGoogleButton';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const signUp = async (formData) => {
	'use server';
	const email = formData.get('email');
	const password = formData.get('password');
	const supabase = createServerActionClient({ cookies });
	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) {
		console.error(error);
		return { error };
	}

	const {
		data: { session },
	} = await supabase.auth.getSession();

	redirect('/collections');
};

export default async function SignUp() {
	return (
		<div className="flex w-full flex-col items-center justify-center gap-4">
			<form action={signUp} className="flex w-full flex-col gap-4">
				<div className="flex flex-col justify-center gap-2">
					<p className="pl-1 text-xs font-bold text-neutral-300">Email</p>
					<input
						name="email"
						placeholder="Email"
						className="flex w-full flex-1 items-center justify-start gap-2 rounded-md border border-neutral-700 bg-transparent p-2 text-sm text-white shadow-md transition-all hover:bg-neutral-700 hover:bg-opacity-10 hover:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10 focus:shadow-lg focus:outline-0"
					/>
				</div>
				<div className="flex flex-col justify-center gap-2">
					<p className="pl-1 text-xs font-bold text-neutral-300">Password</p>
					<input
						type="password"
						placeholder="Password"
						name="password"
						className="flex w-full flex-1 items-center justify-start gap-2 rounded-md border border-neutral-700 bg-transparent p-2 text-sm text-white shadow-md transition-all hover:bg-neutral-700 hover:bg-opacity-10 hover:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10 focus:shadow-lg focus:outline-0"
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						name="password"
						className="flex w-full flex-1 items-center justify-start gap-2 rounded-md border border-neutral-700 bg-transparent p-2 text-sm text-white shadow-md transition-all hover:bg-neutral-700 hover:bg-opacity-10 hover:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10 focus:shadow-lg focus:outline-0"
					/>
				</div>

				<button className="flex h-full w-full items-center justify-center gap-2 rounded-md border border-neutral-700  bg-accent px-2 py-2 text-white shadow-md transition-all hover:bg-accent-hover ">
					<p className="text-center text-base font-bold text-white">Sign Up</p>
				</button>
			</form>
			<p className="text-xs text-neutral-300">
				Already have an account?{' '}
				<span className="font-bold text-accent">
					<Link href="/auth/login">Log In</Link>
				</span>
			</p>
		</div>
	);
}
