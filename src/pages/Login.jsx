import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

const Login = () => {
	const emailRef = useRef();
	const passwordRef = useRef();

	const { user } = useAuth();
	const { logIn } = useAuth();

	const navigate = useNavigate();

	async function handleLogIn(e) {
		e.preventDefault();

		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		const { error } = await logIn({ email, password });

		if (error) {
			alert(error.message);
		} else {
			navigate('/dashboard');
		}
	}

	useEffect(() => {
		if (user) {
			navigate('/dashboard');
		}
	}, [user]);

	return (
		<div className="">
			<div className="">
				<h1 className="">Supabase + React</h1>
				<p className="">Sign in via your email & password below</p>
				<form className="" onSubmit={handleLogIn}>
					<div>
						<input
							className=""
							type="email"
							placeholder="Your email"
							ref={emailRef}
							required={true}
						/>
					</div>
					<div>
						<input
							className=""
							type="password"
							placeholder="Your Password"
							ref={passwordRef}
							required={true}
						/>
					</div>
					<div>
						<button type="submit">Sign In</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
