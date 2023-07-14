const config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    plugins: [],
    theme: {
        extend: {
            colors: {
                dark1: "#0f172a",
                light1: "#ffffff",
                accent: "#00FFFF",
                accent2: "#075ea6",
            },
            keyframes: {
                "pulse-custom": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.2 },
                },
            },
            animation: {
                "pulse-custom": "pulse-custom 200ms linear infinite",
            },
        },
    },
};
module.exports = config;