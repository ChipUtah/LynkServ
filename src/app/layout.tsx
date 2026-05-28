import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ConditionalNav } from "@/components/layout/ConditionalNav";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LynkServ — Your Link to Trusted Local Services",
  description:
    "Find vetted local service businesses in Utah. Vetted businesses. Real reviews. First-time offers.",
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
