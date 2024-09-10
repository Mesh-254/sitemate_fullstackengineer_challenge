import React, { useState, useEffect } from 'react';

const IssueList = () => {
    const [issues, setIssues] = useState([]);
    const [newIssue, setNewIssue] = useState({ title: '', description: '' });
    const [editingIssueId, setEditingIssueId] = useState(null);
    const [updatedIssue, setUpdatedIssue] = useState({ title: '', description: '' });

    // Fetch all issues
    const fetchIssues = async () => {
        const response = await fetch('http://localhost:5000/api/issues');
        const data = await response.json();
        setIssues(data);
    };

    // Create a new issue, with validation for non-empty fields
    const createIssue = async () => {
        if (!newIssue.title.trim() || !newIssue.description.trim()) {
            alert('Title and Description cannot be empty.');
            return;
        }
        const response = await fetch('http://localhost:5000/api/issues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newIssue),
        });
        const data = await response.json();
        setIssues([...issues, data]);
        setNewIssue({ title: '', description: '' }); // Clear input fields after creation
    };

    // Update an existing issue, with validation for non-empty fields
    const updateIssue = async (id) => {
        if (!updatedIssue.title.trim() || !updatedIssue.description.trim()) {
            alert('Title and Description cannot be empty.');
            return;
        }
        const response = await fetch(`http://localhost:5000/api/issues/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedIssue),
        });
        if (response.ok) {
            const updatedIssues = issues.map((issue, index) =>
                index === id ? updatedIssue : issue
            );
            setIssues(updatedIssues);
            setEditingIssueId(null);
        }
    };

    // Delete an issue
    const deleteIssue = async (id) => {
        const response = await fetch(`http://localhost:5000/api/issues/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setIssues(issues.filter((_, index) => index !== id));
        }
    };

    // Fetch issues when component mounts
    useEffect(() => {
        fetchIssues();
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Issue Tracker</h1>
            <div className="mb-6 flex flex-col space-y-4">
                <input
                    className="p-2 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Title"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                />
                <input
                    className="p-2 border border-gray-300 rounded-md"
                    type="text"
                    placeholder="Description"
                    value={newIssue.description}
                    onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                />
                <div className="flex space-x-4">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={createIssue}
                    >
                        Create Issue
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        onClick={fetchIssues}
                    >
                        Fetch All Issues
                    </button>
                </div>
            </div>
            <ol className="list-decimal space-y-4">
                {issues.map((issue, index) => (
                    <li key={index} className="flex justify-between items-start">
                        <div className="text-lg">
                            {editingIssueId === index ? (
                                <>
                                    <input
                                        className="p-2 border border-gray-300 rounded-md"
                                        type="text"
                                        placeholder="Title"
                                        value={updatedIssue.title}
                                        onChange={(e) => setUpdatedIssue({ ...updatedIssue, title: e.target.value })}
                                    />
                                    <input
                                        className="p-2 border border-gray-300 rounded-md mt-2"
                                        type="text"
                                        placeholder="Description"
                                        value={updatedIssue.description}
                                        onChange={(e) => setUpdatedIssue({ ...updatedIssue, description: e.target.value })}
                                    />
                                    <button
                                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 mt-2"
                                        onClick={() => updateIssue(index)}
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="font-bold">Title:</h3>{issue.title}
                                    <h3 className="font-bold mt-2">Description:</h3>{issue.description}
                                </>
                            )}
                        </div>
                        <div className="space-x-2">
                            <button
                                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                                onClick={() => {
                                    setEditingIssueId(index);
                                    setUpdatedIssue(issue);
                                }}
                            >
                                Update
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                onClick={() => deleteIssue(index)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default IssueList;
