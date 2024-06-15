import json
from flask import Flask, request, jsonify, make_response
import requests
from flask_cors import CORS, cross_origin  # 導入 CORS
import chromadb

DB_PATH = './DB'
chroma_client = chromadb.PersistentClient(path = DB_PATH)
collection = chroma_client.get_or_create_collection(name="Documents")

app = Flask(__name__)
# 允許所有來自 http://localhost:5173 的請求
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5173"}}, supports_credentials=True)

@app.route('/add_document', methods=['POST', 'OPTIONS'])
@cross_origin()
def add_document():
    """
    Add a document to the documents list.
    """
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or 'content' not in request.json:
        return jsonify({'error': 'missing content'}), 400

    user_content = request.json['content']
    print(f'Content: {user_content}')
    
    collection.add(documents=user_content, ids=[user_content])
    
    return jsonify({'message': 'document added'})

@app.route('/get_documents', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_documents():
    """
    Get all documents in the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    
    results = collection.get()
    print(f'Results: {results}')
    return jsonify({'documents': results['documents']})

@app.route('/update_document', methods=['POST', 'OPTIONS'])
@cross_origin()
def update_document():
    """
    Update a document in the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or 'new_content' not in request.json or 'old_content' not in request.json:
        return jsonify({'error': 'missing content'}), 400

    new_content = request.json['new_content']
    old_content = request.json['old_content']
    print(f'Old Content: {old_content}')
    print(f'New Content: {new_content}')
    
    collection.delete(ids=[old_content])
    collection.add(documents=new_content, ids=[new_content])
    
    return jsonify({'message': 'document updated'})

@app.route('/delete_document', methods=['POST', 'OPTIONS'])
@cross_origin()
def delete_document():
    """
    Delete a document from the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or 'content' not in request.json:
        return jsonify({'error': 'missing content'}), 400

    user_content = request.json['content']
    print(f'Content: {user_content}')
    
    collection.delete(ids=[user_content])
    return jsonify({'message': 'document removed'})

@app.route('/clear_documents', methods=['GET', 'OPTIONS'])
@cross_origin()
def clear_documents():
    """
    Clear all documents from the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    chroma_client.reset()
    return jsonify({'message': 'documents cleared'})

@app.route('/query_document', methods=['POST', 'OPTIONS'])
@cross_origin()
def query_document():
    """
    Query a document from the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or 'content' not in request.json:
        return jsonify({'error': 'missing content'}), 400

    user_content = request.json['content']
    print(f'Content: {user_content}')
    results = collection.query(
        query_texts=[user_content],
        n_results=2
    )
    print(f'Results: {results}')
    
    return jsonify({'results': results})

def _build_cors_preflight_response():
    """
    Builds a CORS preflight response.
    """

    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)