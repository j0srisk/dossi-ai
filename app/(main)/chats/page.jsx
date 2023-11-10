import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Chats from '@/components/Chats';
import Navbar from '@/components/Navbar';
import db from '@/db/index';
import { collections, documents, chats } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Chats',
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
	const userChats = await db.select().from(chats).where(eq(chats.createdBy, session.user.id));

	return (
		<div className="h-screen w-screen">
			<Navbar />
			<div className="mx-auto max-w-screen-md px-4 py-8">
				<div className="flex flex-col gap-4 text-neutral-900">
					<div className="flex min-h-[36px] items-center justify-between">
						<p className="text-2xl font-bold">Previous Chats</p>
					</div>
					<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
						<Chats chats={userChats} documents={userDocuments} collections={userCollections} />
					</div>
				</div>
			</div>
		</div>
	);
}
