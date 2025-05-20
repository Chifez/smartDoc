import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                jelly: {
                    "0%, 100%": { transform: "scale(1)" },
                    "25%": { transform: "scale(1.1)" },
                    "50%": { transform: "scale(1.2)" },
                    "75%": { transform: "scale(1.1)" },
                },
            },
            animation: {
                jelly: "jelly 0.6s ease-in-out",
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
};

export default config;
