import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const Page = ({ children }) => {
	return (
		<div className="flex min-h-screen w-screen flex-col bg-neutral-100 text-zinc-900">
			<Navbar />
			<div className="flex h-full w-full flex-col items-center p-8">
				<div className="flex h-full w-full max-w-screen-lg flex-col items-center gap-8">
					<Outlet />
					{children}
				</div>
			</div>
		</div>
	);
};

export default Page;
