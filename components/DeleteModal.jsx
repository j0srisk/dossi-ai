import Modal from '@/components/Modal';

export default function DeleteModal({ text, name, setIsDeleting, deleteFunction }) {
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
				>
					<p className="whitespace-nowrap text-sm font-bold">Cancel</p>
				</button>
				<button
					className="flex h-full w-full items-center justify-center rounded-md bg-neutral-200 p-2 px-4 hover:cursor-pointer hover:bg-rose-500 hover:text-white"
					onClick={() => {
						setIsDeleting(false);
						deleteFunction();
					}}
				>
					<p className="whitespace-nowrap text-sm font-bold">Delete</p>
				</button>
			</div>
		</Modal>
	);
}
