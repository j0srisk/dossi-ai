import { CollectionsContext } from '../../contexts/collections';
import Document from './Document';
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Collection = ({ collection, documents }) => {
	const [isActive, setIsActive] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(collection.name);

	const { handleUpdateCollection, handleDeleteCollection, handleCreateDocument } =
		useContext(CollectionsContext);

	const inputRef = useRef(null);

	const navigate = useNavigate();

	const { collectionId, documentId } = useParams();

	useEffect(() => {
		if (collectionId === collection.id) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [collectionId, collection.id]);

	const handleClick = () => {
		console.log('clicked collection: ', collection.name);
		navigate(`/c/${collection.id}`);
	};

	return (
		<div
			className={`flex flex-col rounded-md text-white hover:cursor-pointer whitespace-nowrap text-base font-bold p-2 gap-2 border ${
				isActive ? 'bg-zinc-700 border-neutral-500' : ' border-neutral-800 '
			}`}
			onClick={handleClick}
		>
			<div className="relative flex w-full flex-1 items-center justify-start gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-5 w-5 flex-shrink-0"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
					/>
				</svg>
				<div className="relative w-full overflow-hidden">
					<input
						type="text"
						className={`bg-transparent border-none outline-none w-full ${
							isEditing ? 'block' : 'hidden'
						}`}
						ref={inputRef}
						value={name}
						disabled={!isEditing}
						onChange={(e) => setName(e.target.value)}
						onBlur={() => {
							setIsEditing(false);
							handleUpdateCollection(collection, name);
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								inputRef.current.blur();
							}
						}}
					/>
					<p className={`${isEditing ? 'hidden' : 'block'}`}>{name}</p>
					<div
						className={`absolute top-0 right-0 w-5 h-full bg-gradient-to-l to-transparent ${
							isActive ? 'from-zinc-700' : 'from-neutral-800'
						}`}
					></div>
				</div>
				{isActive && !documentId && (
					<div className="flex flex-1 justify-end gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="h-4 w-4 stroke-neutral-500 flex-shrink-0"
							onClick={() => {
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
							className="h-4 w-4 stroke-neutral-500 flex-shrink-0"
							onClick={() => {
								handleDeleteCollection(collection);
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
			</div>
			{collectionId === collection.id && (
				<div className="flex flex-col w-full gap-2">
					{documents.map((document) => {
						return <Document key={document.id} collection={collection} document={document} />;
					})}
					<div className="relative w-full">
						<button className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-neutral-500 p-2 text-neutral-500">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="h-4 w-4 flex-shrink-0"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>

							<p className="text-center text-base">New Document</p>
						</button>
						<input
							type="file"
							id="file"
							name="file"
							className="absolute top-0 h-full w-full rounded-md opacity-0"
							onChange={(e) => handleCreateDocument(e)}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Collection;
