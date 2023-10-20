import CreateCollectionButton from '@/components/CreateCollectionButton';
import Navbar from '@/components/Navbar';
import RealtimeCollections from '@/components/RealtimeCollections';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Collections',
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

	const { data: collections } = await supabase.from('collections').select();
	const { data: documents } = await supabase.from('documents').select();

	return (
		<div className="h-screen w-screen">
			<Navbar />
			<div className="mx-auto max-w-screen-md px-4 py-8">
				<div className="flex flex-col gap-4 text-neutral-900">
					<div className="flex items-center justify-between">
						<p className="text-2xl font-bold">Your Collections</p>
						<CreateCollectionButton />
					</div>
					<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
						<RealtimeCollections collections={collections} documents={documents} />
					</div>
				</div>
			</div>
		</div>
	);
}
