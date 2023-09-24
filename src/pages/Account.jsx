import { useLoaderData } from 'react-router-dom';
import useRequireAuth from '../hooks/useRequireAuth';

const Account = () => {
	const loaderData = useLoaderData();
	const userProfile = loaderData.data;
	const user = useRequireAuth();

	if (!user) {
		return null;
	}
	return (
		<div>
			<h1 className="text-center text-base font-bold text-white">
				{userProfile.first_name} {userProfile.last_name}
			</h1>
			<h1 className="text-center text-base font-bold text-white">{user.email}</h1>
		</div>
	);
};

export default Account;
