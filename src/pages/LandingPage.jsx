import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
	const navigate = useNavigate();

	const { user } = useAuth({ redirectTo: '' });

	if (user) {
		return null;
	}

	return (
		<div className="flex flex-col gap-3">
			<Logo />
			<div className="flex w-full gap-3">
				<Button onClick={() => navigate('login')}>
					<p className="text-center text-base font-bold text-white">Log In</p>
				</Button>
				<Button onClick={() => navigate('signup')}>
					<p className="text-center text-base font-bold text-white">Sign Up</p>
				</Button>
			</div>
		</div>
	);
};

export default LandingPage;
