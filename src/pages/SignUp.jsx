import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';
import useAuth from '../hooks/useAuth';
import { useRef } from 'react';

const SignUp = () => {
	const firstNameRef = useRef();
	const lastNameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();

	const { user, signUp } = useAuth({ redirectTo: '' });

	if (user) {
		return null;
	}

	async function handleSignUp(e) {
		e.preventDefault();

		const firstName = firstNameRef.current.value;
		const lastName = lastNameRef.current.value;
		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		const data = {
			email: email,
			password: password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
				},
			},
		};

		const { error } = await signUp(data);

		if (error) {
			alert(error.message);
		}
	}

	return (
		<div className="flex flex-col gap-3">
			<Logo />
			<form className="flex flex-col gap-3" onSubmit={handleSignUp}>
				<Input type="text" placeholder="First Name" ref={firstNameRef} required={true} />
				<Input type="text" placeholder="Last Name" ref={lastNameRef} required={true} />
				<Input type="email" placeholder="Email Address" ref={emailRef} required={true} />
				<Input type="password" placeholder="Password" ref={passwordRef} required={true} />
				<Button type="submit">
					<p className="text-center text-base font-bold text-white">Register</p>
				</Button>
			</form>
		</div>
	);
};

export default SignUp;
