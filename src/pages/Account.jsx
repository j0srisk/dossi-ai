import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
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
		<div className="flex h-screen items-center justify-center bg-zinc-900">
			<div className="flex flex-col gap-3 m-40 w-96">
				<button
					className="rounded-md w-fit flex items-center gap-2 text-white justify-between flex-1 p-2 border border-transparent hover:border-neutral-700 hover:border hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all text-sm"
					onClick={() => navigate('/')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-4 h-4"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
					</svg>

					<p className="text-center text-sm font-bold">Back</p>
				</button>
				{profile && (
					<>
						<div className="flex w-full gap-2">
							<img
								src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
								className="rounded-md border-neutral-700 border shadow-md h-[84px] aspect-square object-cover"
							></img>
							<div className="flex flex-col gap-2 w-full">
								<input
									type="text"
									className="rounded-md text-sm focus:outline-0 focus:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10  bg-transparent flex items-center text-white gap-2 justify-start flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all"
									value={profile.first_name}
								/>
								<input
									type="text"
									className="rounded-md text-sm focus:outline-0 focus:shadow-lg focus:bg-neutral-700 focus:bg-opacity-10  bg-transparent flex  items-center text-white gap-2 justify-start flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all"
									value={profile.last_name}
								/>
							</div>
						</div>
						<button className="rounded-md flex items-center text-white gap-2 justify-center flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all">
							<p className="text-center text-sm font-bold">Save Changes</p>
						</button>
						<button className="rounded-md flex items-center text-white gap-2 justify-center flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all">
							<p className="text-center text-sm font-bold">Reset Password</p>
						</button>
						<button
							className="rounded-md flex items-center text-white gap-2 justify-center flex-1 p-2 border-neutral-700 border shadow-md hover:shadow-lg hover:bg-neutral-700 hover:bg-opacity-10 transition-all"
							onClick={handleSignOut}
						>
							<p className="text-center text-sm font-bold">Sign Out</p>
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default Account;
