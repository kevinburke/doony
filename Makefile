venv:
	virtualenv venv

install: venv
	. venv/bin/activate; pip install flask
	@echo "\n\nDone. To install in Jenkins, follow the 'Installation' instructions in README.md"

serve:
	. venv/bin/activate; python run.py

authors:
	echo "Authors\n=======\n" > AUTHORS.md
	git log --raw | grep "^Author: " | sort | uniq | cut -d ' ' -f2- | sed 's/^/- /' >> AUTHORS.md
