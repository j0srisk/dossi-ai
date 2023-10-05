import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
	const navigate = useNavigate();

	const { user } = useAuth({ redirectTo: '' });

	if (user) {
		return null;
	}

	return (
		<div className="m-40 w-96">
			<div className="flex flex-col gap-3">
				<h1 className="text-center text-xl font-bold text-white">Get Started</h1>
				<div className="flex w-full gap-3">
					<button
						onClick={() => navigate('login')}
						className="flex-1 rounded-md bg-blue-500 p-3 hover:bg-blue-600 hover:bg-opacity-90  hover:shadow-md"
					>
						<p className="text-center text-base font-bold text-white">Log In</p>
					</button>
					<button
						onClick={() => navigate('signup')}
						className="flex-1 rounded-md bg-blue-500 p-3 hover:bg-blue-600 hover:bg-opacity-90  hover:shadow-md"
					>
						<p className="text-center text-base font-bold text-white">Sign Up </p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
