require('react');

// the problem with requiring css - If you try to modify either index.js or main.css, 
// he hash of both files (app.js and app.css) will change! This is because they belong 
// to the same entry chunk due to that require('./main.css'). The problem can be avoided 
// by separating chunks further.
// var styles = require('./main.css');

var component = require('./component')();

// Using css?modules
// NOTE: this won't work if you are extracting the css from the javascript file
component.className = styles.greenHeader;

document.body.appendChild(component);

// testing for hash change
console.log('THE HASH CHANGES ONLY FOR app.js AND manifest.js NOT FOR vendor.js');