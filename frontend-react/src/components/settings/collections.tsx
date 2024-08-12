"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const LOCAL_SERVER = "http://127.0.0.1:6500";

type Collection = string;

const CollectionSetting = () => {
	const [isClient, setIsClient] = useState(false);
	const [newCollectionName, setNewCollectionName] = useState("");
	const [collections, setCollections] = useState<Collection[]>([]);

	useEffect(() => {
		setIsClient(true);
		getCollection();
	}, []);

	const getCollection = async () => {
		try {
			const response = await fetch(`${LOCAL_SERVER}/get_collection_name`);
			if (response.ok) {
				const data = await response.json();
				console.log(data.collection_name);
				setCollections(data.collection_name);
			} else {
				console.error("Failed to fetch collections");
			}
		} catch (error) {
			console.error("Error fetching collections:", error);
		}
	};

	const createNewCollection = async () => {
		if (!newCollectionName) return;

		try {
			const response = await fetch(
				`${LOCAL_SERVER}/update_collection_name`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name: newCollectionName }),
				}
			);

			if (response.ok) {
				setNewCollectionName("");
			} else {
				console.error("Failed to create new collection");
			}
		} catch (error) {
			console.error("Error creating new collection:", error);
		}
	};

	if (!isClient) {
		return null; // or a loading spinner
	}

	return (
		<div className="p-4 space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="text-lg font-semibold mb-2">
							Current Collection: {collections}
						</h3>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2">
							Create New Collection
						</h3>
						<div className="flex space-x-2">
							<Input
								placeholder="New collection name"
								value={newCollectionName}
								onChange={(e) =>
									setNewCollectionName(e.target.value)
								}
							/>
							<Button onClick={createNewCollection}>
								Create
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default CollectionSetting;
