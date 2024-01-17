export default function Logo() {
	return (
		<div className="relative flex w-fit items-start justify-center gap-2 p-6">
			<h1 className="text-center text-6xl font-bold text-white ">Dossi</h1>

			<div className="relative mt-1 shadow-md">
				<div className="flex h-7 rounded-md bg-neutral-700 p-[3px]">
					<div className="z-20 flex h-full w-full items-center justify-center rounded-[3px] border-neutral-700 bg-neutral-900 px-3 font-extrabold text-neutral-700 transition-all duration-1000 ease-in-out group-hover:text-white">
						AI
					</div>
				</div>
				<div className="group absolute right-0 top-0 flex h-full w-full rounded-md bg-gradient-to-br from-[#49CC5F] from-10% to-[#a3e635] opacity-0 transition-all duration-1000 ease-in-out group-hover:opacity-100"></div>
			</div>
		</div>
	);
}
