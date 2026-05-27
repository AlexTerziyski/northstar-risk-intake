import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "severity-critical": "#dc2626",
                "severity-high": "#ea580c",
                "severity-medium": "#f59e0b",
                "severity-low": "#16a34a",
            },
        },
    },
    plugins: [],
}

export default config