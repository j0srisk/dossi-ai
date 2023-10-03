import { CollectionsContext } from '../../contexts/collections';
import { useContext } from 'react';

const Bubble = ({
	role,
	content,
	handleSetDocument,
	setPageNumber,
	referencePage,
	referenceDocument,
}) => {
	const { documents } = useContext(CollectionsContext);

	return (
		<div className={`w-full flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`h-fit flex flex-col gap-2 w-fit max-w-[85%] rounded-xl p-3 items-start text-white ${
					role === 'user' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-neutral-500'
				}`}
			>
				{content}
				{referenceDocument && (
					<div className="flex flex-row items-center justify-start gap-2 w-full">
						<p>Document:</p>
						<button
							onClick={() => {
								handleSetDocument(referenceDocument);
							}}
							className=""
						>
							<p className="font-bold">
								{documents.find((document) => document.id === referenceDocument).name}
							</p>
						</button>
					</div>
				)}
				{referencePage && (
					<div className="flex flex-row items-center justify-start gap-2 w-full">
						<p>Page:</p>
						<button
							onClick={() => setPageNumber(referencePage)}
							className="bg-gradient-to-br from-cyan-500 to-blue-500 h-6 w-6 aspect-square flex items-center justify-center rounded-full"
						>
							<p className="font-bold">{referencePage} </p>
						</button>
					</div>
				)}
				{/*
				<button onClick={() => loadDocument('b2f6d0f9-c0ee-4bb6-b2cf-4515755a3fad')}>DOC</button>
				*/}
			</div>
		</div>
	);
};

export default Bubble;
