/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				// Mapeo de tokens semánticos definidos en Themes.css
				// El formato hsl(var(...) / <alpha-value>) permite usar opacidad: ej. bg-primary/50
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)",
				},
				// Paleta "Nature" (Tokens Primitivos de Global.css)
				nature: {
					100: "hsl(var(--color-moss-100) / <alpha-value>)",
					300: "hsl(var(--color-moss-300) / <alpha-value>)",
					500: "hsl(var(--color-moss-500) / <alpha-value>)",
					600: "hsl(var(--color-moss-600) / <alpha-value>)", // Alias para coherencia con AboutUs
					700: "hsl(var(--color-moss-700) / <alpha-value>)",
					800: "hsl(var(--color-moss-800) / <alpha-value>)",
					900: "hsl(var(--color-dark-900) / <alpha-value>)",
				},
				// Paleta "Earth" (Tokens Primitivos de Global.css)
				earth: {
					100: "hsl(var(--color-earth-100) / <alpha-value>)",
					200: "hsl(var(--color-earth-200) / <alpha-value>)",
					300: "hsl(var(--color-earth-300) / <alpha-value>)",
					500: "hsl(var(--color-earth-500) / <alpha-value>)",
					700: "hsl(var(--color-earth-700) / <alpha-value>)",
					900: "hsl(var(--color-earth-900) / <alpha-value>)",
				},
			},
			borderRadius: {
				lg: "var(--radius-lg)",
				md: "var(--radius-md)",
				sm: "var(--radius-sm)",
			},
			fontFamily: {
				sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
			},
			boxShadow: {
				soft: "var(--shadow-sm)",
				premium: "var(--shadow-card)",
			},
			height: {
				navbar: "var(--navbar-height)",
			},
		},
	},
	plugins: [],
};
