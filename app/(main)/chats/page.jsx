export default async function Page() {
	return (
		<div className="flex flex-col gap-4 text-neutral-900">
			<div className="flex items-center justify-between">
				<p className="text-2xl font-bold">Previous Chats</p>
			</div>
			<div className="flex w-full flex-1 flex-col gap-2 overflow-visible font-inter"></div>
		</div>
	);
}
