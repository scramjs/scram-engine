#!/usr/bin/env node

require = require('esm')(module);

require('basichtml').init({});

const innerHTML = require(require('path').join(process.cwd(), `./${process.argv[2]}`)).default;

window.document.documentElement.innerHTML = `
    <body>
        ${innerHTML}
    </body>
`;

console.log(window.document.body.innerHTML);
