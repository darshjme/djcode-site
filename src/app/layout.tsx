import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DJcode — Your terminal. An entire team.",
  description:
    "A local-first AI coding agent with specialist orchestration, real tools, persistent memory, and your choice of local or hosted model.",
  keywords: [
    "AI coding CLI",
    "local AI",
    "Ollama",
    "MLX",
    "Apple Silicon",
    "coding agents",
    "zero telemetry",
    "DJcode",
  ],
  authors: [{ name: "DarshJ", url: "https://darshj.ai" }],
  openGraph: {
    title: "DJcode — Your terminal. An entire team.",
    description:
      "Specialist agents. Real tools. Persistent context. Build from your terminal with local or hosted models.",
    url: "https://cli.darshj.ai",
    siteName: "DJcode",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DJcode — Your terminal. An entire team.",
    description:
      "Specialist agents. Real tools. Persistent context. Build from your terminal with local or hosted models.",
  },
  metadataBase: new URL("https://cli.darshj.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-[#F5F5F5] antialiased font-sans">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
