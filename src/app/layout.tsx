import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import Providers from "./providers";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in window.history) {
                  window.history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <ScrollToTop />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
