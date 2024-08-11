from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin  # 導入 CORS
import chromadb

DB_PATH = "./DB"
COLLECTION_NAME = "Documents"

chroma_client = chromadb.PersistentClient(path=DB_PATH)
collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)

app = Flask(__name__)
# 允許所有來自 http://localhost:* 的請求
CORS(
    app,
    resources={r"/*": {"origins": "http://127.0.0.1:*"}},
    supports_credentials=True,
)


@app.route("/update_collection", methods=["POST", "OPTIONS"])
@cross_origin()
def update_collection():
    """
    Update the collection.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or "content" not in request.json:
        return jsonify({"error": "missing content"}), 400

    user_content = request.json["content"]
    print(f"Content: {user_content}")

    COLLECTION_NAME = user_content
    collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)

    return jsonify({"message": "collection updated"})


@app.route("/add_document", methods=["POST", "OPTIONS"])
@cross_origin()
def add_document():
    """
    Add a document to the documents list.
    """
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or "content" not in request.json or "id" not in request.json:
        return jsonify({"error": "missing content"}), 400

    user_content = request.json["content"]
    user_id = request.json["id"]
    print(f"Content: {user_content}")

    collection.add(documents=user_content, ids=[user_id])

    return jsonify({"message": "document added"})


@app.route("/get_documents", methods=["GET", "OPTIONS"])
@cross_origin()
def get_documents():
    """
    Get all documents in the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    results = collection.get()
    print(f"Results: {results}")
    return jsonify({"documents": results["documents"], "ids": results["ids"]})


@app.route("/update_document", methods=["POST", "OPTIONS"])
@cross_origin()
def update_document():
    """
    Update a document in the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json:
        return jsonify({"error": "can't parse request"}), 400

    if "new_content" not in request.json:
        return jsonify({"error": "missing new_content"}), 400
    if "old_id" not in request.json:
        return jsonify({"error": "missing old_id"}), 400
    if "new_id" not in request.json:
        return jsonify({"error": "missing new_id"}), 400

    new_content = request.json["new_content"]
    new_content_id = request.json["new_id"]
    old_content_id = request.json["old_id"]
    print(f"Old ID: {old_content_id}")
    print(f"New Content: {new_content}, New ID: {new_content_id}")

    collection.delete(ids=[old_content_id])
    collection.add(documents=new_content, ids=[new_content_id])

    return jsonify({"message": "document updated"})


@app.route("/delete_document", methods=["POST", "OPTIONS"])
@cross_origin()
def delete_document():
    """
    Delete a document from the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or "content" not in request.json:
        return jsonify({"error": "missing content"}), 400

    user_content = request.json["content"]
    user_content_id = request.json["id"]
    print(f"Content: {user_content}, ID: {user_content_id}")

    collection.delete(ids=[user_content_id])
    return jsonify({"message": "document removed"})


############################################################
# The below APT is dangerous, it will clear all documents. #
# Please comment it out before running the server public.  #
# Not recommended to use in production.                    #
# 以下的 API 是危險的，它會清除所有文件。                        #
# 請在運行服務器之前將其註釋掉。                                #
# 不建議在生產環境中使用。                                     #
############################################################

# @app.route('/clear_documents', methods=['GET', 'OPTIONS'])
# @cross_origin()
# def clear_documents():
#     """
#     Clear all documents from the documents list.
#     """

#     if request.method == "OPTIONS":
#         return _build_cors_preflight_response()
#     chroma_client.reset()
#     return jsonify({'message': 'documents cleared'})


@app.route("/query_document", methods=["POST", "OPTIONS"])
@cross_origin()
def query_document():
    """
    Query a document from the documents list.
    """

    if request.method == "OPTIONS":
        return _build_cors_preflight_response()
    # 檢查是否有 'content'
    if not request.json or "content" not in request.json:
        return jsonify({"error": "missing content"}), 400

    n_result = 2
    if "n_result" in request.json:
        n_result = request.json["n_result"]

    user_content = request.json["content"]
    print(f"Content: {user_content}")
    results = collection.query(query_texts=[user_content], n_results=n_result)
    print(f"Results: {results}")

    return jsonify({"results": results})


def _build_cors_preflight_response():
    """
    Builds a CORS preflight response.
    """

    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response


if __name__ == "__main__":
    app.run(debug=True, port=6500)
