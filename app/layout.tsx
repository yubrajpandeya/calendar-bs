import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://calendar.newsbihani.com"),
  title: {
    default: "न्युज बिहानी पात्रो | नेपाली क्यालेन्डर २०८३",
    template: "%s | न्युज बिहानी पात्रो",
  },
  description:
    "सही नेपाली मिति, सार्वजनिक बिदा, प्रमुख पर्व र BS-AD मिति रूपान्तरण। बाह्य API बिना News Bihani को आफ्नै नेपाली पात्रो।",
  applicationName: "न्युज बिहानी पात्रो",
  category: "calendar",
  keywords: [
    "Nepali calendar",
    "नेपाली पात्रो",
    "Bikram Sambat",
    "मिति रूपान्तरण",
    "Nepal holidays 2083",
  ],
  openGraph: {
    type: "website",
    locale: "ne_NP",
    url: "/",
    siteName: "न्युज बिहानी पात्रो",
    title: "न्युज बिहानी पात्रो",
    description: "नेपाली मिति, सार्वजनिक बिदा र प्रमुख पर्व एकै ठाउँमा।",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "न्युज बिहानी पात्रो, साउन २०८३",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "न्युज बिहानी पात्रो",
    description: "नेपाली मिति, सार्वजनिक बिदा र प्रमुख पर्व एकै ठाउँमा।",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00163d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ne">
      <body>{children}</body>
    </html>
  );
}
