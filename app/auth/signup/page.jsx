import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import GitHubButton from '@/components/GitHubButton';
import GoogleButton from '@/components/GoogleButton';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function SignUp() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect('/collections');
	}

	return (
		<div className="flex w-full flex-col items-center justify-center gap-4">
			<GitHubButton text={'Sign Up with GitHub'} />
			<GoogleButton text={'Sign Up with Google'} />
			<p className="text-xs text-neutral-300">
				Already have an account?{' '}
				<span className="font-bold text-accent">
					<Link href="/auth/login">Log In</Link>
				</span>
			</p>
		</div>
	);
}
