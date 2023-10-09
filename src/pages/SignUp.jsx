import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';
import useAuth from '../hooks/useAuth';
import { useRef, useState } from 'react';

const SignUp = () => {
	const [emailSignUp, setEmailSignUp] = useState(false);
	const emailRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();

	const { user, signUp, logInWithProvider } = useAuth({ redirectTo: '' });

	if (user) {
		return null;
	}

	async function handleSignUp(e) {
		e.preventDefault();

		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		const confirmPassword = confirmPasswordRef.current.value;

		if (password !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}

		const data = {
			email: email,
			password: password,
		};

		const { error } = await signUp(data);

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
		<div className="flex flex-col gap-3">
			<Logo />
			<form className="flex flex-col gap-3" onSubmit={handleSignUp}>
				<Input type="email" placeholder="Email Address" ref={emailRef} required={true} />
				<Input type="password" placeholder="Password" ref={passwordRef} required={true} />
				<Input
					type="password"
					placeholder="Confirm Password"
					ref={confirmPasswordRef}
					required={true}
				/>
				<Button type="submit">
					<p className="text-center text-base font-bold text-white">Sign Up with Email</p>
				</Button>
			</form>
			<p className="text-center text-base italic text-neutral-300"> or </p>
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
				<p className="text-center text-base font-bold text-white">Sign Up with Google</p>
			</Button>
		</div>
	);
};

export default SignUp;
