import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "Little Star Nursery & Primary School | Star Kids Pre School & Day Care | Star Tuition Centre",
    template: "%s | Little Star School Chennai",
  },
  description:
    "Little Star Nursery & Primary School | Star Kids Pre School & Day Care | Star Tuition Centre – A nurturing environment in Chennai where every child shines bright. Enroll your child today!",
  keywords: ["nursery", "primary school", "preschool", "little star", "education", "kindergarten", "Chennai", "Star Kids", "Star Tuition Centre", "day care"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
