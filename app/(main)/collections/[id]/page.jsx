import CreateDocumentButton from '@/components/CreateDocumentButton';
import RealtimeDocuments from '@/components/RealtimeDocuments';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Page({ params }) {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });
	const { data: collection } = await supabase
		.from('collections')
		.select('*')
		.eq('id', params.id)
		.single();
	const { data: documents } = await supabase.from('documents').select().eq('collection', params.id);

	return (
		<div className="flex flex-col gap-4 text-neutral-900">
			<div className="items center flex justify-between">
				<div className="flex items-center gap-2">
					<Link href={'/collections/'} className="text-2xl font-bold">
						Your Collections
					</Link>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="h-4 w-4"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>

					<p className="text-2xl font-bold">{collection.name}</p>
				</div>
				<Link
					href={'/c/' + collection.id}
					className="hover:bg-accent-hover flex items-center gap-2 rounded-lg bg-accent p-2 px-4 text-sm font-bold text-white shadow-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={3}
						stroke="currentColor"
						className="h-4 w-4"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
						/>
					</svg>
					Chat with Collection
				</Link>
			</div>
			<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
				<RealtimeDocuments documents={documents} />
			</div>
		</div>
	);
}
