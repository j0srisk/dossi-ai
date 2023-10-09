import Collection from '../components/Collection';
import Navbar from '../components/Navbar';
import { CollectionsContext } from '../contexts/collections';
import useAuth from '../hooks/useAuth';
import { useContext, useState } from 'react';

const Collections = () => {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('date');

	const { user } = useAuth({ redirectTo: '/auth' });

	const { collections, documents, handleCreateCollection } = useContext(CollectionsContext);

	if (!user) {
		return null;
	}

	return (
		<div className="bg-neutral-100 w-screen min-h-screen flex flex-col text-zinc-900">
			<Navbar />
			<div className="flex flex-col w-full h-full items-center p-8">
				<div className="flex flex-col w-full h-full max-w-screen-lg gap-8">
					{/* Header */}
					<div className="flex items-center justify-between w-full h-full gap-2">
						<p className="font-bold text-3xl">Your Collections</p>
					</div>

					{/* Search */}
					<div className="flex w-full h-full gap-2">
						<input
							type="text"
							placeholder="Search"
							value={search}
							className="flex-1 p-2 rounded-md shadow-sm border border-neutral-300 outline-none focus:outline-none transition-all"
							onChange={(e) => setSearch(e.target.value)}
						/>
						<div className="w-fit font-ar-one-sans hidden">
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
						<div className="w-fit font-ar-one-sans">
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
					{/* Collections */}
					<div className="flex flex-1 flex-col gap-2 overflow-scroll font-inter">
						{collections
							.filter((collection) => collection.name.toLowerCase().includes(search.toLowerCase()))
							.map((collection) => (
								<Collection
									key={collection.id}
									collection={collection}
									documents={documents.filter((doc) => doc.collection === collection.id)}
								/>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Collections;
