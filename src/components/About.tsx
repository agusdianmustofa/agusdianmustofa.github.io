"use client";

import { motion } from "framer-motion";
import { User, Mail, MapPin, Briefcase, Download } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/context/LanguageContext";

interface AboutProps {
  profile?: {
    name?: string;
    title?: string;
    bio?: string;
    heroBio?: string;
    aboutText?: string;
    location?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    status?: string;
    education?: string;
    languages?: string;
    cvUrl?: string;
    contactForm?: boolean;
  } | null;
}

export function About({ profile }: AboutProps) {
  const { t } = useLanguage();
  const showContact = profile?.contactForm !== false;
  if (!profile) return null;

  return (
    <section id="about" className="relative overflow-hidden bg-[var(--bg-secondary)]">
      <div className="container">
        <div className="text-center md:text-left mb-16">
          <span className="section-tag">{t('about_tag')}</span>
          <h2 className="section-title">{t('about_title')}</h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl">{profile.heroBio || t('about_subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="max-w-[350px] mx-auto relative group">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name || 'Profile'} 
                  className="w-full aspect-square object-cover rounded-[28px] border-4 border-[var(--accent-primary)]/30"
                />
              ) : (
                <div className="aspect-square bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-[28px] flex items-center justify-center relative z-10">
                  <User size={120} className="text-white/80 transition-transform duration-500 group-hover:scale-110" />
                </div>
              )}
              {/* Pulsing Border Decoration */}
              <div className="absolute -inset-3 border-2 border-[#6366f1] rounded-[28px] opacity-30 -z-10 animate-pulse-slow" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold">{profile.title || t('about_heading')}</h3>
            <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-lg">
              {profile.aboutText ? (
                profile.aboutText.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <>
                  {/* <p>{profile.bio || t('about_p1')}</p> */}
                  <p>{t('about_p2')}</p>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
              {[
                { icon: MapPin, label: t('about_label_location'), value: profile.location || 'Indonesia' },
                { icon: Briefcase, label: t('about_label_status'), value: profile.status || t('about_value_status'), valClass: "text-[#22c55e]" },
                { icon: User, label: t('about_label_education'), value: profile.education || t('about_value_education') },
                { icon: Mail, label: t('about_label_languages'), value: profile.languages || "ID, EN" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 glass-card">
                  <div className="w-10 h-10 rounded-lg bg-[#6366f11a] flex items-center justify-center text-[#6366f1]">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <span className="block text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider font-bold">{item.label}</span>
                    <span className={cn("text-sm font-bold text-[var(--text-primary)]", item.valClass)}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {profile.cvUrl ? (
              <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                <Download size={20} /> {t('hero_btn_cv')}
              </a>
            ) : showContact ? (
              <a href="#contact" className="btn-primary inline-flex items-center gap-2">
                <Download size={20} /> Download CV
              </a>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
