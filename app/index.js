require('react');

var styles = require('./main.css');

var component = require('./component')();

// Using css?modules
component.className = styles.greenHeader;

document.body.appendChild(component);