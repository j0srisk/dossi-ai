import { useState } from 'react';
import Document from './Document';
import Upload from './Upload';

const Collection = ({ id, activeCollection, setActiveCollection }) => {
	const [activeDocument, setActiveDocument] = useState(null);
	const [collectionName, setCollectionName] = useState('Collection');

	const handleClick = () => {
		setActiveCollection(id);
	};

	return (
		<div
			className={`gap p flex flex-col rounded-md p-1 text-white hover:cursor-pointer ${
				id === activeCollection ? 'bg-zinc-700' : ' '
			}`}
			onClick={handleClick}
		>
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
					className="bg-transparent text-base font-bold focus:outline-none"
					value={collectionName}
					onChange={(e) => setCollectionName(e.target.value)}
				/>
			</div>
			{id === activeCollection && (
				<div className="flex flex-1 flex-col gap-1 rounded-md p-1">
					<Document id="1" activeDocument={activeDocument} setActiveDocument={setActiveDocument} />
					<Document id="2" activeDocument={activeDocument} setActiveDocument={setActiveDocument} />
					<Document id="3" activeDocument={activeDocument} setActiveDocument={setActiveDocument} />
					<Upload />
				</div>
			)}
		</div>
	);
};

export default Collection;
