import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

const Main = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	return (
		<div>
			<div className="flex h-screen items-center justify-center">
				<Outlet />
			</div>
		</div>
	);
};

export default Main;
