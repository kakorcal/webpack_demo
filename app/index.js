require('react');

var styles = require('./main.css');

var component = require('./component')();

// Using css?modules
component.className = styles.greenHeader;

document.body.appendChild(component);

// testing hash change
console.log('HASH CHANGES ONLY FOR app.js AND manifest.js NOT FOR vendor.js');