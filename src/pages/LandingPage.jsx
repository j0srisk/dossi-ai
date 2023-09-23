import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<div>
			<h1 className="text-center text-base font-bold">Landing Page</h1>
			<button onClick={() => navigate('/login')}>Login</button>
		</div>
	);
};

export default LandingPage;
