import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Collections from '@/components/Collections';
import CreateCollectionButton from '@/components/CreateCollectionButton';
import Navbar from '@/components/Navbar';
import db from '@/db/index';
import { collections, documents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Collections',
};

export default async function Page() {
	const session = await getServerSession(authOptions);

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
		<div className="h-screen w-full">
			<Navbar />
			<div className="mx-auto max-w-screen-md px-4 py-8">
				<div className="flex flex-col gap-4 text-neutral-900">
					<div className="flex items-center justify-between">
						<p className="text-2xl font-bold">Your Collections</p>
						<CreateCollectionButton />
					</div>
					<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
						<Collections collections={userCollections} documents={userDocuments} />
					</div>
				</div>
			</div>
		</div>
	);
}
