import Navbar from '@/components/Navbar';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Account Details',
};

export default async function Page() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect('/auth');
	}

	return (
		<div className="h-screen w-screen">
			<Navbar />
			<div className="mx-auto max-w-screen-md px-4 py-8">
				<div className="flex flex-col gap-4 text-neutral-900">
					<div className="items center flex justify-between">
						<div className="flex items-center gap-2">
							<div className="text-2xl font-bold">Account Details</div>
						</div>
					</div>
					<div className="flex w-full flex-1 flex-col gap-6 overflow-visible font-inter">
						<div className="flex flex-col gap-1">
							<p className="text-2xl font-bold">Profile</p>
							<p className="font-bold">Email</p>
							<p className="">{data.email}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
