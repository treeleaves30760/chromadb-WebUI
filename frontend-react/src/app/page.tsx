import React from "react";
import DocumentQuery from "@/components/query";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Lock, Search, Sliders, Database } from "lucide-react";

const sections = [
	{
		title: "About ChromaDB Manager",
		content:
			"ChromaDB Manager is a powerful tool that allows you to interact with and manage your ChromaDB instance using a sleek and intuitive interface. Built with Next.js and shadcn-ui, it offers a seamless experience for both developers and end-users.",
		features: [
			{
				title: "Smart Interactions",
				description:
					"Engage in intelligent data management with your ChromaDB instance.",
				icon: Brain,
			},
			{
				title: "Fast Performance",
				description:
					"Experience lightning-fast queries and updates with optimized processing.",
				icon: Zap,
			},
			{
				title: "Privacy Focused",
				description:
					"Keep your data secure with on-premise ChromaDB interactions.",
				icon: Lock,
			},
			{
				title: "Efficient Search",
				description:
					"Quickly find relevant documents using ChromaDB's powerful search capabilities.",
				icon: Search,
			},
			{
				title: "Customizable Queries",
				description:
					"Fine-tune your search parameters for precise results.",
				icon: Sliders,
			},
			{
				title: "Comprehensive Results",
				description:
					"Get detailed information about matching documents.",
				icon: Database,
			},
		],
	},
];

export default function ChromaDBManager() {
	return (
		<div className="container mx-auto p-4">
			<Accordion type="single" collapsible className="w-full mb-8">
				{sections.map((section, index) => (
					<AccordionItem key={index} value={`section-${index}`}>
						<AccordionTrigger className="text-2xl font-semibold">
							{section.title}
						</AccordionTrigger>
						<AccordionContent>
							<section className="mb-8">
								<p className="text-gray-700 mb-6">
									{section.content}
								</p>
								<div className="grid md:grid-cols-3 gap-6">
									{section.features.map(
										(feature, featureIndex) => (
											<Card key={featureIndex}>
												<CardHeader>
													<CardTitle>
														<feature.icon className="inline-block mr-2 h-5 w-5" />
														{feature.title}
													</CardTitle>
												</CardHeader>
												<CardContent>
													{feature.description}
												</CardContent>
											</Card>
										)
									)}
								</div>
							</section>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<DocumentQuery />
		</div>
	);
}
