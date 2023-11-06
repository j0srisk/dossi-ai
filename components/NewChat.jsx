import DropdownMenu from './DropdownMenu';
import ItemContainer from './ItemContainer';
import DeleteModal from '@/components/DeleteModal';
import Item from '@/components/Item';
import ItemButtonContainer from '@/components/ItemButtonContainer';
import ItemChatButton from '@/components/ItemChatButton';
import ItemIcon from '@/components/ItemIcon';
import ItemMenuButton from '@/components/ItemMenuButton';
import ItemText from '@/components/ItemText';
import RenameModal from '@/components/RenameModal';
import { useState } from 'react';

export default function NewChat({ chat, topic }) {
	const [topicId] = useState(chat.document || chat.collection);
	const [menuOpen, setMenuOpen] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

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
								d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
							/>
						</svg>
					}
				/>
				<ItemText text={chat.name} subtext={topic.name} />
				<ItemButtonContainer menuOpen={menuOpen}>
					<ItemChatButton text="Open Chat" href={'/c/' + topicId + '?chat=' + chat.id} />
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
					name={chat.name}
					setIsRenaming={setIsRenaming}
					updateFunction={null}
				/>
			)}

			{isDeleting && (
				<DeleteModal
					text="Delete Chat"
					name={chat.name}
					setIsDeleting={setIsDeleting}
					deleteFunction={null}
				/>
			)}
		</Item>
	);
}
