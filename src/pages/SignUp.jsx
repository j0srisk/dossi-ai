import useAuth from '../hooks/useAuth';
import { supabase } from '../services/supabase';
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
		<div className="m-40 w-96">
			<div className="flex flex-col gap-3 ">
				<h1 className="text-center text-xl font-bold text-white">SignUp</h1>
				<form className="flex flex-col gap-3" onSubmit={handleSignUp}>
					<div>
						<input
							className="focus:border-1 w-full rounded-md border border-white bg-transparent p-3 text-neutral-300 placeholder-neutral-300 focus:border-white focus:outline-none"
							type="text"
							placeholder="First Name"
							ref={firstNameRef}
							required={true}
						/>
					</div>
					<div>
						<input
							className="focus:border-1 w-full rounded-md border border-white bg-transparent p-3 text-neutral-300 placeholder-neutral-300 focus:border-white focus:outline-none"
							type="text"
							placeholder="Last Name"
							ref={lastNameRef}
							required={true}
						/>
					</div>
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
							<p className="text-center text-base font-bold text-white"> Sign Up </p>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
