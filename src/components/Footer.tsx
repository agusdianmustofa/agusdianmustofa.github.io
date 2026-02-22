"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profile`)
      .then(r => r.json())
      .then(setProfile)
      .catch(() => {});
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="#hero" className="text-2xl font-black tracking-tighter mb-6 inline-block">
              <span className="text-[#6366f1]">&lt;</span>AM<span className="text-[#6366f1]">/&gt;</span>
            </Link>
            <p className="text-[#94a3b8] max-w-sm leading-relaxed mb-8">
              {profile?.bio || t('footer_desc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#f1f5f9] font-bold mb-6 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#about" className="text-[#94a3b8] hover:text-[#6366f1] transition-colors">{t('nav_about')}</Link>
              </li>
              <li>
                <Link href="#skills" className="text-[#94a3b8] hover:text-[#6366f1] transition-colors">{t('nav_skills')}</Link>
              </li>
              <li>
                <Link href="#services" className="text-[#94a3b8] hover:text-[#6366f1] transition-colors">{t('nav_services')}</Link>
              </li>
              <li>
                <Link href="#projects" className="text-[#94a3b8] hover:text-[#6366f1] transition-colors">{t('nav_projects')}</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#f1f5f9] font-bold mb-6 text-sm uppercase tracking-widest">{t('nav_services')}</h4>
            <ul className="space-y-4">
              <li className="text-[#94a3b8]">Web Development</li>
              <li className="text-[#94a3b8]">Mobile Applications</li>
              <li className="text-[#94a3b8]">Backend & API</li>
              <li className="text-[#94a3b8]">DevOps & Cloud</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#64748b] text-sm">
            © {currentYear} {profile?.name || 'Agus Mustofa'}. All rights reserved.
          </p>
          <p className="text-[#64748b] text-sm flex items-center gap-2">
            {t('footer_made_with')} <span className="text-red-500">❤️</span> {t('footer_and_coffee')}
          </p>
        </div>
      </div>
    </footer>
  );
}
