import { CollectionsContext } from '../contexts/collections';
import useUser from '../hooks/useUser';
import AccountInfo from './sidebar/AccountInfo';
import Collection from './sidebar/Collection';
import { useContext } from 'react';

const Sidebar = () => {
	const { collections, documents, handleCreateCollection } = useContext(CollectionsContext);

	const { signOut } = useUser();

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<div className="flex h-full flex-col">
			<div className="flex flex-col overflow-auto h-full">
				<button
					className="rounded-md mb-2 bg-gradient-to-r bg-neutral-500 hover:from-cyan-600 hover:to-blue-600 hover:bg-opacity-90 hover:shadow-md"
					onClick={() => handleCreateCollection()}
				>
					<div className="w-full h-full flex items-center justify-center rounded-md border border-dashed border-neutral-800">
						<div className="w-full h-full flex items-center justify-center p-3 rounded-[5px] bg-neutral-800 gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="h-4 w-4 flex-shrink-0 stroke-white"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
							<p className="text-center text-base font-bold text-white">New Collection</p>
						</div>
					</div>
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
			<button
				className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 p-3  hover:from-cyan-600 hover:to-blue-600 hover:bg-opacity-90 hover:shadow-md"
				onClick={handleSignOut}
			>
				<p className="text-center text-base font-bold text-white">Sign Out</p>
			</button>
		</div>
	);
};

export default Sidebar;
