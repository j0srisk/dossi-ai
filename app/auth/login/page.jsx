import LogInWithGoogleButton from '@/components/LogInWithGoogleButton';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const logIn = async (formData) => {
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

	console.log(session);
};

export default async function Login() {
	return (
		<>
			<form action={logIn} className="flex w-full flex-col gap-2">
				<input
					name="email"
					placeholder="Email"
					className="flex w-full flex-1 items-center justify-start gap-2 rounded-md border border-neutral-700 bg-transparent p-2 text-sm text-white shadow-md transition-all hover:bg-neutral-700 hover:bg-opacity-10 hover:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10 focus:shadow-lg focus:outline-0"
				/>
				<input
					type="password"
					placeholder="Password"
					name="password"
					className="flex w-full flex-1 items-center justify-start gap-2 rounded-md border border-neutral-700 bg-transparent p-2 text-sm text-white shadow-md transition-all hover:bg-neutral-700 hover:bg-opacity-10 hover:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10 focus:shadow-lg focus:outline-0"
				/>
				<button className="flex h-full w-full items-center justify-center gap-2 rounded-md border  border-neutral-700 px-2 py-2 text-white shadow-md transition-all hover:bg-neutral-600 hover:bg-opacity-10 hover:shadow-lg">
					<p className="text-center text-base font-bold text-white">Log In</p>
				</button>
			</form>
			<p className="text-center text-sm text-neutral-300"> or </p>
			<LogInWithGoogleButton />
		</>
	);
}
