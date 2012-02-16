#Middleware
	
	var l = new Library(file);
	l.use(middelware.combine());
	l.use(middelware.compress());
	l.use(middelware.write({ file: 'blah.js' ));
