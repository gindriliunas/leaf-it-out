import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://leafitoutltd.co.uk"),
  title: "Landscaping Medway & Kent | Driveways, Patios & Gardens — Leaf It Out",
  description:
    "Leaf It Out — Checkatrade approved landscapers serving Medway & Kent for 15+ years. Driveways, block paving, patios, garden landscaping & decking. Call 07871 878682 for a free quote.",
  keywords: [
    "landscaping medway",
    "landscaping kent",
    "driveways medway",
    "block paving medway",
    "patios medway",
    "garden landscaping kent",
    "driveway installation chatham",
    "patio installation rochester",
    "landscapers gillingham",
    "decking medway",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Landscaping Medway & Kent | Leaf It Out",
    description:
      "Checkatrade approved landscapers — driveways, patios, gardens & decking across Medway and Kent. 15+ years experience. Free quotes.",
    type: "website",
    locale: "en_GB",
  },
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Leaf It Out",
  telephone: "+447871878682",
  email: "leafitoutltd@gmail.com",
  url: "https://leafitoutltd.co.uk",
  sameAs: [
    "https://www.facebook.com/leafitoutltd",
    "https://www.checkatrade.com/trades/leafitoutlandscapes",
  ],
  address: {
    "@type": "PostalAddress",
    addressRegion: "Medway",
    addressCountry: "GB",
  },
  areaServed: [
    "Chatham", "Rochester", "Gillingham", "Maidstone", "Sittingbourne",
    "Faversham", "Canterbury", "Tonbridge", "Sevenoaks", "Gravesend",
  ],
  description:
    "Family run landscaping business with 15+ years experience. Specialising in driveways, patios and garden landscaping across Medway and Kent.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Landscaping Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Driveways & Block Paving" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Patios & Natural Stone" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Garden Landscaping" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Decking & Fencing" } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `fetch('https://www.viv-z.com/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({s:'1ceb200d-6d8a-4771-aadd-3c2f04ff4a19',p:location.pathname,r:document.referrer}),keepalive:true});`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
