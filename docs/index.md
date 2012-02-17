#ClientSide

Clientside is a tool for converting a node.js library (CommonJS) into a library that is compatible in the browser.

*Note this is still an early release, so it might not work in every case.  If you run into an issue, please add it [here]().*

##Installation

Install via npm

	npm install -g clientside

##Usage

	Usage: clientside -e <name> [file]

	Options:

	-h, --help           output usage information
	-V, --version        output the version number
	-e, --export <name>  Module Name

	Examples:

	$ clientside --export module index.js > dist/module.js

##Examples

###index.js

	var ClassA = require('./a');

	var ClassB = function() {
		this.a = new ClassA();
		console.log('ClassB init');
	};

	module.exports = ClassB;

###a.js

	var ClassA = function() {
		console.log('ClassA init');
	}

	module.exports = ClassA;

###Command

	clientside --export ClassB index.js

###Output

	var ClassB = (function(exports) {
		var cs1 = (function(exports) {
			var ClassA = function() {
					console.log('ClassA init');
			}

			exports = ClassA;

			return exports;
		})({});
		var ClassA = cs1;

		var ClassB = function() {
				this.a = new ClassA();
					console.log('ClassB init');
		};

		exports = ClassB;

		return exports;
	})({});

##Future

View [TODO](https://raw.github.com/jgallen23/clientside/master/docs/TODO)

##Authors
- Greg Allen ([@jgaui](http://twitter.com/jgaui)) [jga.me](http://jga.me)
