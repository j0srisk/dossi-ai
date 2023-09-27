import { CollectionsContext } from '../contexts/collections';
import useAuth from '../hooks/useAuth';
import AccountInfo from './sidebar/AccountInfo';
import Collection from './sidebar/Collection';
import { useContext } from 'react';

const Sidebar = () => {
	const { collections, documents, handleCreateCollection } = useContext(CollectionsContext);

	const { signOut } = useAuth();

	const handleSignOut = async () => {
		console.log('Signing out');
		await signOut();
	};

	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-col overflow-auto h-full">
				<button
					className="rounded-md border border-neutral-500 p-3 mb-2"
					onClick={() => handleCreateCollection()}
				>
					<p className="text-center text-base font-bold text-white">New Collection</p>
				</button>
				<div className="flex flex-1 flex-col h-full gap-2 overflow-scroll mb-2">
					{collections.map((collection) => (
						<Collection
							key={collection.id}
							collection={collection}
							documents={documents.filter((doc) => doc.collection === collection.id)}
						/>
					))}
				</div>
			</div>
			<AccountInfo />
			<button className="rounded-md  bg-rose-600 p-3 hover:bg-rose-700" onClick={handleSignOut}>
				<p className="text-center text-base font-bold text-white">Sign Out</p>
			</button>
		</div>
	);
};

export default Sidebar;
