import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qazi Islam | 2027 Rebuild Prototype",
  description:
    "A cinematic 2026-2027 portfolio rebuild prototype with modular sections and motion-forward UX."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
