"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "./logo";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Contact", href: "/contacts" },
];

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6">
      <div className="mx-auto flex min-h-20 w-full max-w-[1200px] items-center justify-between rounded-full border border-border px-4 shadow-lg backdrop-blur sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center lg:flex">
          <nav className="flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap font-sans text-sm font-medium text-foreground hover:text-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-6 flex shrink-0 items-center gap-2.5 xl:ml-10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleNavigation("/auth/login")}
              className="font-sans text-foreground hover:text-primary"
            >
              Login
            </Button>

            <Button
              type="button"
              onClick={() => handleNavigation("/auth/signin")}
              className="bg-primary font-sans text-foreground hover:bg-primary-dark"
            >
              Sign Up
            </Button>
          </div>
        </div>

        <div className="shrink-0 lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="h-10 w-10 border-border bg-foreground font-sans text-text hover:bg-secondary"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-2 w-full max-w-[1200px] border border-border bg-foreground/90 px-4 pb-5 pt-2 shadow-lg backdrop-blur-md sm:px-6 lg:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-border px-2 py-3.5 font-sans text-sm font-medium text-text transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNavigation("/auth/login")}
              className="flex-1 border-border font-sans text-primary hover:bg-primary-light hover:text-primary"
            >
              Login
            </Button>

            <Button
              type="button"
              onClick={() => handleNavigation("/auth/signin")}
              className="flex-1 bg-primary font-sans text-foreground hover:bg-primary-dark"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
