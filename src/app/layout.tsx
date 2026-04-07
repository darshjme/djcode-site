import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  title: "DJcode -- The last coding CLI you'll ever need",
  description:
    "22 agents. 9 providers. 3-tier memory. Zero telemetry. Local-first AI coding CLI that runs on your machine with Ollama and MLX.",
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
    title: "DJcode -- The last coding CLI you'll ever need",
    description:
      "22 agents. 9 providers. 3-tier memory. Zero telemetry. Runs on your machine.",
    url: "https://cli.darshj.ai",
    siteName: "DJcode",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DJcode -- The last coding CLI you'll ever need",
    description:
      "22 agents. 9 providers. 3-tier memory. Zero telemetry. Runs on your machine.",
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
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
