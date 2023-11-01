import ItemContainer from './ItemContainer';
import DeleteModal from '@/components/DeleteModal';
import DropdownMenu from '@/components/DropdownMenu';
import Item from '@/components/Item';
import ItemButtonContainer from '@/components/ItemButtonContainer';
import ItemChatButton from '@/components/ItemChatButton';
import ItemIcon from '@/components/ItemIcon';
import ItemMenuButton from '@/components/ItemMenuButton';
import ItemText from '@/components/ItemText';
import RenameModal from '@/components/RenameModal';
import UploadModal from '@/components/UploadModal';
import { useState } from 'react';

export default function NewCollection({ collection, documents }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const updateCollection = async (name) => {
		fetch(`/api/collection/${collection.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ name }),
		});
	};

	const deleteCollection = async () => {
		fetch(`/api/collection/${collection.id}`, {
			method: 'DELETE',
		});
	};

	const handleFileUpload = (selectedFile) => {
		const file = selectedFile;

		const formData = new FormData();

		console.log(collection.id);
		formData.append('file', file);
		formData.append('name', file.name);
		formData.append('collectionId', collection.id);

		fetch('/api/document', {
			method: 'POST',
			body: formData,
		});
	};

	return (
		<Item menuOpen={menuOpen}>
			<ItemContainer>
				<ItemIcon
					svg={
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
								d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
							/>
						</svg>
					}
				/>
				<ItemText
					text={collection.name}
					subtext={
						documents.filter((document) => document.collection === collection.id).length +
						' ' +
						(documents.filter((document) => document.collection === collection.id).length === 1
							? 'document'
							: 'documents')
					}
				/>
				<ItemButtonContainer menuOpen={menuOpen}>
					{documents.filter((document) => document.collection === collection.id).length > 0 && (
						<ItemChatButton text="Chat with Collection" href={'/c/' + collection.id} />
					)}
					<ItemMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
				</ItemButtonContainer>
			</ItemContainer>

			{/* Modals and Menus */}
			{menuOpen && (
				<DropdownMenu setMenuOpen={setMenuOpen}>
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
					<p
						className="whitespace-nowrap rounded-md p-1 px-4 text-xs font-bold hover:cursor-pointer hover:bg-accent hover:text-white"
						onClick={() => setIsUploading(true)}
					>
						Upload Document
					</p>
				</DropdownMenu>
			)}

			{isRenaming && (
				<RenameModal
					text="Rename Collection"
					name={collection.name}
					setIsRenaming={setIsRenaming}
					updateFunction={updateCollection}
				/>
			)}

			{isDeleting && (
				<DeleteModal
					text="Delete Chat"
					name={collection.name}
					setIsDeleting={setIsDeleting}
					deleteFunction={deleteCollection}
				/>
			)}

			{isUploading && (
				<UploadModal
					text="Upload Document"
					setIsUploading={setIsUploading}
					uploadFunction={handleFileUpload}
				/>
			)}
		</Item>
	);
}
