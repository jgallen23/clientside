#File

- should file know it's dependencies?

##Idea1
- sync events
- pros
- cons
	- file has to know that it should trigger require and module.exports

	var f = new File(filename);
	f.on('require', function(req, line) {
		//get file
		//add dep
	this.replace(line, newLine);
	});

	f.on('module.exports', function(req, line) {
	});

	File.prototype.parse = function() {
		var m = f.source.match(/require/)
		for m
			var line = self.trigger('require', blah, blah);
		});
	});

##Idea2
- pros
- cons

	var f = new File(filename);

	f.find(/require(.(.*?).)/, function(val, match) {
		return newLine
	});


##Idea3
- Stremreader
- make it easier when burrito/esprima gets working

#Library

	library(name)
		.shim('fs', 'lib/browser/fs.js')
		.shim({
			'fs': ''
		});
		.main('index.js')
		.use(middleware.lint());
		.use(middleware.compile());
		.build(function(err, out) {

		})

