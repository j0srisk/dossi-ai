import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

import AuthWrapper from './AuthWrapper';
import Upload from './Upload';

function App() {
	const [session, setSession] = useState(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<AuthWrapper session={session}>
			<h1>Main App</h1>
			<button onClick={() => supabase.auth.signOut()}>Sign Out</button>
			<Upload />
		</AuthWrapper>
	);
}

export default App;
