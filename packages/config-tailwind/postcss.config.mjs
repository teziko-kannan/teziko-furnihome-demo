/** Shared PostCSS config. Tailwind v4 bundles vendor prefixing (Lightning CSS), so autoprefixer is not needed. */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
