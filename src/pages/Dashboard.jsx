import useRequireAuth from '../hooks/useRequireAuth';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
	const user = useRequireAuth();
	const { signOut } = useAuth();

	if (!user) {
		return null;
	}

	async function handleSignOut() {
		const { error } = await signOut();
		if (error) {
			alert(error.message);
		} else {
			console.log('success');
		}
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome, {user.email}</p>
			<button onClick={handleSignOut}>Sign Out</button>
		</div>
	);
};

export default Dashboard;
