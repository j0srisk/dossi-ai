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
		<div className="flex flex-col gap-4">
			<div className="items center flex justify-between">
				<p className="text-3xl font-bold">Your Collections</p>
				<CreateCollectionButton />
			</div>
			<div className="font-inter flex w-full flex-1 flex-col gap-2 overflow-scroll">
				<RealtimeCollections collections={collections} documents={documents} />
			</div>
		</div>
	);
}
