"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";

interface Document {
	id: string;
	content: string;
}

const LOCAL_SERVER = "http://127.0.0.1:6500";

export default function DocumentManager() {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [textId, setTextId] = useState("");
	const [text, setText] = useState("");
	const [filter, setFilter] = useState("");
	const [editText, setEditText] = useState("");
	const [editId, setEditId] = useState<string | null>(null);
	const [newEditId, setNewEditId] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchDocuments();
	}, []);

	const fetchDocuments = async () => {
		try {
			const response = await fetch(LOCAL_SERVER + "/get_documents");
			if (response.ok) {
				const data = await response.json();
				const combinedData = data.documents.map(
					(content: string, index: number) => ({
						content,
						id: data.ids[index],
					})
				);
				setDocuments(combinedData);
			} else {
				throw new Error("Failed to fetch documents");
			}
		} catch (error) {
			setError("Error fetching documents");
			console.error("Error fetching documents:", error);
		}
	};

	const saveDocument = async () => {
		try {
			const response = await fetch(LOCAL_SERVER + "/add_document", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: text, id: textId }),
			});
			if (response.ok) {
				setText("");
				setTextId("");
				await fetchDocuments();
			} else {
				throw new Error("Failed to save document");
			}
		} catch (error) {
			setError("Error saving document");
			console.error("Error saving document:", error);
		}
	};

	const updateDocument = async () => {
		if (editId) {
			try {
				const response = await fetch(
					LOCAL_SERVER + "/update_document",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							old_id: editId,
							new_content: editText,
							new_id: newEditId,
						}),
					}
				);
				if (response.ok) {
					setEditId(null);
					setNewEditId("");
					setEditText("");
					await fetchDocuments();
				} else {
					throw new Error("Failed to update document");
				}
			} catch (error) {
				setError("Error updating document");
				console.error("Error updating document:", error);
			}
		}
	};

	const editDocument = (document: Document) => {
		setEditId(document.id);
		setNewEditId(document.id);
		setEditText(document.content);
	};

	const deleteDocument = async (data: Document) => {
		try {
			const response = await fetch(LOCAL_SERVER + "/delete_document", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content: data.content,
					id: data.id,
				}),
			});
			if (response.ok) {
				await fetchDocuments();
			} else {
				throw new Error("Failed to delete document");
			}
		} catch (error) {
			setError("Error deleting document");
			console.error("Error deleting document:", error);
		}
	};

	const filteredDocuments = documents.filter((document) =>
		document.content.toLowerCase().includes(filter.toLowerCase())
	);

	return (
		<div className="container mx-auto p-4">
			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<div className="space-y-4">
				<div className="flex space-x-2">
					<Input
						value={textId}
						onChange={(e) => setTextId(e.target.value)}
						placeholder="Data ID"
					/>
					<Input
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Type data here..."
					/>
					<Button onClick={saveDocument}>Save to Database</Button>
				</div>
				<Input
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					placeholder="Search by keyword..."
				/>
				{filteredDocuments.map((document) => (
					<Card key={document.id} className="mt-4">
						<CardHeader>
							<CardTitle>ID: {document.id}</CardTitle>
						</CardHeader>
						<CardContent>
							{editId === document.id ? (
								<div className="space-y-2">
									<Input
										value={newEditId}
										onChange={(e) =>
											setNewEditId(e.target.value)
										}
										placeholder="New ID"
									/>
									<Textarea
										value={editText}
										onChange={(e) =>
											setEditText(e.target.value)
										}
										className="h-40"
									/>
								</div>
							) : (
								<ReactMarkdown>
									{document.content}
								</ReactMarkdown>
							)}
							<div className="flex space-x-2 mt-2">
								{editId === document.id ? (
									<Button onClick={updateDocument}>
										Update
									</Button>
								) : (
									<Button
										onClick={() => editDocument(document)}
									>
										Edit
									</Button>
								)}
								<Button
									variant="destructive"
									onClick={() => deleteDocument(document)}
								>
									Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
