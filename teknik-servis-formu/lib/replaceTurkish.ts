import { FormData } from "@/components/Form";

const replaceTurkishChars = (input: string | null): string | null => {
	if (!input) return input;

	return input
		.replace(/ş/g, "s")
		.replace(/ğ/g, "g")
		.replace(/ı/g, "i")
		.replace(/ü/g, "u")
		.replace(/ç/g, "c")
		.replace(/ö/g, "o")
		.replace(/Ş/g, "S")
		.replace(/Ğ/g, "G")
		.replace(/ç/g, "C")
		.replace(/Ü/g, "U")
		.replace(/Ö/g, "O")
		.replace(/İ/g, "I");
};
export const processFormData = (formData: FormData): FormData => {
	return {
		date: replaceTurkishChars(formData.date)?.trim() || null,
		model: replaceTurkishChars(formData.model)?.trim() || null,
		orderNo: replaceTurkishChars(formData.orderNo)?.trim() || null,
		brand: replaceTurkishChars(formData.brand)?.trim() || null,
		orderDate: replaceTurkishChars(formData.orderDate)?.trim() || null,
		refundDate: replaceTurkishChars(formData.refundDate)?.trim() || null,
		customerReason:
			replaceTurkishChars(formData.customerReason)?.trim() || null,
		customerTitle:
			replaceTurkishChars(formData.customerTitle)?.trim() || null,
		name: replaceTurkishChars(formData.name)?.trim() || null,
		raporResponse:
			replaceTurkishChars(formData.raporResponse)?.trim() || null,
		images: formData.images,
	};
};
