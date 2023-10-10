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
			<p className="text-center text-sm italic text-neutral-300"> or </p>
			<Button onClick={handleLogInWithGoogle}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
					<path d="M1 1h22v22H1z" fill="none" />
				</svg>
				<p className="text-center text-base font-bold text-white">Sign Up with Google</p>
			</Button>
		</div>
	);
};

export default SignUp;
