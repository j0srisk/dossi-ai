import Logo from '@/components/Logo';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginLayout({ children }) {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session) {
		redirect('/');
	}

	return (
		<div className="bg-topo flex h-screen w-screen items-center justify-center  bg-repeat">
			<div className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-zinc-900 p-12 text-white shadow-lg">
				<Logo />
				{children}
			</div>
		</div>
	);
}
