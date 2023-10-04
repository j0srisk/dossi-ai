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
		<button className="rounded-md flex items-center text-white gap-2 justify-between flex-1 p-2 border border-transparent hover:border-neutral-700 hover:border hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all text-sm">
			{!loading ? (
				<>
					<img
						src="https://t3.ftcdn.net/jpg/05/71/08/24/360_F_571082432_Qq45LQGlZsuby0ZGbrd79aUTSQikgcgc.jpg"
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
