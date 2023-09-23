import { Outlet } from 'react-router-dom';

const Main = () => {
	return (
		<div>
			<div className="flex h-screen items-center justify-center">
				<Outlet />
			</div>
		</div>
	);
};

export default Main;
