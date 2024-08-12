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
	const [currentCollection, setCurrentCollection] = useState("");
	const [collections, setCollections] = useState<Collection[]>([]);

	useEffect(() => {
		setIsClient(true);
		getCollectionList();
	}, []);

	const getCollectionList = async () => {
		try {
			const response = await fetch(`${LOCAL_SERVER}/get_collection_list`);
			if (response.ok) {
				const data = await response.json();
				console.log(data.collection_list);
				setCurrentCollection(data.current_collection);
				setCollections(data.collection_list);
			} else {
				console.error("Failed to fetch collections");
			}
		} catch (error) {
			console.error("Error fetching collections:", error);
		}
	};

	const updateCollection = async (collectionName: string) => {
		try {
			const response = await fetch(
				`${LOCAL_SERVER}/update_collection_name`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ content: collectionName }),
				}
			);

			if (response.ok) {
				setCurrentCollection(collectionName);
				await getCollectionList(); // Refresh the list after updating
				window.location.reload();
			} else {
				console.error("Failed to update collection");
			}
		} catch (error) {
			console.error("Error updating collection:", error);
		}
	};

	const createNewCollection = async () => {
		if (!newCollectionName) return;
		await updateCollection(newCollectionName);
		setNewCollectionName("");
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
							Current Collection: {currentCollection}
						</h3>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2">
							Switch Collection
						</h3>
						<Select
							value={currentCollection}
							onValueChange={(value) => updateCollection(value)}
						>
							<SelectTrigger>
								<SelectValue>{currentCollection}</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{collections.map((collection) => (
									<SelectItem
										key={collection}
										value={collection}
									>
										{collection}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
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
