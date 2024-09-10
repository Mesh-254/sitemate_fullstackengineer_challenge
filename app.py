from flask import *
from flask_cors import CORS # type: ignore


app = Flask(__name__)

CORS(app)


sample_object ={
    "id": 1,
    "title": "Sample Object",
    "description": "This is a sample object for testing."
}


@app.route('/api/issues', methods=['POST'])
def create_issue():
    issue = request.json
    print("Received new issue:", issue)
    return jsonify(issue), 201


# Route to display the sample object
@app.route('/sample-object', methods=['GET'])
def get_sample_object():
    return jsonify(sample_object)

if __name__ == '__main__':
    app.run(debug=True)