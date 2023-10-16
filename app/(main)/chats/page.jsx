import RealtimeChats from '@/components/RealtimeChats';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const metadata = {
	title: 'Chats',
};

export default async function Page() {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const { data: collections } = await supabase.from('collections').select();
	const { data: documents } = await supabase.from('documents').select();
	const { data: chats } = await supabase.from('chats').select();

	return (
		<div className="flex flex-col gap-4 text-neutral-900">
			<div className="flex min-h-[36px] items-center justify-between">
				<p className="text-2xl font-bold">Previous Chats</p>
			</div>
			<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
				<RealtimeChats chats={chats} documents={documents} collections={collections} />
			</div>
		</div>
	);
}
