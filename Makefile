clean:
	rm -rf venv node_modules

venv:
	virtualenv venv

install: venv
	. venv/bin/activate; pip install flask
	npm install .
	@echo "\033[95m\n\nDone. To install in Jenkins, follow the 'Installation' instructions in README.md\033[0m"

serve:
	. venv/bin/activate; python run.py

authors:
	echo "Authors\n=======\n" > AUTHORS.md
	git log --raw | grep "^Author: " | sort | uniq | cut -d ' ' -f2- | sed 's/^/- /' >> AUTHORS.md

watch:
	$(PWD)/node_modules/grunt-cli/bin/grunt watch && $(PWD)/node_modules/grunt-cli/bin/grunt uglify

sass:
	scss --style expanded src/doony.scss > doony.css
	scss --style compressed src/doony.scss > doony.min.css

minify:
	$(PWD)/node_modules/grunt-cli/bin/grunt uglify
