import CreateCollectionButton from '@/components/CreateCollectionButton';
import RealtimeCollections from '@/components/RealtimeCollections';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Page() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });
	const { data: collections } = await supabase.from('collections').select();
	const { data: documents } = await supabase.from('documents').select();

	return (
		<div className="flex flex-col gap-4 text-neutral-900">
			<div className="flex items-center justify-between">
				<p className="text-2xl font-bold">Your Collections</p>
				<CreateCollectionButton />
			</div>
			<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
				<RealtimeCollections collections={collections} documents={documents} />
			</div>
		</div>
	);
}
