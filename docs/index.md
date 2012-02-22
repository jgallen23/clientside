#ClientSide

Clientside is a tool for converting a node.js library (CommonJS) into a library that is compatible in the browser.  It will parse your library, find all its dependencies, wrap all files in a closure, concatinate them and replace all require() calls with variable references.

*Note this is still an early release, so it might not work in every case.  If you run into an issue, please add it [here](https://github.com/jgallen23/clientside/issues).*

##Installation

Install via npm

	npm install -g clientside

##Usage

	Usage: clientside [file]

	Options:

		-h, --help           output usage information
		-V, --version        output the version number
		-e, --export <name>  Module Name
		-v, --verify         Verifies your code in a sandbox
		-s, --stats          Displays file size stats of all files

	Examples:
	Pass in params
		$ clientside --export module index.js > dist/module.js
	Read from package.json
		$ clientside > dist/module.js

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
As you can see in the output, a.js got wrapped in a closure and set to cs1 and index.js's require('./a') call got replaced by cs1.  The entire file also got wrapped in a closure, set to the export name that was passed in, which is set to the output from the main file (index.js).

	var ClassB = (function(exports) {
		var cs1 = (function(exports) {
			var ClassA = function() {
				console.log('ClassA init');
			}

			exports = ClassA;

			return exports;
		})({});
		var cs0 = (function(exports) {
			var ClassA = cs1;

			var ClassB = function() {
				this.a = new ClassA();
				console.log('ClassB init');
			};

			exports = ClassB;

			return exports;
		})({});
		return cs0;
	})({});

##Package.json Integration
ClientSide will read your package.json if no arguments are passed in.

	{
		"name": "SomeAwesomePackage",
		"main": "index.js",
		"clientside": {
			"shim": {
				"http": "ajax.js"
			}
		}
	}

You can also add a clientside object to your package.json.  This is handy if, for example, your library makes some http requests using the http module.  In the clientside object, you can define a shim that will replace the http object with another file (in this case, replace http client with one that uses XMLHttpRequest).

###a.js

	var http = require('http');

	var ClassA = function() {
		console.log('ClassA init');
	};

	module.exports = ClassA;

###index.js


	var ClassA = require('./a');

	var ClassB = function() {
		this.a = new ClassA();
		console.log('ClassB init');
	};

	module.exports = ClassB;

###ajax.js

	module.exports = function() {
		console.log("this will make ajax calls");
	};

###Output

	var SomeAwesomePackage = (function(exports) {
		var cs0 = (function(exports) {
			exports = function() {
				console.log("this will make ajax calls");
			};

			return exports;
		})({});
		var cs2 = (function(exports) {
			var http = cs0;

			var ClassA = function() {
				console.log('ClassA init');
			};

			exports = ClassA;

			return exports;
		})({});
		var cs1 = (function(exports) {
			var ClassA = cs2;

			var ClassB = function() {
				this.a = new ClassA();
				console.log('ClassB init');
			};

			exports = ClassB;

			return exports;
		})({});
		return cs1;
	})({});

##Future

View [TODO](https://raw.github.com/jgallen23/clientside/master/docs/TODO)

##Authors
- Greg Allen ([@jgaui](http://twitter.com/jgaui)) [jga.me](http://jga.me)
