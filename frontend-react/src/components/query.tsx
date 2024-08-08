"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";

interface Document {
	id: string;
	content: string;
}

const LOCAL_SERVER = "http://127.0.0.1:6500";

export default function DocumentQuery() {
	const [inputText, setInputText] = useState("");
	const [nResult, setNResult] = useState("5"); // Default to 5 results
	const [documents, setDocuments] = useState<Document[]>([]);
	const [error, setError] = useState<string | null>(null);

	const queryDocument = useCallback(async (query: string, n: number) => {
		try {
			const response = await fetch(`${LOCAL_SERVER}/query_document`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: query, n_result: n }),
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
				queryDocument(inputText, parseInt(nResult));
			}, 300); // Debounce for 300ms

			return () => clearTimeout(debounceTimer);
		} else {
			setDocuments([]);
		}
	}, [inputText, nResult, queryDocument]);

	return (
		<div className="container mx-auto p-4">
			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<div className="flex flex-col space-y-2 mb-4">
				<div className="flex items-end space-x-2">
					<div className="flex-grow">
						<Label htmlFor="query-input" className="mb-1 block">
							Query
						</Label>
						<Input
							id="query-input"
							type="text"
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							className="text-lg"
							placeholder="Enter text"
						/>
					</div>
					<div className="w-20">
						<Label htmlFor="n-result-input" className="mb-1 block">
							Results
						</Label>
						<Input
							id="n-result-input"
							type="number"
							value={nResult}
							onChange={(e) => setNResult(e.target.value)}
							className="text-lg"
							placeholder="#"
							min="1"
							max="99"
						/>
					</div>
				</div>
			</div>
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
