export default function Modal({ children }) {
	return (
		<div className="fixed left-0 top-0 z-40 flex h-screen w-screen items-center justify-center bg-black bg-opacity-10">
			<div className="animate-grow-in-sm flex w-96 flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg">
				{children}
			</div>
		</div>
	);
}
