import { Outlet } from 'react-router-dom';

const Centered = ({ children }) => {
	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="w-96 m-20">
				<Outlet />
				{children}
			</div>
		</div>
	);
};

export default Centered;
