import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ConditionalNav } from "@/components/layout/ConditionalNav";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  viewportFit:  "cover", // enables env(safe-area-inset-*) on notched iPhones
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://lynkserv.com"
  ),

  title: {
    template: "%s | LynkServ",
    default:  "LynkServ — Find Vetted Local Service Businesses in Utah",
  },

  description:
    "Find vetted local service businesses across Utah. Search plumbers, electricians, lawn care, and 12 service categories in Salt Lake City, Provo, Ogden, and 27 more Utah cities. Free for homeowners.",

  keywords: [
    "Utah local services",
    "local service directory Utah",
    "vetted contractors Utah",
    "find local businesses Utah",
    "home services Utah",
    "home services Salt Lake City",
    "trusted local businesses Utah",
    "local contractors Utah",
  ],

  authors:   [{ name: "LynkServ", url: "https://lynkserv.com" }],
  creator:   "LynkServ",
  publisher: "LynkServ",

  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://lynkserv.com",
    siteName:    "LynkServ",
    title:       "LynkServ — Find Vetted Local Service Businesses in Utah",
    description: "Discover vetted local service businesses across Utah. No lead fees, no middlemen. Free for homeowners.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "LynkServ — Your Link to Trusted Local Services in Utah" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "LynkServ — Trusted Local Services in Utah",
    description: "Find vetted local service businesses across 30 Utah cities. Free for homeowners.",
    images:      ["/opengraph-image"],
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:              true,
      follow:             true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  alternates: { canonical: "https://lynkserv.com" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F8F9FA]">
        <ConditionalNav />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
