test:
	@./node_modules/.bin/mocha

coverage: 
	@./node_modules/.bin/cover run node_modules/mocha/bin/_mocha;cover report

watch:
	@nodemon ./node_modules/.bin/mocha

build-fixtures:
	@./bin/clientside --export fixture test/fixtures/c.js > test/fixtures/out.js

preview-docs:
	@./node_modules/.bin/markx --lang javascript --preview 8001 docs/index.md 

preview-readme:
	@./node_modules/.bin/markx --preview 8001 README.md 

.PHONY: coverage test watch build-fixtures preview-docs preview-readme
