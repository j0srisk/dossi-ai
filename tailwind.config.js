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
				'grow-in': {
					'0%': { transform: 'scale(.95)' },
					'100%': { transform: 'scale(1)' },
				},
				'grow-in-sm': {
					'0%': { transform: 'scale(.99)' },
					'100%': { transform: 'scale(1)' },
				},
				'fade-in': {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
			},
			animation: {
				spin: 'spin 1.5s linear infinite',
				'grow-in': 'grow-in 0.25s ease-out',
				'grow-in-sm': 'grow-in-sm 0.1s ease-out',
				'fade-in': 'fade-in 0.25s ease-out',
				'grow-fade-in': 'grow-in 0.25s ease-out, fade-in 0.25s ease-out',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				unsplash: "url('/thom-milkovic-qGQIOLke2kE-unsplash.jpg')",
				topo: 'url("/topography.svg")',
				wiggle: 'url("/wiggle.svg")',
				'line-in-motion': 'url("/line-in-motion.svg")',
			},
		},
	},
	plugins: [],
};
