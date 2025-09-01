/** @type {import('postcss').Processor} */
const processor = {
  plugins: {
    "@tailwindcss/postcss": {},
    "@tailwindcss/line-clamp": {},
  },
};

export default processor;
