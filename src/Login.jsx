import { useState } from 'react';
import { supabase } from './supabaseClient';

const Login = () => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async (event) => {
		event.preventDefault();

		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			alert(error.message);
		} else {
			console.log('success');
		}
		setLoading(false);
	};

	return (
		<div className="">
			<div className="">
				<h1 className="">Supabase + React</h1>
				<p className="">Sign in via your email & password below</p>
				<form className="" onSubmit={handleLogin}>
					<div>
						<input
							className=""
							type="email"
							placeholder="Your email"
							value={email}
							required={true}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<input
							className=""
							type="password"
							placeholder="Your Password"
							value={password}
							required={true}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div>
						<button className="" disabled={loading}>
							{loading ? <span>Loading</span> : <span>Sign In</span>}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
