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

export default function Document({ user }) {
	const [menuOpen, setMenuOpen] = useState(false);

	const router = useRouter();

	return (
		<Item menuOpen={menuOpen}>
			<ItemContainer>
				<div
					className="flex h-full items-center justify-center rounded-md border border-neutral-300 bg-white px-2 shadow-sm"
					style={{
						backgroundImage: `url(${user.image})`,
						backgroundSize: 'cover', // Optional: Adjust the size of the background image
						backgroundPosition: 'center', // Center the background image
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className={`h-5 w-5 ${user.image ? 'opacity-0' : 'opacity-100'}`}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
						/>
					</svg>
				</div>

				<ItemText text={user.name} subtext={user.email} badge={user.admin ? 'Admin' : null} />
				<ItemButtonContainer menuOpen={menuOpen}>
					<ItemMenuButton menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
				</ItemButtonContainer>
			</ItemContainer>

			{/* Modals and Menus */}
			{menuOpen && (
				<DropdownMenu setMenuOpen={setMenuOpen}>
					<p className="whitespace-nowrap rounded-md p-1 px-4 text-xs font-bold hover:cursor-pointer hover:bg-accent hover:text-white">
						Update Admin Status
					</p>
				</DropdownMenu>
			)}
		</Item>
	);
}
