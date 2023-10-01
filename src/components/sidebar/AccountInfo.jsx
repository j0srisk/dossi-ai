import useUser from '../../hooks/useUser';
import { useState, useEffect } from 'react';

const AccountInfo = () => {
	const [loading, setLoading] = useState(true);

	const { profile } = useUser();

	useEffect(() => {
		if (profile) {
			setLoading(false);
		}
	}, [profile]);

	return (
		<button className="border-t border-neutral-500 p-5">
			{!loading ? (
				<p className="text-center text-base font-bold text-white">
					{profile.first_name} {profile.last_name}
				</p>
			) : (
				<p className="text-center text-base font-bold text-white">Loading...</p>
			)}
		</button>
	);
};

export default AccountInfo;
