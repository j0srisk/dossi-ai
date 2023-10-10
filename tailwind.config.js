/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
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
			},
			keyframes: {
				spin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				spin: 'spin 1.5s linear infinite',
			},
			backgroundImage: {
				splash: "url('/src/assets/thom-milkovic-qGQIOLke2kE-unsplash.jpg')",
			},
		},
	},
	plugins: [],
};
