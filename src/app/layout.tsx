import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Space_Mono, Beau_Rivage } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MotionProvider from "@/components/MotionProvider";
import IntroLoader from "@/components/IntroLoader";
import CustomCursor from "@/components/CustomCursor";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const beauRivage = Beau_Rivage({
  variable: "--font-beau-rivage",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#003462",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Motos de Lujo en Caracas`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "motos de lujo Caracas",
    "motos alta cilindrada Venezuela",
    "concesionario motos multimarca Caracas",
    "BMW R 1250 GS Adventure Venezuela",
    "Honda Africa Twin Venezuela",
    "Ducati Multistrada Venezuela",
    "Ducati Monster Venezuela",
    "Yamaha Ténéré Venezuela",
    "Suzuki DR650 Venezuela",
    "Kawasaki KLR 650 Venezuela",
    "Voge Venezuela",
  ],
  openGraph: {
    title: `${siteConfig.name} | Motos de Lujo en Caracas`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "es_VE",
    type: "website",
  },
  icons: {
    icon: withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg"),
    shortcut: withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg"),
    apple: withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} ${beauRivage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-brand-bg text-brand-text">
        <MotionProvider>
          <IntroLoader />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <CustomCursor />
        </MotionProvider>
      </body>
    </html>
  );
}
