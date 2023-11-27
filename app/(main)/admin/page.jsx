import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getTopic, getDocuments, getUsers } from '@/app/utils';
import Collection from '@/components/Collection';
import Navbar from '@/components/Navbar';
import Users from '@/components/Users';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Admin Dashboard',
};

export default async function Page() {
	const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/auth');
	}

	const topic = await getTopic('280b8974-866a-49ea-86d9-1feb83702806');

	const documents = await getDocuments(topic.id);

	let users = await getUsers();

	users = users.filter((user) => user.id !== 'demo');

	return (
		<div className="h-screen w-full">
			<Navbar />
			<div className="mx-auto max-w-screen-md px-4 py-8">
				<div className="flex flex-col gap-4 text-neutral-900">
					<div className="items center flex justify-between">
						<div className="flex items-center gap-2">
							<div href={'/collections/'} className="text-2xl font-bold">
								Demo Collection
							</div>
						</div>
					</div>
					<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
						<Collection collection={topic} documents={documents} />
					</div>
				</div>
			</div>
			<div className="mx-auto max-w-screen-md px-4 pb-8">
				<div className="flex flex-col gap-4 text-neutral-900">
					<div className="items center flex justify-between">
						<div className="flex items-center gap-2">
							<div href={'/collections/'} className="text-2xl font-bold">
								All Users
							</div>
						</div>
					</div>
					<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter">
						<Users users={users} />
					</div>
				</div>
			</div>
		</div>
	);
}
