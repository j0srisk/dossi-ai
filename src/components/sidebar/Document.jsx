import { CollectionsContext } from '../../contexts/collections';
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Document = ({ collection, document }) => {
	const [isActive, setIsActive] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(document.name);

	const { handleUpdateDocument, handleDeleteDocument } = useContext(CollectionsContext);

	const inputRef = useRef(null);

	const { documentId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (documentId === document.id) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [documentId, document.id]);

	const handleClick = (e) => {
		e.stopPropagation();
		navigate(`/c/${collection.id}/${document.id}`);
	};

	return (
		<div
			className={`relative flex font-bold border-transparent w-full flex-1 items-center justify-start gap-2 p-2 border ${
				isActive
					? 'px-2 rounded-md border-neutral-700 bg-neutral-700 bg-opacity-10'
					: 'rounded-md hover:border-neutral-700 hover:cursor-pointer hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all'
			}`}
			onClick={handleClick}
		>
			<div className="relative w-full overflow-hidden">
				<p className={`${isEditing ? 'hidden' : 'block'}`}>{name}</p>
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
						handleUpdateDocument(document, name);
					}}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							inputRef.current.blur();
						}
					}}
				/>
			</div>
			{isActive && (
				<div className="flex flex-1 justify-end gap-1 text-neutral-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="h-4 w-4 flex-shrink-0 hover:cursor-pointer"
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
						className="h-4 w-4  flex-shrink-0 hover:cursor-pointer"
						onClick={() => handleDeleteDocument(document, collection)}
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
	);
};

export default Document;
