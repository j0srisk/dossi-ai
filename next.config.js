/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.resolve.alias.canvas = false;
		return config;
	},
	typescript: {
		// didn't use typescript in this project
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
