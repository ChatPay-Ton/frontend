import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChatPay TON - Mini App",
  description: "Mini App para pagamentos usando TON no Telegram"
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <meta name="telegram-mini-app" content="true" />
        <meta name="theme-color" content="#e0eff6" />
      </head>
      <body className={`${inter.variable} antialiased telegram-mini-app`}>
        {children}
      </body>
    </html>
  );
}
