import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "./logo";

const footerLinks = {
  product: [
    { label: "Fleet Management", href: "#fleet-management" },
    { label: "Route Management", href: "#route-management" },
    { label: "Driver Management", href: "#driver-management" },
    { label: "Reports", href: "#reports" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Contact", href: "#contact" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const footerContent = {
  description:
    "Smart transportation management for teams that want better visibility, better control, and better operations.",
  newsletterTitle: "Stay in the loop",
  newsletterDescription:
    "Get updates, transportation insights, and news from KYYP.",
  emailPlaceholder: "Enter your email address",
  subscribeLabel: "Subscribe",
  copyright: "© 2026 KYYP. All rights reserved.",
  status: "Built for better transportation operations.",
};

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-text">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex">
              <Logo />
            </Link>

            <p className="mt-6 text-sm leading-6 text-muted sm:text-base sm:leading-7">
              {footerContent.description}
            </p>

            <div className="mt-8">
              <p className="text-sm font-semibold text-muted">
                {footerContent.newsletterTitle}
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                {footerContent.newsletterDescription}
              </p>

              <form className="mt-5 flex w-full max-w-md items-center border border-border bg-background p-1.5">
                <Input
                  type="email"
                  placeholder={footerContent.emailPlaceholder}
                  className="h-11 min-w-0 flex-1 border-0 bg-transparent px-3 font-sans text-sm text-text shadow-none outline-none placeholder:text-muted focus-visible:border-0 focus-visible:ring-0"
                />

                <Button
                  type="button"
                  className="h-11 shrink-0 bg-primary px-4 font-sans text-sm font-medium text-foreground hover:bg-primary-dark sm:px-5"
                >
                  <span>{footerContent.subscribeLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted">Product</h3>

            <nav className="mt-5 flex flex-col gap-3.5">
              {footerLinks.product.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit font-sans text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted">Company</h3>

            <nav className="mt-5 flex flex-col gap-3.5">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit font-sans text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted">Legal</h3>

            <nav className="mt-5 flex flex-col gap-3.5">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit font-sans text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-muted">
            {footerContent.copyright}
          </p>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <p className="font-sans text-sm text-muted">
              {footerContent.status}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;