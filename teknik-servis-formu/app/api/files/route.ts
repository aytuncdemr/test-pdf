import { connectToDatabase } from "@/lib/connectMongoDB";
import getDate from "@/lib/getDate";
import { Binary, ObjectId } from "mongodb";

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
		await savePDF(pdfBuffer, data.name);

		return new Response("Başarıyla pdf kaydedildi", { status: 200 });
	} catch (error) {
		console.error("Error handling the request:", error);
		return new Response("Bir hata oluştu", { status: 500 });
	}
}

const savePDF = async (pdfBuffer: Buffer, fileName: string) => {
	try {
		// Connect to MongoDB
		const { db } = await connectToDatabase();
		const collection = db.collection("pdfs");

		// Insert the PDF document
		await collection.insertOne({
			name: fileName,
			file: new Binary(pdfBuffer), // Store as BSON Binary
			uploadedAt: getDate(), // Optional: Store upload timestamp
		});
	} catch (error) {
		console.error("Error saving PDF to MongoDB:", error);
	}
};

export async function GET(request: Request) {
	try {
		// Parse the query parameters
		const url = new URL(request.url);
		const id = url.searchParams.get("id");

		const { db } = await connectToDatabase();
		const collection = db.collection("pdfs");

		if (id) {
			// Find the document by its ObjectId
			const pdf = await collection.findOne({ _id: new ObjectId(id) });

			if (!pdf) {
				return new Response("PDF not found", { status: 404 });
			}

			// Get the file data (Buffer) and the file name
			const pdfBuffer = pdf.file.buffer;
			const fileName = pdf.name;

			// Return the PDF as a response with appropriate headers
			return new Response(pdfBuffer, {
				status: 200,
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": `attachment; filename="${fileName}"`,
				},
			});
		} else {
			// Case when no 'id' is provided (fetch all PDF names)
			const pdfs = await collection
				.find({}, { projection: { name: 1, _id: 1 } })
				.toArray();

			return new Response(JSON.stringify(pdfs), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}
	} catch (error) {
		console.error("Error handling request:", error);
		return new Response("An error occurred", { status: 500 });
	}
}
