import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: {
    default: "வடசென்னை குரல் | Vadachennai Kural - Tamil Digital Magazine",
    template: "%s | Vadachennai Kural",
  },
  description: "வடசென்னையின் கலை, இலக்கியம், விளையாட்டு மற்றும் சமூக வாழ்வியலை ஆவணப்படுத்தும் ஒரு பிரீமியம் தமிழ் டிஜிட்டல் இதழ்.",
  keywords: ["Vadachennai Kural", "வடசென்னை குரல்", "Tamil Magazine", "Tamil Digital Magazine", "North Chennai Stories", "Chennai Culture", "Gana Music", "Boxing Chennai"],
  authors: [{ name: "Vadachennai Kural Editorial Team" }],
  creator: "Vadachennai Kural",
  publisher: "Vadachennai Kural",
  metadataBase: new URL("https://vadachennaikural.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "வடசென்னை குரல் | Vadachennai Kural - Tamil Digital Magazine",
    description: "வடசென்னையின் கலை, இலக்கியம், விளையாட்டு மற்றும் சமூக வாழ்வியலை ஆவணப்படுத்தும் ஒரு பிரீமியம் தமிழ் டிஜிட்டல் இதழ்.",
    url: "https://vadachennaikural.com",
    siteName: "Vadachennai Kural",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vadachennai Kural Tamil Digital Magazine",
      },
    ],
    locale: "ta_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "வடசென்னை குரல் | Vadachennai Kural - Tamil Digital Magazine",
    description: "வடசென்னையின் கலை, இலக்கியம், விளையாட்டு மற்றும் சமூக வாழ்வியலை ஆவணப்படுத்தும் ஒரு பிரீமியம் தமிழ் டிஜிட்டல் இதழ்.",
    images: ["/images/og-image.jpg"],
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import GlobalLayoutWrapper from "@/components/common/GlobalLayoutWrapper";

export default function RootLayout({ children }) {
  return (
    <html
      lang="ta"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas text-charcoal font-sans selection:bg-primary selection:text-white">
        <LanguageProvider>
          <GlobalLayoutWrapper>
            {children}
          </GlobalLayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
