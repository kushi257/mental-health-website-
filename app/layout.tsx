import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-brand" });

export const metadata: Metadata = {
  title: "ManoMitra — Your Mental Health Companion",
  description: "A confidential, compassionate digital mental health companion for college students. Mood tracking, guided exercises, CBT tools, and professional support — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable}`}>
        <div className="bubble-field" aria-hidden="true">
          {Array.from({ length: 20 }, (_, index) => <span key={index} className="bubble" />)}
        </div>
        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
