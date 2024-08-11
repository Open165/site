import type { Metadata } from "next";
import { GoogleTagManager } from '@next/third-parties/google'
import "./globals.css";

const GTM_ID = "GTM-T4RD9WLJ";
const GOOGLE_SITE_VERIFICATION = 'k3o46ssxu8N_MljoXU3YGHEiwctCTuQDeWFv_j1rgxU';

export const metadata: Metadata = {
  title: {
    default: 'Open165 民間反詐騙資訊站',
    template: '%s | Open165 反詐騙'
  },
  description: "Open165 反詐資訊站是民間自主架設的網站，使用內政部警政署公告的開放資料等公開來源情報（OSI），讓已經接觸到詐騙或已經被詐騙的民眾，能搜尋到相關資訊，避免被二次詐騙。",
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Noto+Serif+TC:wght@600&display=swap" rel="stylesheet" />
      </head>
      <GoogleTagManager gtmId={GTM_ID} />
      <body>{children}</body>
    </html>
  );
}
