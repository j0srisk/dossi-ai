import Collection from './Collection';

const CollectionsList = ({ collections, documents, sortMethod }) => {
	if (sortMethod === 'name') {
		collections.sort((a, b) => a.name.localeCompare(b.name));
	}

	return (
		<div className="flex flex-1 flex-col gap-2 overflow-scroll">
			{collections.map((collection) => (
				<Collection
					key={collection.id}
					collection={collection}
					documents={documents.filter((doc) => doc.collection === collection.id)}
				/>
			))}
		</div>
	);
};

export default CollectionsList;
