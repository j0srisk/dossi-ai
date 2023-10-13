'use client';

import Document from './Document';
import UploadFile from './UploadFile';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const Collection = ({ collection, documents, children }) => {
	const [isActive, setIsActive] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [name, setName] = useState(collection.name);
	const [newName, setNewName] = useState(collection.name);

	const inputRef = useRef(null);
	const confirmEditButtonRef = useRef(null);
	const confirmDeleteButtonRef = useRef(null);

	const updateCollection = async (name) => {
		const supabase = createClientComponentClient();
		const { error } = await supabase
			.from('collections')
			.update({ name: name })
			.eq('id', collection.id);

		if (error) {
			console.error(error);
			return;
		}
	};

	const deleteCollection = async () => {
		const supabase = createClientComponentClient();
		const { error } = await supabase.from('collections').delete().eq('id', collection.id);

		if (error) {
			console.error(error);
			return;
		}
	};

	const handleBlur = () => {
		setTimeout(() => {
			if (
				!confirmEditButtonRef.current ||
				!confirmEditButtonRef.current.contains(document.activeElement)
			) {
				setIsEditing(false);
				setNewName(name);
			}
		}, 0);
	};

	useEffect(() => {
		if (!isEditing) {
			setName(collection.name);
			setNewName(collection.name);
		}
	}, [collection.name]);

	//immediately removes collection from view if deleted
	if (deleted) {
		return null;
	}

	return (
		<div
			className="flex w-full flex-col justify-center whitespace-nowrap rounded-md border border-neutral-300 bg-white font-bold text-zinc-900 shadow-sm transition-all hover:cursor-pointer"
			onClick={() => {
				if (!isEditing && !isDeleting) {
					setIsActive(!isActive);
				}
			}}
		>
			{/* Collection Name*/}
			<div className="flex min-h-[44px] w-full  items-center justify-between gap-2 overflow-hidden p-2">
				{!isEditing && !isDeleting && (
					<>
						<div className="flex items-center gap-1 ">
							<p>{name}</p>
							<p className="text-sm font-normal italic text-neutral-400">
								- {documents.filter((document) => document.collection === collection.id).length}{' '}
								{documents.filter((document) => document.collection === collection.id).length === 1
									? 'document'
									: 'documents'}
							</p>
						</div>
						<div className="flex items-center gap-2 text-neutral-400">
							{isActive && (
								<div className="flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="h-5 w-5 hover:cursor-pointer hover:text-zinc-900"
										onClick={(e) => {
											e.stopPropagation();
											setIsEditing(true);
											setTimeout(() => {
												inputRef.current.focus();
											}, 0);
										}}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
										/>
									</svg>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="h-5 w-5 hover:cursor-pointer hover:text-zinc-900"
										onClick={(e) => {
											e.stopPropagation();
											setIsDeleting(true);
										}}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
										/>
									</svg>
								</div>
							)}
							{documents.some((document) => document.collection === collection.id) && (
								<Link
									href={`/c/` + collection.id}
									className="flex items-center gap-1 rounded-md bg-neutral-400 p-1 px-2 font-ar-one-sans text-sm text-white"
									onClick={(e) => {
										e.stopPropagation();
									}}
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
											d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
										/>
									</svg>
									Chat with Collection
								</Link>
							)}
						</div>
					</>
				)}

				{isEditing && (
					<>
						<input
							type="text"
							className="w-full rounded-md border-none bg-transparent text-base outline-none"
							ref={inputRef}
							value={newName}
							disabled={!isEditing}
							onChange={(e) => setNewName(e.target.value)}
							onBlur={handleBlur}
							onClick={(e) => {
								e.stopPropagation();
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									setName(newName);
									updateCollection(newName);
									setIsEditing(false);
								}
							}}
						/>
						<button
							className="flex h-full items-center gap-1 rounded-md bg-green-500 p-1 px-2 text-sm text-white"
							onClick={() => {
								setName(newName);
								updateCollection(newName);
								setIsEditing(false);
							}}
							ref={confirmEditButtonRef}
						>
							Confirm
						</button>
						<button className="flex h-full items-center gap-1 rounded-md bg-neutral-300 p-1 px-2 text-sm text-white">
							Cancel
						</button>
					</>
				)}

				{isDeleting && (
					<>
						<div className="flex items-center gap-1">
							<p className="w-fit font-normal">Are you sure you want to delete:</p>
							<p className="w-fit">{name}</p>
						</div>
						<div className="flex items-center gap-2">
							<button
								className="flex h-full items-center gap-1 rounded-md bg-rose-500 p-1 px-2 text-sm text-white"
								onClick={() => {
									deleteCollection();
									setIsDeleting(false);
									setDeleted(true);
								}}
								ref={confirmDeleteButtonRef}
							>
								Delete
							</button>
							<button
								className="flex h-full items-center gap-1 rounded-md bg-neutral-300 p-1 px-2 text-sm text-white"
								onClick={() => setIsDeleting(false)}
							>
								Cancel
							</button>
						</div>
					</>
				)}
			</div>

			{/* Documents */}
			{isActive && (
				<div
					className="flex w-full flex-col rounded-b-md border-t border-neutral-300 bg-white p-2"
					onClick={(e) => e.stopPropagation()}
				>
					{documents.length === 0 && (
						<div className="hidden p-6">
							<p className="text-center text-sm font-bold">
								Add one or more documents to this collection to chat
							</p>
						</div>
					)}
					<>
						{documents.map((document) => {
							return <Document key={document.id} collection={collection} documentObj={document} />;
						})}
						<UploadFile collection={collection} />
					</>
				</div>
			)}
		</div>
	);
};

export default Collection;
