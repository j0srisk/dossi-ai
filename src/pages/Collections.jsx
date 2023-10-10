import Collection from '../components/Collection';
import { CollectionsContext } from '../contexts/collections';
import useAuth from '../hooks/useAuth';
import Page from '../layouts/Page';
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
		<Page>
			<>
				{/* Header */}
				<div className="flex h-full w-full items-center justify-between gap-2">
					<p className="text-3xl font-bold">Your Collections</p>
				</div>

				{/* Search */}
				<div className="flex h-full w-full gap-2">
					<input
						type="text"
						placeholder="Search"
						value={search}
						className="flex-1 rounded-md border border-neutral-300 p-2 shadow-sm outline-none transition-all focus:outline-none"
						onChange={(e) => setSearch(e.target.value)}
					/>
					<div className="hidden w-fit font-ar-one-sans">
						<button
							className="flex h-full items-center gap-2 rounded-md border border-accent bg-accent p-2 text-white shadow-sm"
							onClick={() => setSort(sort === 'name' ? 'date' : 'name')}
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
									d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
								/>
							</svg>

							<p className="flex-1 text-left text-sm font-bold">Sort</p>
						</button>
					</div>
					<div className="w-fit font-ar-one-sans">
						<button
							className="group flex h-full items-center gap-2 rounded-md border bg-gradient-to-br from-accent to-lime-400 p-2 text-white shadow-sm"
							onClick={() => handleCreateCollection()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="h-6 w-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
								/>
							</svg>

							<p className="hidden flex-1 text-left text-base font-bold">Create</p>
						</button>
					</div>
				</div>
				{/* Collections */}
				<div className="flex w-full flex-1 flex-col gap-2 overflow-scroll font-inter">
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
			</>
		</Page>
	);
};

export default Collections;
