import { Outlet } from 'react-router-dom';

const Content = () => (
	<div>
		<div className="flex h-screen items-center justify-center bg-zinc-900 text-white">
			<div className="flex h-full flex-1 flex-col overflow-scroll">
				<Outlet />
			</div>
			<div className="flex h-full flex-1 flex-col items-center justify-center ">Chat Window</div>
		</div>
	</div>
);

export default Content;
