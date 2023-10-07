const Navbar = ({ children }) => {
	return (
		<div className="flex items-center justify-between h-[72px] px-4 bg-zinc-900 shadow-md z-20">
			{children}
		</div>
	);
};

export default Navbar;
