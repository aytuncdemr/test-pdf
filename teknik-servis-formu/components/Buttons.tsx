"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Form from "./Form";

export default function Buttons() {
	const [formState, setFormState] = useState<"none" | "text" | "photo">(
		"none"
	);

	const [pdfFiles, setPdfFiles] = useState<
		{ name: string; _id: string }[] | null
	>(null);

	useEffect(() => {
		(async function () {
			const response = await fetch("/api/files", {
				headers: {
					"Cache-Control": "no-store", // Prevent the browser from caching
				},
			});
			const data: { name: string; _id: string }[] = await response.json();

			if (data && data.length > 0) {
				setPdfFiles(data);
			}
		})();
	}, [formState]);

	return (
		<div className="buttons flex flex-col gap-2 max-w-[32rem] mx-auto">
			{formState === "none" && (
				<button
					onClick={() => setFormState("text")}
					className="bg-green-500 text-white text-3xl py-2 rounded-lg min-h-[24rem] group font-bold"
				>
					<p className="mb-4">Yeni PDF</p>
					<div className="border-2 m-auto hover:border-none group-hover:bg-white group-hover:text-green-500 duration-100 border-gray-200 rounded-full w-24 h-24 flex items-center justify-center">
						<FontAwesomeIcon
							width={75}
							height={75}
							icon={faPlus}
						></FontAwesomeIcon>
					</div>
				</button>
			)}
			{(formState === "text" || formState === "photo") && (
				<Form formState={formState} setFormState={setFormState}></Form>
			)}
			<div className=" text-gray-700 mt-4 text-3xl py-2 rounded-lg font-bold text-center">
				<p className="mb-4">
					Önceki PDF&apos;ler{" "}
					{pdfFiles && pdfFiles.length > 0
						? `(${pdfFiles.length})`
						: null}
				</p>
			</div>
			{pdfFiles &&
				pdfFiles.map(
					(pdfFile: { name: string; _id: string }, index: number) => {
						return (
							<button
								className="mb-4 inline-block cursor-pointer text-2xl text-center text-red-500"
								key={index}
								onClick={async () => {
									try {
										const response = await fetch(
											`/api/files?id=${pdfFile._id}`,
											{
												headers: {
													"Cache-Control": "no-store", // Prevent the browser from caching
												},
											}
										);

										// Check if the response is successful
										if (response.ok) {
											const blob = await response.blob();
											const link =
												document.createElement("a");
											link.href =
												URL.createObjectURL(blob);
											link.download = pdfFile.name; // Set the file name for the download
											link.click(); // Trigger the download
											URL.revokeObjectURL(link.href); // Clean up the object URL
										} else {
											console.error(
												"Failed to fetch the PDF"
											);
										}
									} catch (error) {
										console.error(
											"Error downloading the file:",
											error
										);
									}
								}}
							>
								<p className="text-gray-500 font-bold">
									{pdfFile.name}
								</p>
							</button>
						);
					}
				)}
		</div>
	);
}
