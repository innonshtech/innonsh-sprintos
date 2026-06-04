const fs = require('fs');
const HTMLtoJSX = require('htmltojsx');

const html = fs.readFileSync('sprintos v2.html', 'utf8');
const converter = new HTMLtoJSX({
  createClass: false,
});

const jsx = converter.convert(html);

// We need to wrap it into a React functional component
const component = `import React from 'react';

export default function LandingPage() {
  return (
    <>
      ${jsx}
    </>
  );
}
`;

fs.writeFileSync('src/pages/LandingPage2.tsx', component);
console.log('Done!');
