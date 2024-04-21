import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Sora } from "next/font/google";
// import { Indie_Flower } from "next/font/google";
// import { Dekko } from "next/font/google";
import "./globals.css";

const sora = Sora(
  {
    weight: "400",
    subsets: ["latin"]
  }
);

export const metadata: Metadata = {
  title: "Aurora",
  description: "Aurora bageri på Nørrebro i København",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={sora.className}>{children}</body>
    </html>
  );
}
