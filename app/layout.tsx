import "../styles/globals.css";
import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://miftahul.in"),
  alternates: {
    canonical: "/",
  },
  title: "Miftahul Hussain - Full-Stack Web Developer Portfolio",
  description: "Professional portfolio of Miftahul Hussain, a full-stack web developer specializing in modern web technologies, clean design, and performance optimization.",
  keywords: ["web developer", "full-stack developer", "React", "Next.js", "TypeScript", "portfolio", "frontend developer"],
  authors: [{ name: "Miftahul Hussain" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Miftahul Hussain - Full-Stack Developer",
    description: "Professional portfolio showcasing modern web development projects",
    type: "website",
    url: "https://miftahul.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Miftahul Hussain - Full-Stack Developer",
    description: "Professional portfolio showcasing modern web development projects",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-white">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JBBYRL1DRR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-JBBYRL1DRR');
          `}
        </Script>
        <div className="relative min-h-screen overflow-hidden">
          <Navbar />
          <PageTransition>
            <main className="mx-auto max-w-7xl px-6 pb-16 pt-24 md:pt-28">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </div>
      </body>
    </html>
  );
}
