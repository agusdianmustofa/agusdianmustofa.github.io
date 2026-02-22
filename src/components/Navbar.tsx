"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar({ contactForm, showTestimonials }: { contactForm?: boolean; showTestimonials?: boolean }) {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showContact = contactForm !== false;
  const showTesti = showTestimonials !== false;

  const NAV_LINKS = [
    { name: t('nav_about'), href: "#about" },
    { name: t('nav_skills'), href: "#skills" },
    { name: t('nav_services'), href: "#services" },
    { name: t('nav_projects'), href: "#projects" },
    ...(showTesti ? [{ name: t('nav_testimonials'), href: "#testimonials" as const }] : []),
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled
          ? "bg-[#0a0e1a]/90 backdrop-blur-xl border-b border-white/10 py-3"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter">
          <span className="text-[#6366f1]">&lt;</span>AM<span className="text-[#6366f1]">/&gt;</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#6366f1]/10 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-white/10 mx-2" />
          <LanguageSwitcher />
          {showContact && (
            <>
              <div className="h-6 w-px bg-white/10 mx-2" />
              <Link
                href="#contact"
                className="btn-primary px-5 py-2 rounded-lg text-sm font-semibold"
              >
                {t('nav_contact')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle & Switcher */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSwitcher />
          <button
            className="p-2 text-[#f1f5f9]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0e1a] border-b border-white/10 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[#94a3b8] text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {showContact && (
            <Link
              href="#contact"
              className="btn-primary w-full text-center py-3 rounded-xl font-bold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav_contact')}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
