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
		{ name: string; link: string }[] | null
	>(null);

	useEffect(() => {
		(async function () {
			const response = await fetch("/api/files");
			const data: { name: string; link: string }[] =
				await response.json();

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
					className="bg-green-500 text-white text-3xl py-2 rounded-lg min-h-[24rem] font-bold"
				>
					<p className="mb-4">Yeni PDF</p>
					<div className="border-2 m-auto hover:border-none hover:bg-white hover:text-green-500 duration-100 border-gray-200 rounded-full w-24 h-24 flex items-center justify-center">
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
			<button className=" text-gray-700 text-3xl py-2 rounded-lg font-bold">
				<p className="mb-4">
					Önceki PDF&apos;ler{" "}
					{pdfFiles && pdfFiles.length > 0
						? `(${pdfFiles.length})`
						: null}
				</p>
				{pdfFiles &&
					pdfFiles.map(
						(
							pdfFile: { name: string; link: string },
							index: number
						) => {
							return (
								<div
									className="mb-4"
									key={index}
									onClick={() => {
										const anchor =
											document.createElement("a");
										anchor.href = pdfFile.link;
										anchor.download = pdfFile.name;
										document.body.appendChild(anchor);
										anchor.click();
										document.body.removeChild(anchor);
									}}
								>
									<p className="text-gray-500">
										{pdfFile.name}
									</p>
								</div>
							);
						}
					)}
			</button>
		</div>
	);
}
