import { CollectionsContext } from '../contexts/collections';
import useUser from '../hooks/useUser';
import AccountInfo from './sidebar/AccountInfo';
import Collection from './sidebar/Collection';
import { useContext } from 'react';

const Sidebar = ({ toggleSidebar }) => {
	const { collections, documents, handleCreateCollection } = useContext(CollectionsContext);

	const { signOut } = useUser();

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<div className="flex h-full flex-col gap-2">
			<div className="flex flex-col overflow-auto h-full gap-2">
				<div className="flex flex-col items-center justify-center w-full  p-6">
					<h1 className="text-center text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold">
						PDF Chat
					</h1>
					<p className="text-base text-white font-bold"> v0.0.0</p>
				</div>
				<div className="flex flex-row items-center justify-between gap-2">
					<button
						className="rounded-md flex items-center text-white gap-2 justify-start flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all"
						onClick={() => handleCreateCollection()}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="h-4 w-4"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
							/>
						</svg>

						<p className="text-center text-sm font-bold">New Collection</p>
					</button>
					<button
						className="rounded-md flex items-center h-full aspect-square text-white gap-2 justify-center p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-600 hover:bg-opacity-10 transition-all"
						onClick={toggleSidebar}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
							role="img"
							stroke="currentColor"
							className="w-4 h-4"
							width="100%"
							height="100%"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 256 256"
						>
							<path
								fill="currentColor"
								d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM40 56h40v144H40Zm176 144H96V56h120v144Z"
							/>
						</svg>
					</button>
				</div>
				<div className="flex flex-1 flex-col h-full gap-2 overflow-scroll">
					{collections.map((collection) => (
						<Collection
							key={collection.id}
							collection={collection}
							documents={documents.filter((doc) => doc.collection === collection.id)}
						/>
					))}
				</div>
			</div>
			<div className="w-full border-t border-neutral-700"></div>
			<AccountInfo />
			<button
				className="hidden rounded-md flex items-center text-white gap-2 justify-between flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all text-sm"
				onClick={handleSignOut}
			>
				<p className="font-bold text-white">Sign Out</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-4 h-4"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Sidebar;
