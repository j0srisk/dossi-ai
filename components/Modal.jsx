export default function Modal({ children, onClose }) {
	return (
		<div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-black bg-opacity-10">
			<div className="flex w-96 flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg">
				{children}
			</div>
		</div>
	);
}
