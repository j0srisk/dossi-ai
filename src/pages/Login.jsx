import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';
import useAuth from '../hooks/useAuth';
import { useRef } from 'react';

const Login = () => {
	const emailRef = useRef();
	const passwordRef = useRef();

	const { user, logIn } = useAuth({ redirectTo: '' });

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
		<div className="flex flex-col gap-3 ">
			<Logo />
			<form className="flex flex-col gap-3" onSubmit={handleLogIn}>
				<Input type="text" placeholder="Email" ref={emailRef} required={true} />
				<Input type="password" placeholder="Password" ref={passwordRef} required={true} />
				<Button type="submit">
					<p className="text-center text-base font-bold text-white"> Log In </p>{' '}
				</Button>
			</form>
		</div>
	);
};

export default Login;
