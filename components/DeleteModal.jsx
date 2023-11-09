import Modal from '@/components/Modal';
import { useState } from 'react';

export default function DeleteModal({ text, name, setIsDeleting, deleteFunction }) {
	const [processing, setProcessing] = useState(false);

	return (
		<Modal>
			<p className="font-bold">{text}</p>

			<div className="flex w-full flex-col  justify-start gap-1 text-sm">
				<p className="">Are you sure you want to delete: </p>
				<p className="font-bold">{name}</p>
			</div>

			<p className="text-sm font-bold text-rose-500">This action cannot be undone.</p>

			<div className="flex w-full items-center justify-between gap-2">
				<button
					className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-neutral-300"
					onClick={() => setIsDeleting(false)}
					disabled={processing}
				>
					<p className="whitespace-nowrap text-sm font-bold">Cancel</p>
				</button>
				{processing ? (
					<button className="flex h-full w-full items-center justify-center gap-1 rounded-md bg-rose-500 p-2 px-4 text-white">
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
						<p className="whitespace-nowrap text-sm font-bold">Deleting</p>
					</button>
				) : (
					<button
						className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-rose-500 hover:text-white"
						onClick={() => {
							setProcessing(true);
							deleteFunction();
						}}
					>
						<p className="whitespace-nowrap text-sm font-bold">Delete</p>
					</button>
				)}
			</div>
		</Modal>
	);
}
