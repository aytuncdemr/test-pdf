import getDate from "@/lib/getDate";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useReducer } from "react";
import Slider from "./Slider";
import createAndDownloadPDF from "@/lib/createAndDownloadPDF";
import { processFormData } from "@/lib/replaceTurkish";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export interface FormData {
	date: string | null;
	model: string | null;
	orderNo: string | null;
	brand: string | null;
	orderDate: string | null;
	refundDate: string | null;
	customerReason: string | null;
	customerTitle: string | null;
	name: string | null;
	raporResponse: string | null;
	images: Blob[] | null;
}

export default function Form({
	setFormState,
	formState,
}: {
	formState: "none" | "text" | "photo";
	setFormState: React.Dispatch<
		React.SetStateAction<"none" | "text" | "photo">
	>;
}) {
	const [formData, dispatch] = useReducer(formReducer, {
		date: getDate(),
		model: null,
		orderNo: null,
		brand: "SoundWave",
		orderDate: null,
		refundDate: null,
		customerReason: null,
		customerTitle: null,
		name: null,
		raporResponse: `Ürün test edilmiştir ve sorun bulunamamıştır. Ürün kullanıcıya sorunsuz gönderilmiştir. Ürünün üzerinde kullanıcı kaynaklı hasarlar bulunmaktadır. Ürün tekrar 0 olarak satışa uygun değildir.`,
		images: null,
	});

	function formReducer(
		prevState: FormData,
		action: { type: keyof FormData; payload: string | Blob[] }
	) {
		return { ...prevState, [action.type]: action.payload };
	}

	async function submitHandler(e: FormEvent) {
		e.preventDefault();

		if (formState === "text" && formData && formData.model) {
			setFormState("photo");
		} else if (formState === "photo" && formData && formData.model) {
			await createAndDownloadPDF(processFormData(formData));
			setFormState("none");
		}
	}

	return (
		<form onSubmit={submitHandler} className="flex flex-col gap-2">
			<button
				type="button"
				onClick={() => setFormState("none")}
				className="bg-red-500 text-white text-xl py-2 rounded-lg"
			>
				İptal Et
			</button>
			{formState === "text" && (
				<>
					<button
						type="submit"
						className="bg-green-500 text-white text-xl py-2 rounded-lg"
					>
						Devam Et
					</button>
					<input
						required
						type="text"
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none"
						placeholder="Tarih"
						onChange={(e) =>
							dispatch({ type: "date", payload: e.target.value })
						}
						value={formData.date || ""}
					/>
					<input
						required
						type="text"
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none"
						placeholder="İsim"
						onChange={(e) =>
							dispatch({ type: "name", payload: e.target.value })
						}
						value={formData.name || ""}
					/>
					<input
						required
						type="text"
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none"
						placeholder="Marka"
						onChange={(e) =>
							dispatch({ type: "brand", payload: e.target.value })
						}
						value={formData.brand || ""}
					/>
					<Dropdown
						options={["Mini 2 Combo", "Mini 3 Combo"]}
						onChange={(e) => {
							dispatch({ type: "model", payload: e.value });
						}}
						value={formData.model || undefined}
						placeholder="Ürün Modeli"
					/>

					{/* <input
						required
						type="text"
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none"
						placeholder="Ürün Modeli"
						onChange={(e) =>
							dispatch({ type: "model", payload: e.target.value })
						}
						value={formData.model || ""}
					/> */}
					<input
						required
						type="text"
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none"
						placeholder="Sipariş Numarası"
						onChange={(e) =>
							dispatch({
								type: "orderNo",
								payload: e.target.value,
							})
						}
						value={formData.orderNo || ""}
					/>
					<input
						required
						type="text"
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none"
						placeholder="Sipariş Tarihi"
						onChange={(e) =>
							dispatch({
								type: "orderDate",
								payload: e.target.value,
							})
						}
						value={formData.orderDate || ""}
					/>
					<input
						required
						type="text"
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none"
						placeholder="İade Tarihi"
						onChange={(e) =>
							dispatch({
								type: "refundDate",
								payload: e.target.value,
							})
						}
						value={formData.refundDate || ""}
					/>
					<input
						required
						type="text"
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none"
						placeholder="İade Nedeni"
						onChange={(e) =>
							dispatch({
								type: "customerTitle",
								payload: e.target.value,
							})
						}
						value={formData.customerTitle || ""}
					/>
					<textarea
						required
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none min-h-[240px]"
						placeholder="İade Açıklama"
						onChange={(e) =>
							dispatch({
								type: "customerReason",
								payload: e.target.value,
							})
						}
						value={formData.customerReason || ""}
					/>
					<textarea
						required
						className="border-2 border-gray-300 py-2 px-2 rounded-lg outline-none min-h-[240px]"
						placeholder="Rapor"
						onChange={(e) =>
							dispatch({
								type: "raporResponse",
								payload: e.target.value,
							})
						}
						value={formData.raporResponse || ""}
					/>
				</>
			)}
			{formState === "photo" && (
				<>
					<button
						type="submit"
						className="bg-green-500 text-white text-xl py-2 rounded-lg"
					>
						Tamam
					</button>

					<button
						type="button"
						onClick={() =>
							document.getElementById("fileInput")?.click()
						}
						className="bg-gray-100 text-black border border-gray-300 text-3xl flex flex-col items-center justify-center gap-2 py-2 rounded-lg min-h-[24rem] font-bold"
					>
						<p>
							Fotoğraf Ekle{" "}
							{formData.images?.length
								? `(${formData.images.length})`
								: null}
						</p>
						<FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
					</button>
					<input
						type="file"
						id="fileInput"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							if (e.target.files?.length) {
								const newImage = e.target?.files[0];
								if (!formData.images) {
									dispatch({
										type: "images",
										payload: [newImage as Blob],
									});
								} else {
									dispatch({
										type: "images",
										payload: [...formData.images, newImage],
									});
								}
							}
						}}
						style={{ display: "none", visibility: "hidden" }}
					/>
				</>
			)}
			{formData.images && <Slider images={formData.images}></Slider>}
		</form>
	);
}
