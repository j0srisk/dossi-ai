import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Logo from '@/components/Logo';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function LoginLayout({ children }) {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect('/collections');
	}

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-topo  bg-repeat">
			<div className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-zinc-900 p-12 text-white shadow-lg">
				<Logo />
				{children}
			</div>
		</div>
	);
}
