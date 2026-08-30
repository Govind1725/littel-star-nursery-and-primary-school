import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import Providers from "./providers";
import JsonLd, { SCHOOL_NAP } from "@/components/JsonLd";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4C1D95",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.littlestarnpschool.com"),
  title: {
    default: "Little Star Nursery & Primary School | Best School in Nerkundram, Chennai",
    template: "%s | Little Star Nursery & Primary School Nerkundram",
  },
  description:
    "Little Star Nursery & Primary School in Nerkundram, Chennai. Top-rated Nursery, Primary School, Play School, Day Care & Tuition Centre serving Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West & Mogappair.",
  keywords: [
    "Little Star Nursery and Primary School",
    "Nursery School in Nerkundram",
    "Primary School in Nerkundram",
    "Play School in Nerkundram",
    "Preschool in Nerkundram",
    "Daycare in Nerkundram",
    "Tuition Centre in Nerkundram",
    "Best School in Nerkundram",
    "Nursery School in Kodambakkam",
    "Primary School in Kodambakkam",
    "Play School in Kodambakkam",
    "Preschool in Kodambakkam",
    "Daycare in Kodambakkam",
    "Tuition Centre in Kodambakkam",
    "Best School near Nerkundram",
    "Best Preschool near Nerkundram",
    "Best School in Chennai",
    "Star Kids Pre School",
    "Star Tuition Centre Nerkundram"
  ],
  authors: [{ name: "Little Star Nursery & Primary School" }],
  creator: "Little Star Nursery & Primary School",
  publisher: "Little Star Nursery & Primary School",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.littlestarnpschool.com/",
    siteName: "Little Star Nursery & Primary School",
    title: "Little Star Nursery & Primary School | Best School in Nerkundram, Chennai",
    description:
      "Nurturing young minds in Nerkundram, Chennai. Offering Nursery, Primary School, Play School, Day Care & Tuition Centre in a safe, activity-based environment.",
    images: [
      {
        url: "/images/little%20star%20logo.png",
        width: 800,
        height: 800,
        alt: "Little Star Nursery and Primary School Nerkundram Chennai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Star Nursery & Primary School | Best School in Nerkundram, Chennai",
    description:
      "Nurturing young minds in Nerkundram, Chennai. Offering Nursery, Primary School, Play School, Day Care & Tuition Centre.",
    images: ["/images/little%20star%20logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const rootSchoolSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://www.littlestarnpschool.com/#school",
  ...SCHOOL_NAP,
  sameAs: [
    "https://www.instagram.com/starsoflittle",
    "https://www.youtube.com/@LittleStarNurseryandprimarySch",
  ],
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
        <JsonLd data={rootSchoolSchema} />
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
