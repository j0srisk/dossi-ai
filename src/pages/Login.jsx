import useAuth from '../hooks/useAuth';
import { useRef } from 'react';

const Login = () => {
	const emailRef = useRef();
	const passwordRef = useRef();

	const { user, logIn } = useAuth({ redirectTo: 'auth/login' });

	if (user) {
		return null;
	}

	async function handleLogIn(e) {
		e.preventDefault();

		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		const { error } = await logIn({ email, password });

		if (error) {
			alert(error.message);
		}
	}

	return (
		<div className="m-40 w-96">
			<div className="flex flex-col gap-3 ">
				<h1 className="text-center text-xl font-bold text-white">Welcome Back</h1>
				<form className="flex flex-col gap-3" onSubmit={handleLogIn}>
					<div>
						<input
							className="focus:border-1 w-full rounded-md border border-white bg-transparent p-3 text-neutral-300 placeholder-neutral-300 focus:border-white focus:outline-none"
							type="email"
							placeholder="Email Address"
							ref={emailRef}
							required={true}
						/>
					</div>
					<div>
						<input
							className="focus:border-1 w-full rounded-md border border-white bg-transparent p-3 text-neutral-300 placeholder-neutral-300 focus:border-white focus:outline-none"
							type="password"
							placeholder="Password"
							ref={passwordRef}
							required={true}
						/>
					</div>
					<div>
						<button
							className="w-full flex-1 rounded-md bg-blue-500 p-3 hover:bg-blue-600 hover:bg-opacity-90  hover:shadow-md"
							type="submit"
						>
							<p className="text-center text-base font-bold text-white"> Log In </p>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
