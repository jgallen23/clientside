test:
	@./node_modules/.bin/mocha

coverage: 
	@./node_modules/.bin/cover run node_modules/mocha/bin/_mocha;cover report

watch:
	@nodemon ./node_modules/.bin/mocha

build-fixtures:
	@./bin/clientside --export fixture test/fixtures/c.js > test/fixtures/out.js

.PHONY: coverage test watch build-fixtures
