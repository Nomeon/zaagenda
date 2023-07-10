// /** @type {import('tailwindcss').Config} */
// export default {
//     content: ["./src/**/*.{html,js,svelte,ts}"],
//     theme: {
//         extend: {
//             keyframes: {
//                 "pulse-custom": {
//                     "0%, 100%": { opacity: 1 },
//                     "50%": { opacity: 0.2 },
//                 },
//             },
//             animation: {
//                 "pulse-custom": "pulse-custom 200ms linear infinite",
//             },
//         },
//         colors: {
//             dark1: "#0f172a",
//             light1: "#ffffff",
//             accent: "#ff4533",
//             accent2: "#075ea6",
//         },
//     },
//     plugins: [],
// };

const config = {
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
    ],

    plugins: [require("flowbite/plugin")],

    darkMode: "class",

    theme: {
        extend: {
            colors: {
                // flowbite-svelte
                primary: {
                    50: "#FFF5F2",
                    100: "#FFF1EE",
                    200: "#FFE4DE",
                    300: "#FFD5CC",
                    400: "#FFBCAD",
                    500: "#FE795D",
                    600: "#EF562F",
                    700: "#EB4F27",
                    800: "#CC4522",
                    900: "#A5371B",
                },
                dark1: "#0f172a",
                light1: "#ffffff",
                accent: "#ff4533",
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
