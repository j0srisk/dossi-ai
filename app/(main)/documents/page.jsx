import CreateDocumentButton from '@/components/CreateDocumentButton';
import Documents from '@/components/Documents';
import Navbar from '@/components/Navbar';
import db from '@/lib/index';
import { collections, documents } from '@/lib/schema';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Documents',
};

export default async function Page({ params }) {
	const cookieStore = cookies();
	const supabase = createServerComponentClient({ cookies: () => cookieStore });

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect('/auth');
	}

	const userCollections = await db
		.select()
		.from(collections)
		.where(eq(collections.createdBy, session.user.id));
	const userDocuments = await db
		.select()
		.from(documents)
		.where(eq(documents.createdBy, session.user.id));

	return (
		<div className="h-screen w-screen">
			<Navbar />
			<div className="mx-auto max-w-screen-md px-4 py-8">
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
						<Documents collections={userCollections} documents={userDocuments} />
					</div>
				</div>
			</div>
		</div>
	);
}
