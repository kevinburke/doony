# Because Jenkins is stupid
from flask import Flask
app = Flask(__name__, static_folder='', static_url_path='')

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run(port=8089, debug=True)
