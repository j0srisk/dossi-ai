import CreateDocumentButton from '@/components/CreateDocumentButton';
import RealtimeDocuments from '@/components/RealtimeDocuments';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Page({ params }) {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const { data: collections } = await supabase.from('collections').select();
	const { data: documents } = await supabase.from('documents').select();

	return (
		<div className="flex flex-col gap-4 text-neutral-900">
			<div className="items center flex justify-between">
				<div className="flex items-center gap-2">
					<div href={'/collections/'} className="text-2xl font-bold">
						All Documents
					</div>
				</div>
				<CreateDocumentButton />
			</div>
			<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
				<RealtimeDocuments collections={collections} documents={documents} />
			</div>
		</div>
	);
}
