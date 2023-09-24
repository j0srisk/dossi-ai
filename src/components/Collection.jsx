import { useState, useRef } from 'react';
import Document from './Document';
import Upload from './Upload';
import Documents from './Documents';

import { supabase } from '../services/supabase';

const Collection = ({ id, name, activeCollection, setActiveCollection, fetchCollections }) => {
	const [collectionName, setCollectionName] = useState(name);
	const [editing, setEditing] = useState(false);

	const inputRef = useRef(null);

	const handleClick = () => {
		setActiveCollection(id);
	};

	const updateCollectionName = async () => {
		const { error } = await supabase
			.from('collections')
			.update({ name: collectionName })
			.eq('id', id);
		if (error) {
			alert(error.message);
		} else {
			setEditing(false);
			fetchCollections();
		}
	};

	const deleteCollection = async () => {
		const { error } = await supabase.from('collections').delete().eq('id', id);
		if (error) {
			alert(error.message);
		} else {
			setActiveCollection(null);
			fetchCollections();
		}
	};

	return (
		<div
			className={`gap p flex flex-col rounded-md p-1 text-white hover:cursor-pointer ${
				id === activeCollection ? 'bg-zinc-700' : ' '
			}`}
			onClick={handleClick}
		>
			{id === activeCollection && (
				<div className="m-2 flex flex-1 items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
						/>
					</svg>

					<input
						ref={inputRef}
						className="w-full flex-1 bg-transparent text-base font-bold focus:outline-none"
						value={collectionName}
						disabled={!editing}
						onBlur={() => {
							setEditing(false);
							updateCollectionName();
						}}
						onChange={(e) => setCollectionName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								inputRef.current.blur();
							}
						}}
					/>

					<div className="flex gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="h-4 w-4 stroke-neutral-500"
							onClick={() => {
								setEditing(true);
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
							className="h-4 w-4 stroke-neutral-500"
							onClick={() => deleteCollection()}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
							/>
						</svg>
					</div>
				</div>
			)}

			{id != activeCollection && (
				<div className="m-2 flex flex-1 items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="h-5 w-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
						/>
					</svg>

					<p className="flex-1 text-base font-bold">{collectionName}</p>
				</div>
			)}

			{id === activeCollection && (
				<div className="flex flex-1 flex-col gap-1 rounded-md p-1">
					<Documents collection={id} />
				</div>
			)}
		</div>
	);
};

export default Collection;
