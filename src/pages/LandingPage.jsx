import { useNavigate } from 'react-router-dom';
import useRequireUnauth from '../hooks/useRequireUnauth';

const LandingPage = () => {
	const navigate = useNavigate();

	const user = useRequireUnauth();

	return (
		<div>
			<h1 className="text-center text-base font-bold">Landing Page</h1>
			<button onClick={() => navigate('/login')}>Login</button>
		</div>
	);
};

export default LandingPage;
