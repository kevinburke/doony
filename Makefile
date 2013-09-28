venv:
	virtualenv venv

install: venv
	. venv/bin/activate; pip install flask
	@echo "\n\nDone. To install in Jenkins, follow the 'Installation' instructions in README.md"

serve:
	. venv/bin/activate; python run.py
