from flask import *
from flask_cors import CORS # type: ignore


app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# In-memory storage for issues
issues =[]
print(issues)
# Route to fetch issues: Read: returns a static JSON object
@app.route('/api/issues', methods=['GET'])
def get_issues():
    return jsonify(issues)


# Route to Create issue: accepts a JSON object & prints/logs the object
@app.route('/api/issues', methods=['POST'])
def create_issue():
    issue = request.json
    issues.append(issue)
    print("Created new issue:", issue)
    return jsonify(issue), 201

@app.route('/api/issues/<int:issue_id>', methods=['PUT'])
def update_issue(issue_id):
    issue = request.json
    if issue_id < len(issues):
        issues[issue_id] = issue
        print("Updating issue with ID", issue_id, ":", issue)
        return jsonify(issue)
    return jsonify({"error": "Issue not found"}), 404

@app.route('/api/issues/<int:issue_id>', methods=['DELETE'])
def delete_issue(issue_id):
    if issue_id < len(issues):
        deleted_issue = issues.pop(issue_id)
        print("Deleting issue with ID", issue_id, ":", deleted_issue)
        return jsonify({"message": "Issue deleted", "issue": deleted_issue})
    return jsonify({"error": "Issue not found"}), 404




if __name__ == '__main__':
    app.run(debug=True)