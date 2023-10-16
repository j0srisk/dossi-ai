import DropdownMenu from '@/components/DropdownMenu';
import { useState } from 'react';

export default function SearchBar({ setSearch, setSort, sort, setOrder, order }) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<div className="flex items-center justify-between gap-2 border-b border-neutral-300 pb-2 text-neutral-500">
			<div className="flex w-full items-center gap-2">
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
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
				<input
					type="text"
					placeholder="Search..."
					className="w-full bg-transparent font-normal text-neutral-900 placeholder-neutral-500 focus:outline-0"
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<button className="relative flex items-center gap-1" onClick={() => setMenuOpen(!menuOpen)}>
				<p className="whitespace-nowrap text-sm font-normal">Sort by</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
					className="h-4 w-4"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
				</svg>
				{menuOpen && (
					<DropdownMenu top={'top-6'} setMenuOpen={setMenuOpen}>
						<div
							className="flex items-center gap-1 whitespace-nowrap rounded-md p-1 pr-4 text-left text-xs font-bold text-neutral-900 hover:cursor-pointer hover:bg-accent hover:text-white"
							onClick={() => {
								setSort('name');
								if (sort === 'name') {
									setOrder(order === 'asc' ? 'desc' : 'asc');
								}
							}}
						>
							<div className="flex h-full w-4 items-center justify-center">
								{sort === 'name' && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={3}
										stroke="currentColor"
										className={`h-3 w-3 ${order === 'asc' ? '' : 'rotate-180 transform'}`}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4.5 15.75l7.5-7.5 7.5 7.5"
										/>
									</svg>
								)}
							</div>
							<div className="w-full">Name</div>
						</div>
						<div
							className="flex items-center gap-1 whitespace-nowrap rounded-md p-1 pr-4 text-left text-xs font-bold text-neutral-900 hover:cursor-pointer hover:bg-accent hover:text-white"
							onClick={() => {
								setSort('date');
								if (sort === 'date') {
									setOrder(order === 'asc' ? 'desc' : 'asc');
								}
							}}
						>
							<div className="flex h-full w-4 items-center justify-center">
								{sort === 'date' && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={3}
										stroke="currentColor"
										className={`h-3 w-3 ${order === 'asc' ? '' : 'rotate-180 transform'}`}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4.5 15.75l7.5-7.5 7.5 7.5"
										/>
									</svg>
								)}
							</div>
							<div className="w-full">Creation Date</div>
						</div>
					</DropdownMenu>
				)}
			</button>
		</div>
	);
}
