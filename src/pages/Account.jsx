import useUser from '../hooks/useUser';
import Page from '../layouts/Page';
import { useState } from 'react';

const Account = () => {
	const [apiKeyVisible, setApiKeyVisible] = useState(false);

	const { user, profile } = useUser();

	return (
		<Page>
			{profile && (
				<div className="flex h-full w-full max-w-[500px] flex-col items-center justify-center gap-6">
					{/* Header */}
					<div className="flex h-full w-full items-center justify-center gap-2">
						<p className="text-3xl font-bold">Account Information</p>
					</div>
					<div className="relative flex w-full flex-1 flex-col gap-4 rounded-md border border-neutral-300 bg-white p-4 font-bold shadow-sm">
						<p>Email</p>
						<input
							className="w-full rounded-md border border-neutral-300 bg-none p-2 text-center"
							type={'text'}
							value={user.email}
							disabled={true}
						/>
					</div>
					<div className="relative flex w-full flex-1 flex-col gap-4 rounded-md border border-neutral-300 bg-white p-4 font-bold shadow-sm">
						<p>API Key</p>
						<input
							className="w-full rounded-md border border-neutral-300 bg-none p-2 text-center"
							{...(apiKeyVisible ? { type: 'text' } : { type: 'password' })}
							value={profile.api_key}
							disabled={true}
						/>
						<button
							className="absolute right-4 top-4 text-neutral-300 hover:text-neutral-700"
							onClick={() => setApiKeyVisible(!apiKeyVisible)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="h-6 w-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</button>
					</div>
				</div>
			)}
		</Page>
	);
};

export default Account;
