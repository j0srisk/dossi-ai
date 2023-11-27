import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default async function LandingPage() {
	return (
		<div className="flex w-screen flex-col gap-24">
			<Navbar />
			<section className="relative w-full bg-gradient-to-t from-zinc-50 from-15% to-transparent px-4">
				<div className="mx-auto w-full max-w-screen-lg">
					<div className="flex w-full flex-col items-center justify-center gap-8">
						<div className="flex gap-1 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs shadow-sm">
							Discover Dossi AI
						</div>
						<div className="flex max-w-screen-md flex-col items-center justify-center gap-4">
							<div className="text-center text-6xl font-semibold">
								<h1>
									Open source{' '}
									<span className="bg-gradient-to-br from-[#49CC5F] from-40% to-[#a3e635] bg-clip-text text-transparent">
										Next.js
									</span>{' '}
									powered AI chat tool for PDFs
								</h1>
							</div>
							<p className="text-center text-xl text-neutral-500">
								Like ChatGPT for all of your personal documents
							</p>
							<div className="flex items-center justify-center gap-2 font-bold">
								<Link
									href="/demo"
									className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm shadow-sm"
								>
									Live Demo
								</Link>
								<Link
									href="/collections"
									className="flex items-center gap-1 rounded-lg border border-accent bg-accent px-4 py-2 text-sm text-white shadow-sm transition-all duration-300 ease-in-out hover:border-accent-hover hover:bg-accent-hover"
								>
									Get Started
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="h-4 w-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
										/>
									</svg>
								</Link>
							</div>
						</div>

						<Image
							src="/chatdashboard.png"
							width={1000}
							height={1000}
							className="mt-4 w-full rounded-lg border border-neutral-300 shadow-sm"
							alt="Chat Dashboard"
						/>
					</div>
				</div>
				<div className="absolute -top-24 -z-10 h-full w-full bg-topo bg-repeat" />
			</section>
			<section className="w-full px-4">
				<div className="mx-auto w-full max-w-screen-lg">
					<div className="flex w-full flex-col items-center justify-center gap-8">
						<div className="flex flex-col items-center justify-center gap-2">
							<div className="flex gap-1 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs shadow-sm">
								Features
							</div>
							<h2 className="text-center text-4xl font-semibold">
								Fundamentally different than other PDF chat tools
							</h2>
						</div>
						<div className="flex flex-col items-start justify-center gap-8 md:flex-row">
							<div className="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-xl bg-neutral-100 p-4">
								<Image
									src="/collections.png"
									width={500}
									height={500}
									className="rounded-lg border border-neutral-300 shadow-sm"
									alt="collections"
								/>
								<h3 className="text-center text-2xl font-semibold">Multiple Documents</h3>
								<p className="text-center text-base text-neutral-500">
									Not sure where the answer lies? The collections system allows you to chat with
									multiple documents at once
								</p>
							</div>
							<div className="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-xl bg-neutral-100 p-4">
								<Image
									src="/references.png"
									width={500}
									height={500}
									className="rounded-lg border border-neutral-300 shadow-sm"
									alt="collections"
								/>
								<h3 className="text-center text-2xl font-semibold">References Included</h3>
								<p className="text-center text-base text-neutral-500">
									Reference documents and chat with multiple documents at once
								</p>
							</div>
						</div>
						<div className="flex flex-col items-start justify-center gap-8 md:flex-row">
							<div className="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-xl bg-neutral-100 p-4">
								<Image
									src="/references.png"
									width={500}
									height={500}
									className="rounded-lg border border-neutral-300 shadow-sm"
									alt="collections"
								/>
								<h3 className="text-center text-2xl font-semibold">Deploy with Docker</h3>
								<p className="text-center text-base text-neutral-500">
									Deploy with Docker and Docker Compose for easy deployment and scaling
								</p>
							</div>
							<div className="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-xl bg-neutral-100 p-4">
								<Image
									src="/secure.png"
									width={500}
									height={500}
									className="rounded-lg border border-neutral-300 shadow-sm"
									alt="collections"
								/>
								<h3 className="text-center text-2xl font-semibold">NextAuth Integration</h3>
								<p className="text-center text-base text-neutral-500">
									Uses NextAuth for authentication and authorization to secure your documents and
									support multiple users
								</p>
							</div>
							<div className="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-xl bg-neutral-100 p-4">
								<Image
									src="/secure.png"
									width={500}
									height={500}
									className="rounded-lg border border-neutral-300 shadow-sm"
									alt="collections"
								/>
								<h3 className="text-center text-2xl font-semibold">PostgreSQL Based</h3>
								<p className="text-center text-base text-neutral-500">
									Uses only one database for authentication, document metadata, and chat history for
									easy deployment
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="w-full px-4">
				<div className="mx-auto w-full max-w-screen-md">
					<div className="flex w-full flex-col items-center justify-center gap-8">
						<div className="flex flex-col items-center justify-center gap-2">
							<div className="flex gap-1 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs shadow-sm">
								FAQ
							</div>
							<h2 className="text-center text-4xl font-semibold">
								Here are some questions we get a lot
							</h2>
						</div>
						<Faq />
					</div>
				</div>
			</section>
			<section className="w-full px-4">
				<div className="mx-auto w-full max-w-screen-lg">
					<div className="flex w-full flex-col items-center justify-center gap-8">
						<div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-neutral-100 p-8">
							<h2 className="flex items-start gap-2 text-center text-4xl font-semibold">
								Try Dossi
								<div className="group relative mt-1 flex h-6 rounded-md bg-neutral-900 from-[#49CC5F] from-10% to-[#a3e635] p-0.5">
									<div className="flex h-full w-full items-center justify-center rounded-[4px] border-neutral-700 bg-neutral-100 px-2 text-sm font-bold">
										AI
									</div>
								</div>
								for free today
							</h2>
							<p className="text-center text-base text-neutral-500"> No credit card required</p>
							<div className="flex items-center justify-center gap-2 font-bold">
								<Link
									href="/demo"
									className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm shadow-sm"
								>
									Live Demo
								</Link>
								<Link
									href="/collections"
									className="flex items-center gap-1 rounded-lg border border-accent bg-accent px-4 py-2 text-sm text-white shadow-sm transition-all duration-300 ease-in-out hover:border-accent-hover hover:bg-accent-hover"
								>
									Get Started
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="h-4 w-4"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
										/>
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
}
