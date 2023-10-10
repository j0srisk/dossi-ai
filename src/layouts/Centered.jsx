import { Outlet } from 'react-router-dom';

const Centered = ({ children }) => {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-splash bg-cover">
			<div className="m-20">
				<div className="group flex items-center justify-center gap-2 rounded-md border border-neutral-700 bg-zinc-900 p-12 text-white shadow-lg">
					<Outlet />
					{children}
				</div>
			</div>
		</div>
	);
};

export default Centered;
