import useUser from '../../hooks/useUser';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountInfo = () => {
	const [loading, setLoading] = useState(true);

	const { profile } = useUser();

	const navigate = useNavigate();

	useEffect(() => {
		if (profile) {
			setLoading(false);
		}
	}, [profile]);

	return (
		<button
			className="rounded-md flex items-center text-white gap-2 justify-between flex-1 p-2 border border-transparent hover:border-neutral-700 hover:border hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all text-sm"
			onClick={() => navigate('/account/' + profile.id)}
		>
			{!loading ? (
				<>
					<img
						src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
						className="rounded-full h-8 w-8 object-cover"
					></img>
					<p className="text-center w-full text-lg font-bold text-white">
						{profile.first_name} {profile.last_name}
					</p>
				</>
			) : (
				<p className="text-center text-lg font-bold text-white">Loading...</p>
			)}
		</button>
	);
};

export default AccountInfo;
