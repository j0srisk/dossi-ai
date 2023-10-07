import { CollectionsContext } from '../contexts/collections';
import Document from './Document';
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Collection = ({ collection, documents }) => {
	const [isActive, setIsActive] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [name, setName] = useState(collection.name);
	const [newName, setNewName] = useState(collection.name);

	const navigate = useNavigate();

	const { handleUpdateCollection, handleDeleteCollection, handleCreateDocument } =
		useContext(CollectionsContext);

	const inputRef = useRef(null);
	const confirmEditButtonRef = useRef(null);
	const confirmDeleteButtonRef = useRef(null);

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
		const handleClickOutside = (event) => {
			if (
				confirmDeleteButtonRef.current &&
				!confirmDeleteButtonRef.current.contains(event.target)
			) {
				setIsDeleting(false);
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	return (
		<div className="flex flex-col w-full rounded-md shadow-sm text-zinc-900 whitespace-nowrap group">
			{/* Collection Name */}
			<div
				className={`relative flex font-bold w-full flex-1 items-center justify-start gap-2 pr-2 border border-neutral-300 bg-white hover:cursor-pointer transition-all ${
					isActive ? 'rounded-t-md' : 'rounded-md'
				}`}
				onClick={() => {
					if (!isEditing && !isDeleting) {
						setIsActive(!isActive);
					}
				}}
			>
				{/* Collection Name and Input */}
				<div className="relative w-full overflow-hidden flex items-center gap-2">
					{isEditing && (
						<input
							type="text"
							className="p-2 bg-transparent border-none outline-none w-full text-base rounded-md"
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
									handleUpdateCollection(collection, newName);
									setIsEditing(false);
								}
							}}
						/>
					)}
					{isDeleting && <p className="w-fit p-2">Are you sure you want to delete: {name}</p>}
					{!isEditing && !isDeleting && <p className="w-fit p-2 pr-0">{name}</p>}
					{!isEditing && !isDeleting && (
						<p className="text-sm font-normal italic text-neutral-400">
							- {documents.filter((document) => document.collection === collection.id).length}{' '}
							{documents.filter((document) => document.collection === collection.id).length === 1
								? 'document'
								: 'documents'}
						</p>
					)}
				</div>

				{/* Edit and Delete Icons */}
				{isActive && !isEditing && !isDeleting && (
					<div className="text-neutral-400 flex gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-5 h-5 hover:cursor-pointer hover:text-zinc-900"
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
							className="w-5 h-5 hover:cursor-pointer hover:text-zinc-900"
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

				{/* Chat with Collection Buttons*/}
				{!isEditing && !isDeleting && (
					<>
						{documents.some((document) => document.collection === collection.id) ? (
							<button
								className="bg-blue-500 p-1 px-2 rounded-md text-white flex gap-1 items-center"
								onClick={() => navigate('/c/' + collection.id)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-4 h-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
									/>
								</svg>
								<p className="text-sm">Chat with Collection</p>
							</button>
						) : (
							<button
								className="bg-blue-500 opacity-25 p-1 px-2 rounded-md text-white flex gap-1 items-center"
								disabled={true}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={2}
									stroke="currentColor"
									className="w-4 h-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
									/>
								</svg>
								<p className="text-sm">Chat with Collection</p>
							</button>
						)}
					</>
				)}

				{/* Edit Confirm and Cancel Buttons */}
				{isEditing && (
					<>
						<button
							className="bg-green-500 p-1 px-2 rounded-md text-white flex gap-1 items-center h-full"
							onClick={() => {
								setName(newName);
								handleUpdateCollection(collection, newName);
								setIsEditing(false);
							}}
							ref={confirmEditButtonRef}
						>
							<p className="text-sm">Confirm</p>
						</button>
						<button className="bg-neutral-300 p-1 px-2 rounded-md text-white flex gap-1 items-center h-full">
							<p className="text-sm">Cancel</p>
						</button>
					</>
				)}

				{/* Delete Confirm and Cancel Buttons */}
				{isDeleting && (
					<>
						<button
							className="bg-rose-500 p-1 px-2 rounded-md text-white flex gap-1 items-center h-full"
							onClick={() => {
								handleDeleteCollection(collection);
								setIsDeleting(false);
							}}
							ref={confirmDeleteButtonRef}
						>
							<p className="text-sm">Delete</p>
						</button>
						<button className="bg-neutral-300 p-1 px-2 rounded-md text-white flex gap-1 items-center h-full">
							<p className="text-sm">Cancel</p>
						</button>
					</>
				)}
			</div>

			{/* Documents */}
			{isActive && (
				<div className="flex flex-col w-full gap-1 p-2 border border-neutral-300 bg-white border-t-0 rounded-b-md">
					{documents.length === 0 && (
						<div className="p-6 hidden">
							<p className="text-center text-sm font-bold">
								Add one or more documents to this collection to chat
							</p>
						</div>
					)}
					<>
						{documents.map((document) => {
							return <Document key={document.id} collection={collection} documentObj={document} />;
						})}
						<button className="p-2 flex hover:cursor-pointer hover:underline w-fit items-center gap-2 relative">
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
									d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>

							<p className="font-bold w-fit">Upload Document</p>
							<input
								type="file"
								id="file"
								name="file"
								accept=".pdf"
								className="absolute top-0 h-full w-full opacity-0"
								onChange={(e) => handleCreateDocument(e, collection.id)}
							/>
						</button>
					</>
					<div className="relative w-full hidden">
						<button className="rounded-md w-full border-dashed flex items-center justify-center gap-2 flex-1 p-2 border-neutral-300 text-neutral-300 border">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="w-4 h-4"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
								/>
							</svg>

							<p className="text-center text-sm font-bold">Upload Document</p>
						</button>
						<input
							type="file"
							id="file"
							name="file"
							accept=".pdf"
							className="absolute top-0 h-full w-full rounded-md opacity-0"
							onChange={(e) => handleCreateDocument(e, collection.id)}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Collection;
