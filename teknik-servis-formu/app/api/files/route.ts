const fs = require("fs");
const path = require("path");

interface PDFRequest {
	pdf: string; // Base64 string of the PDF
	name: string;
}

export async function POST(request: Request) {
	try {
		const data = (await request.json()) as PDFRequest;

		// Decode the Base64 string to a Buffer
		const pdfBuffer = Buffer.from(data.pdf.split(",")[1], "base64"); // Remove the "data:application/pdf;base64," part

		// Save the PDF
		savePDF(pdfBuffer, data.name);

		return new Response("Başarıyla pdf kaydedildi", { status: 200 });
	} catch (error) {
		console.error("Error handling the request:", error);
		return new Response("Bir hata oluştu", { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		// Define the directory where PDFs are stored (relative to /public)
		const pdfDir = path.join(process.cwd(), "public", "pdfs"); // Full path to /public/pdfs

		// Ensure the directory exists
		if (!fs.existsSync(pdfDir)) {
			return new Response("No PDFs found.", { status: 404 });
		}

		// Read all files in the directory
		const files = fs
			.readdirSync(pdfDir)
			.filter((file: string) => file.endsWith(".pdf"));

		// Generate downloadable links for each file
		const fileLinks = files.map((file:string) => {
			// Construct the URL to the file
			const fileURL = `/pdfs/${encodeURIComponent(file)}`;
			return { name: file, link: fileURL };
		});

		// Return the list of file names with their links
		return new Response(JSON.stringify(fileLinks), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.log(error);
		return new Response("Beklenmeyen bir hata oluştu", { status: 500 });
	}
}

const savePDF = (pdfBuffer: Buffer, fileName: string) => {
    const filePath = path.join(process.cwd(), "public", "pdfs", fileName);

	// Ensure the 'pdfs' directory exists
	const directory = path.dirname(filePath);
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}

	fs.writeFileSync(filePath, pdfBuffer);
};
