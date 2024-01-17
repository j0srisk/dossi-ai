import Image from 'next/image';

export default function Card({ src, alt, title, description }) {
	return (
		<div className="flex h-full w-full flex-1 flex-grow flex-col items-center justify-start gap-4 rounded-xl bg-neutral-100 p-4">
			<Image
				src={src}
				width={500}
				height={500}
				className="rounded-lg border border-neutral-300 shadow-sm"
				alt={alt}
			/>
			<h3 className="text-center text-2xl font-semibold">{title}</h3>
			<p className="text-center text-base text-neutral-500">{description}</p>
		</div>
	);
}
