import { Outlet } from 'react-router-dom';

const Centered = ({ children }) => {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-splash bg-cover">
			<div className="m-20">
				<div className="bg-zinc-900 p-12 rounded-md justify-center flex items-center text-white gap-2 border-neutral-700 border shadow-lg transition-all">
					<Outlet />
					{children}
				</div>
			</div>
		</div>
	);
};

export default Centered;
