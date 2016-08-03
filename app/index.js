require('react');

var styles = require('./main.css');

var component = require('./component')();

// Using css?modules
component.className = styles.greenHeader;

document.body.appendChild(component);

// testing for hash change
console.log('THE HASH CHANGES ONLY FOR app.js AND manifest.js NOT FOR vendor.js');