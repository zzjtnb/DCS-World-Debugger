// npm install tailwindcss postcss-cli postcss @fullhuman/postcss-purgecss
const purgecss = require('@fullhuman/postcss-purgecss');
module.exports = {
  plugins: [
    require('tailwindcss'),

    purgecss({
      content: ['./views/**/*.ejs'],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ],
};
