import Button from '../components/Button';
import Input from '../components/Input';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import Centered from '../layouts/Centered';
import { useNavigate, useParams } from 'react-router-dom';

const Account = () => {
	const navigate = useNavigate();

	const { user } = useAuth({ redirectTo: '/auth' });
	const { profile, signOut } = useUser();
	const { userId } = useParams();

	if (!user) {
		return null;
	} else if (user.id !== userId) {
		return null;
	}

	const handleSignOut = async () => {
		await signOut();
		navigate('/');
	};

	return (
		<Centered>
			{profile && (
				<div className="flex flex-col gap-3">
					<img
						src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
						className="rounded-md border-neutral-700 border shadow-md aspect-square object-cover"
					/>
					<Input label="First Name" value={profile.first_name} />
					<Input label="Last Name" value={profile.last_name} />
					<Input label="API Key" value={profile.api_key} disabled={true} />
					<Button onClick={handleSignOut}>
						<p className="text-center text-base font-bold text-white">Sign Out</p>
					</Button>
				</div>
			)}
		</Centered>
	);
};

export default Account;
