import CollectionsList from '../components/CollectionsList';
import Navbar from '../components/Navbar';
import { CollectionsContext } from '../contexts/collections';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Collections = () => {
	const [search, setSearch] = useState('');
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);
	const [sort, setSort] = useState('date');

	const { user } = useAuth({ redirectTo: '/auth' });

	const { collections, documents, handleCreateCollection } = useContext(CollectionsContext);
	const { signOut } = useUser();

	const navigate = useNavigate();

	if (!user) {
		return null;
	}

	return (
		<div className="bg-neutral-100 w-screen min-h-screen flex flex-col text-zinc-900">
			<Navbar>
				<div className="flex items-center gap-3 p-2 rounded-md shadow-sm">
					<img src="/bookmark-tabs.png" className="w-6 h-6" />

					<h1 className="text-center text-3xl text-white font-bold">PDF Chat</h1>
				</div>
				<div className="relative flex-1 flex items-center justify-end gap-6">
					<p
						className="text-center text-md text-white font-bold hover:underline hover:cursor-pointer"
						onClick={() => navigate('/')}
					>
						Collections
					</p>
					<p className="text-center text-md text-white font-bold hover:underline hover:cursor-pointer">
						Documents
					</p>
					<p className="text-center text-md text-white font-bold hover:underline hover:cursor-pointer">
						GitHub
					</p>
					<button
						className="w-8 h-8 text-neutral-700 rounded-full items-center flex justify-center border-neutral-700 border hover:bg-blue-500 hover:text-white transition-all"
						onClick={() => setAccountMenuOpen(!accountMenuOpen)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							/>
						</svg>
					</button>
					{accountMenuOpen && (
						<div className="absolute top-10 right-0 p-4 px-6 gap-2 bg-white border text-zinc-900 border-neutral-300 rounded-md flex flex-col shadow-sm">
							<p
								className="text-center w-fit whitespace-nowrap hover:cursor-pointer"
								onClick={() => navigate('/account')}
							>
								Account
							</p>
							<p
								className="text-center w-fit whitespace-nowrap hover:cursor-pointer"
								onClick={() => signOut()}
							>
								Sign Out
							</p>
						</div>
					)}
				</div>
			</Navbar>
			<div className="flex flex-col w-full h-full items-center p-8">
				<div className="flex flex-col w-full h-full max-w-screen-lg gap-8">
					<div className="flex items-center justify-between w-full h-full gap-2">
						<p className="font-bold text-3xl">Your Collections</p>
					</div>
					<div className="flex w-full h-full gap-2">
						<input
							type="text"
							placeholder="Search"
							value={search}
							className="flex-1 p-2 rounded-md shadow-sm border border-neutral-300 outline-none focus:outline-none transition-all"
							onChange={(e) => setSearch(e.target.value)}
						/>
						<div className="w-fit">
							<button
								className="flex h-full gap-2 items-center bg-blue-500 text-white p-2 rounded-md shadow-sm border border-blue-500"
								onClick={() => setSort(sort === 'name' ? 'date' : 'name')}
							>
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
										d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
									/>
								</svg>

								<p className="text-left text-sm flex-1 font-bold">Sort</p>
							</button>
						</div>
						<div className="w-fit">
							<button
								className="flex h-full gap-2 items-center bg-blue-500 text-white p-2 rounded-md shadow-sm border border-blue-500"
								onClick={() => handleCreateCollection()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="h-4 w-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
									/>
								</svg>

								<p className="text-left text-sm flex-1 font-bold">New Collection</p>
							</button>
						</div>
					</div>
					<CollectionsList
						collections={collections.filter((collection) =>
							collection.name.toLowerCase().includes(search.toLowerCase()),
						)}
						documents={documents}
						sortMethod={sort}
					/>
				</div>
			</div>
		</div>
	);
};

export default Collections;
