import type { Metadata } from "next";
import { Geist, Geist_Mono, Crimson_Text, Poppins, Roboto, Roboto_Slab } from "next/font/google";
import { Shadows_Into_Light } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shadowsIntoLight = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-shadows',
});

const crimsonText = Crimson_Text({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
});

const poppins = Poppins({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const robotoSlab = Roboto_Slab({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-slab',
});

export const metadata: Metadata = {
  title: "Defend Daniel",
  description: "Daniel is an ordinary guy...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${shadowsIntoLight.variable} ${crimsonText.variable} antialiased ${poppins.variable} ${roboto.variable} ${robotoSlab.variable}`}>
        {children}
      </body>
    </html>
  );
}
