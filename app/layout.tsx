import { GoogleTagManager } from '@next/third-parties/google';
import type { Metadata } from "next";
import "./globals.css";

const GTM_ID = "GTM-T4RD9WLJ";

export const metadata: Metadata = {
  title: "open165",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <GoogleTagManager gtmId={GTM_ID} />
      <body>{children}</body>
    </html>
  );
}
