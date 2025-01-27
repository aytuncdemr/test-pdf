import { FormData } from "@/components/Form";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { blobToBase64 } from "./blobToBase64";

export default async function createAndDownloadPDF(formData: FormData) {
	try {
		const pdfFile = await fetch("/form.pdf");
		const arrayBuffer = await pdfFile.arrayBuffer();

		const pdfDoc = await PDFDocument.load(arrayBuffer);
		const pages = pdfDoc.getPages();
		const firstPage = pages[0];
		const { width, height } = firstPage.getSize();
		const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const fontSize = 13;

		const splitTextIntoLines = (
			text: string,
			maxWidth: number,
			fontSize: number,
			font: any
		): string[] => {
			const words = text.split(" ");
			let lines: string[] = [];
			let currentLine = "";

			words.forEach((word) => {
				const testLine = currentLine ? `${currentLine} ${word}` : word;
				const widthOfTestLine = font.widthOfTextAtSize(
					testLine,
					fontSize
				);

				if (widthOfTestLine <= maxWidth) {
					currentLine = testLine;
				} else {
					if (currentLine) lines.push(currentLine);
					currentLine = word;
				}
			});
			if (currentLine) lines.push(currentLine);
			return lines;
		};

		const drawTextWithWrap = (text: string, x: number, y: number) => {
			const lines = splitTextIntoLines(
				text,
				width - x - 20,
				fontSize,
				font
			); // Max width to avoid going off the page
			let offsetY = y;

			lines.forEach((line, index) => {
				firstPage.drawText(line, {
					x,
					y: offsetY - fontSize * index, // Adjust Y for each line
					size: fontSize,
					color: rgb(0, 0, 0),
					font,
				});
			});
		};

		drawTextWithWrap(formData.date || "", 491, height - 86);
		drawTextWithWrap(formData.name || "", 152, height - 188);
		drawTextWithWrap(formData.brand || "", 137, height - 324);
		drawTextWithWrap(formData.model || "", 132, height - 346);
		drawTextWithWrap(formData.orderNo || "", 155, height - 369);
		drawTextWithWrap(formData.orderDate || "", 136, height - 392);
		drawTextWithWrap(formData.refundDate || "", 123, height - 414);
		drawTextWithWrap(formData.customerTitle || "", 98, height - 479);
		drawTextWithWrap(formData.customerReason || "", 115, height - 502);
		drawTextWithWrap(formData.raporResponse || "", 60, height - 581);

		if (formData.images && formData.images.length > 0) {
			for (const imageBlob of formData.images) {
				const imageBytes = await imageBlob.arrayBuffer();
				const image = await pdfDoc.embedJpg(imageBytes); // Or embedPng if the image is a PNG
				const imageDims = image.scale(0.5); // Adjust the scaling factor as necessary

				// Add a new page for each image
				const newPage = pdfDoc.addPage([width, height]);
				newPage.drawImage(image, {
					x: 0, // You can adjust the positioning as needed
					y: height - imageDims.height, // Position it at the top of the new page
					width: imageDims.width,
					height: imageDims.height,
				});
			}
		}

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: "application/pdf" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${formData.name}-${formData.orderNo}.pdf`;
		link.click();
		const base64Pdf = await blobToBase64(blob);

		await fetch("/api/files", {
			body: JSON.stringify({
				pdf: base64Pdf, // Base64 string of the PDF
				name: `${formData.name}-${formData.orderNo}.pdf`,
			}),
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error modifying PDF:", error);
	}
}
