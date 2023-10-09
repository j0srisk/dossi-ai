import { supabase } from '../services/supabase';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const value = {
		signUp: (data) => supabase.auth.signUp(data),
		logIn: (data) => supabase.auth.signInWithPassword(data),
		logInWithProvider: (provider) => supabase.auth.signInWithOAuth({ provider }),
		signOut: () => supabase.auth.signOut(),
		user,
		session,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
