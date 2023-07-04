// import { join } from 'path'
// import forms from '@tailwindcss/forms'
// import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     darkMode: "class",
//     content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
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
//     plugins: [forms,...skeleton()],
// }

import { join } from 'path'
import forms from '@tailwindcss/forms'
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
            keyframes: {
                "pulse-custom": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.2 },
                },
            },
            animation: {
                "pulse-custom": "pulse-custom 200ms linear infinite",
            }
        }
	},
	plugins: [forms,...skeleton()],
}
