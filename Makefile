install:
	python -m venv venv
	venv\Scripts\python -m pip install -r requirements.txt

run:
	venv\Scripts\python -m flask run --host=0.0.0.0 --port=3000