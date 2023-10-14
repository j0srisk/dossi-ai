import Modal from '@/components/Modal';
import { useState, useRef, useEffect } from 'react';

export default function RenameModal({ text, name, setIsRenaming, updateFunction }) {
	const inputRef = useRef(null);
	const [newName, setNewName] = useState(name);

	useEffect(() => {
		inputRef.current.focus();
	}, []);

	return (
		<Modal>
			<p className="font-bold">{text}</p>
			<input
				ref={inputRef}
				className="w-full rounded-md bg-neutral-100 p-2 px-2 text-sm outline-none ring-inset focus:ring-2 focus:ring-accent"
				value={newName}
				onChange={(e) => setNewName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						setIsRenaming(false);
						if (newName !== name) {
							updateFunction(newName);
						}
					}
				}}
			/>
			<div className="flex w-full items-center justify-between gap-2">
				<button
					className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-neutral-300"
					onClick={() => {
						setIsRenaming(false);
						setNewName(name);
					}}
				>
					<p className="whitespace-nowrap text-sm font-bold">Cancel</p>
				</button>
				<button
					className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-accent hover:text-white"
					onClick={() => {
						setIsRenaming(false);
						if (newName !== name) {
							updateFunction(newName);
						}
					}}
					disabled={newName === name}
				>
					<p className="whitespace-nowrap text-sm font-bold">Rename</p>
				</button>
			</div>
		</Modal>
	);
}
