import DropdownMenu from '@/components/DropdownMenu';
import Modal from '@/components/Modal';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const NewDocument = ({ document }) => {
	const inputRef = useRef(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [selectedFileName, setSelectedFileName] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [newName, setNewName] = useState(document.name);

	useEffect(() => {
		if (isRenaming) {
			inputRef.current.focus();
		}
	}, [isRenaming]);

	const updateDocument = async (name) => {
		const supabase = createClientComponentClient();
		const { error } = await supabase.from('documents').update({ name: name }).eq('id', document.id);

		if (error) {
			console.error(error);
			return;
		}
	};

	const deleteDocument = async () => {
		const supabase = createClientComponentClient();
		const { error } = await supabase.from('documents').delete().eq('id', document.id);

		if (error) {
			console.error(error);
			return;
		}
	};

	return (
		<div className="group relative flex h-16 w-full items-center justify-between gap-2 rounded-lg py-2 text-neutral-900 transition-all duration-300 ease-in-out">
			<div className="z-10 flex h-full w-full items-center gap-3">
				<div className="flex h-full items-center justify-center rounded-md border border-neutral-300 bg-white px-2 shadow-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
						/>
					</svg>
				</div>
				<div className="flex w-full flex-col">
					<div className="text-lg font-bold">{document.name}</div>
					<p className="text-sm text-neutral-500">Some Text</p>
				</div>
			</div>

			<div className="absolute -left-2 hidden h-full w-[calc(100%+1rem)] rounded-lg bg-neutral-100 group-hover:block" />

			<div className="z-20 hidden h-full items-center gap-2 py-2 group-hover:flex">
				<Link
					href={`/c/` + document.id}
					className="animate-grow flex h-full items-center rounded-lg border border-neutral-300 bg-white px-4 shadow-sm transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-neutral-700 hover:bg-opacity-10"
				>
					<p className="whitespace-nowrap text-xs font-bold">Chat with Document</p>
				</Link>
				<div
					className="animate-grow relative flex h-full items-center justify-center rounded-lg border border-neutral-300 bg-white px-1 shadow-sm transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-neutral-700 hover:bg-opacity-10"
					onClick={() => {
						setMenuOpen(!menuOpen);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="h-6 w-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
						/>
					</svg>
					{menuOpen && (
						<DropdownMenu>
							<p
								className="whitespace-nowrap rounded-md p-1 px-4 text-xs font-bold hover:cursor-pointer hover:bg-accent hover:text-white"
								onClick={() => setIsRenaming(true)}
							>
								Rename
							</p>
							<p
								className="whitespace-nowrap rounded-md p-1 px-4 text-xs font-bold hover:cursor-pointer hover:bg-accent hover:text-white"
								onClick={() => setIsDeleting(true)}
							>
								Delete
							</p>
						</DropdownMenu>
					)}
				</div>
			</div>

			{isRenaming && (
				<Modal>
					<p className="font-bold">Rename Document</p>
					<input
						ref={inputRef}
						className="w-full rounded-md bg-neutral-100 p-2 px-2 text-xs outline-none ring-inset focus:ring-2 focus:ring-accent"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
					/>
					<div className="flex w-full items-center justify-between gap-2">
						<button
							className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-neutral-300"
							onClick={() => {
								setIsRenaming(false);
								setNewName(document.name);
							}}
						>
							<p className="whitespace-nowrap text-sm font-bold">Cancel</p>
						</button>
						<button
							className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-accent hover:text-white"
							onClick={() => {
								setIsRenaming(false);
								updateDocument(newName);
							}}
						>
							<p className="whitespace-nowrap text-sm font-bold">Rename</p>
						</button>
					</div>
				</Modal>
			)}
			{isDeleting && (
				<Modal>
					<p className="font-bold">Delete Document</p>

					<div className="flex w-full items-center gap-1 text-sm">
						<p>Are you sure you want to delete: </p>
						<p className="font-bold">{document.name}</p>
					</div>

					<p className="text-sm font-bold text-rose-500">This action cannot be undone.</p>

					<div className="flex w-full items-center justify-between gap-2">
						<button
							className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-neutral-300"
							onClick={() => setIsDeleting(false)}
						>
							<p className="whitespace-nowrap text-sm font-bold">Cancel</p>
						</button>
						<button
							className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-rose-500 hover:text-white"
							onClick={() => {
								setIsDeleting(false);
								deleteDocument();
							}}
						>
							<p className="whitespace-nowrap text-sm font-bold">Delete</p>
						</button>
					</div>
				</Modal>
			)}
		</div>
	);
};

export default NewDocument;
