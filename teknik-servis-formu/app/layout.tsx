import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "pdf mdf",
	description: "",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="tr-TR">
			<body>
        <header className="py-12">

          <h1 className="text-center text-3xl">SoundWave <br />  PDF Panel</h1>

        </header>
        
        {children}</body>
		</html>
	);
}
