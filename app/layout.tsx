import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ScrollReveal from "./components/scroll-reveal";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KYYP",
  description: "Smart transportation management for better operations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  const publicPage = () => {
    return (
      !pathname.startsWith("/auth") &&
      !pathname.startsWith("/workspace")
    );
  };

  return (
    <html lang="en" className={cn("font-sans", spaceGrotesk.variable)}>
      <body className={poppins.variable}>
        {publicPage() && <Navbar />}
        <ScrollReveal />
        {children}
        {publicPage() && <Footer />}
      </body>
    </html>
  );
}