import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';
import useAuth from '../hooks/useAuth';
import { useRef, useState } from 'react';

const Login = () => {
	const [emailSignIn, setEmailSignIn] = useState(false);

	const emailRef = useRef();
	const passwordRef = useRef();

	const { user, logIn, logInWithProvider } = useAuth({ redirectTo: '' });

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

	async function handleLogInWithGoogle(e) {
		e.preventDefault();

		const { error } = await logInWithProvider('google');

		if (error) {
			alert(error.message);
		}
	}

	return (
		<div className="flex flex-col gap-3 ">
			<Logo />
			{emailSignIn ? (
				<>
					<form className="flex flex-col gap-3" onSubmit={handleLogIn}>
						<Input type="text" placeholder="Email" ref={emailRef} required={true} />
						<Input type="password" placeholder="Password" ref={passwordRef} required={true} />
						<Button type="submit">
							<p className="text-center text-base font-bold text-white">Log In</p>
						</Button>
					</form>
					<p className="text-center text-base italic text-neutral-300"> or </p>
				</>
			) : (
				<>
					<Button onClick={() => setEmailSignIn(true)}>
						<p className="text-center text-base font-bold text-white">Log In with Email</p>
					</Button>
				</>
			)}

			<Button onClick={handleLogInWithGoogle}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					role="img"
					className="w-5 h-5 stroke-white"
					preserveAspectRatio="xMidYMid meet"
					viewBox="0 0 32 32"
				>
					<path
						fill="currentColor"
						d="M27.39 13.82H16.21v4.63h6.44c-.6 2.95-3.11 4.64-6.44 4.64a7.09 7.09 0 0 1 0-14.18a7 7 0 0 1 4.42 1.58L24.12 7a12 12 0 1 0-7.91 21c6 0 11.45-4.36 11.45-12a9.56 9.56 0 0 0-.27-2.18Z"
					/>
				</svg>
				<p className="text-center text-base font-bold text-white">Log In with Google</p>
			</Button>
		</div>
	);
};

export default Login;
