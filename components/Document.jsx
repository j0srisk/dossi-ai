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
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Document({ document, collection }) {
	const [menuOpen, setMenuOpen] = useState(false);

	const [isRenaming, setIsRenaming] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const router = useRouter();

	const updateDocument = async (name) => {
		await fetch(`/api/document/${document.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ name }),
		});

		router.refresh();
	};

	const deleteDocument = async () => {
		await fetch(`/api/document/${document.id}`, {
			method: 'DELETE',
		});

		router.refresh();
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
								d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
							/>
						</svg>
					}
				/>
				<ItemText text={document.name} subtext={collection ? collection.name : 'No Collection'} />
				<ItemButtonContainer menuOpen={menuOpen}>
					<ItemChatButton text="Chat with Document" href={'/c/' + document.id} />
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
				</DropdownMenu>
			)}

			{isRenaming && (
				<RenameModal
					text="Rename Chat"
					name={document.name}
					setIsRenaming={setIsRenaming}
					updateFunction={updateDocument}
				/>
			)}

			{isDeleting && (
				<DeleteModal
					text="Delete Chat"
					name={document.name}
					setIsDeleting={setIsDeleting}
					deleteFunction={deleteDocument}
				/>
			)}
		</Item>
	);
}
