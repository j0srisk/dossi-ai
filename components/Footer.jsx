export default function Footer() {
	return (
		<footer className="w-full px-4">
			<div className="mx-auto w-full max-w-screen-xl border-t border-neutral-300 py-8">
				<div className="flex w-full justify-between">
					<span>
						&copy; 2023 <a href="https://github.com/j0srisk">Joseph Risk</a>. All rights reserved.
					</span>
					<div className="flex gap-4">
						<a href="/terms" className="hover:text-primary-500 text-neutral-500">
							Terms of Service
						</a>
						<a href="/privacy" className="hover:text-primary-500 text-neutral-500">
							Privacy Policy
						</a>
						<a href="/contact" className="hover:text-primary-500 text-neutral-500">
							Contact Us
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
