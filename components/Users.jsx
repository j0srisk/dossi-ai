'use client';

import SearchBar from '@/components/SearchBar';
import User from '@/components/User';
import { useState } from 'react';

export default function Users({ users }) {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('name');
	const [order, setOrder] = useState('asc');

	return (
		<div className="relative flex flex-col gap-4 overflow-visible text-white">
			<SearchBar
				search={search}
				setSearch={setSearch}
				sort={sort}
				setSort={setSort}
				order={order}
				setOrder={setOrder}
			/>

			<div className="flex flex-col items-center justify-between">
				{users
					?.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
					.sort((a, b) => {
						if (sort === 'name') {
							if (order === 'asc') {
								return a.name.localeCompare(b.name);
							} else if (order === 'desc') {
								return b.name.localeCompare(a.name);
							}
						} else if (sort === 'date') {
							if (order === 'asc') return String(a.createdAt).localeCompare(String(b.createdAt));
							else if (order === 'desc') {
								return String(b.createdAt).localeCompare(String(b.createdAt));
							}
						}
						return 0;
					})
					.map((user) => (
						<User key={user.id} user={user} />
					))}
			</div>
		</div>
	);
}
