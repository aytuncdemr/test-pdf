"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, password }),
			});

			if (!response.ok) {
				throw new Error("Hatalı kullanıcı adı veya şifre");
			}

			router.push("/home");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || "Birşeyler ters gitti");
			} else {
				setError("Birşeyler ters gitti");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-4 border rounded shadow">
			<h1 className="text-xl font-bold mb-4 text-center">Giriş Yap</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full p-2 border rounded"
						placeholder="Kullanıcı Adı"
						required
					/>
				</div>
				<div className="mb-4">
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 border rounded"
						placeholder="Şifre"
						required
					/>
				</div>
				{error && (
					<p className="text-red-500 text-center     mb-4">{error}</p>
				)}
				<button
					type="submit"
					className="w-full p-2  bg-green-500 text-white rounded hover:bg-green-600"
					disabled={loading}
				>
					{loading ? "..." : "Tamam"}
				</button>
			</form>
		</div>
	);
};

export default Login;
