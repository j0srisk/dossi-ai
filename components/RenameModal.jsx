import Modal from '@/components/Modal';
import { useState, useRef, useEffect } from 'react';

export default function RenameModal({ text, name, setIsRenaming, updateFunction }) {
	const inputRef = useRef(null);
	const [newName, setNewName] = useState(name);
	const [processing, setProcessing] = useState(false);

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
						setProcessing(true);
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
					disabled={processing}
				>
					<p className="whitespace-nowrap text-sm font-bold">Cancel</p>
				</button>
				{processing ? (
					<button className="flex h-full w-full items-center justify-center gap-1 rounded-md bg-accent p-2 px-4 text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="h-4 w-4 animate-spin"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
						<p className="whitespace-nowrap text-sm font-bold">Rename</p>
					</button>
				) : (
					<button
						className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-accent hover:text-white"
						onClick={() => {
							setProcessing(true);
							if (newName !== name) {
								updateFunction(newName);
							}
						}}
						disabled={newName === name}
					>
						<p className="whitespace-nowrap text-sm font-bold">Rename</p>
					</button>
				)}
			</div>
		</Modal>
	);
}
