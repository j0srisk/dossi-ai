/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				'ar-one-sans': ["'AR One Sans'", 'sans-serif'],
				inter: ['Inter', 'sans-serif'],
				sans: ['Inter', 'sans-serif'],
			},
			colors: {
				// teal-500
				accent: '#49CC5F',
				'accent-hover': `#3FB34F`,
			},
			keyframes: {
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				grow: {
					'0%': { transform: 'scale(.95)', opacity: 0 },
					'100%': { transform: 'scale(1)', opacity: 1 },
				},
			},
			animation: {
				spin: 'spin 1.5s linear infinite',
				grow: 'grow 0.25s ease-out',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				unsplash: "url('/thom-milkovic-qGQIOLke2kE-unsplash.jpg')",
			},
		},
	},
	plugins: [],
};
