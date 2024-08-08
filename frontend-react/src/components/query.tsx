"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";

interface Document {
	id: string;
	content: string;
}

const LOCAL_SERVER = "http://127.0.0.1:6500";

export default function DocumentQuery() {
	const [inputText, setInputText] = useState("");
	const [documents, setDocuments] = useState<Document[]>([]);
	const [error, setError] = useState<string | null>(null);

	const queryDocument = useCallback(async (query: string) => {
		try {
			const response = await fetch(LOCAL_SERVER + "/query_document", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: query }),
			});
			const data = await response.json();

			if (data.results && data.results.documents) {
				const combinedData = data.results.documents[0].map(
					(content: string, index: number) => ({
						content,
						id: data.results.ids[0][index],
					})
				);
				setDocuments(combinedData);
			} else {
				setDocuments([]);
			}
		} catch (error) {
			setError("Error fetching documents");
			console.error("Error fetching documents:", error);
		}
	}, []);

	useEffect(() => {
		if (inputText) {
			const debounceTimer = setTimeout(() => {
				queryDocument(inputText);
			}, 300); // Debounce for 300ms

			return () => clearTimeout(debounceTimer);
		} else {
			setDocuments([]);
		}
	}, [inputText, queryDocument]);

	return (
		<div className="container mx-auto p-4">
			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Input
				type="text"
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				className="mb-4 text-2xl"
				placeholder="Enter text"
			/>
			{documents.map((document, index) => (
				<Card key={index} className="mb-4">
					<CardHeader>
						<CardTitle>ID: {document.id}</CardTitle>
					</CardHeader>
					<CardContent>
						<ReactMarkdown>{document.content}</ReactMarkdown>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
