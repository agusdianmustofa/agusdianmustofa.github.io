"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import TypingEffect from "./TypingEffect";
import { useLanguage } from "@/context/LanguageContext";

interface HeroProps {
  profile?: {
    name?: string;
    title?: string;
    bio?: string;
    heroBio?: string;
    cvUrl?: string;
    yearsExperience?: number;
    contactForm?: boolean;
  } | null;
  stats?: {
    projects: number;
    skills: number;
    testimonials: number;
  };
}

export function Hero({ profile, stats }: HeroProps) {
  const { t, lang } = useLanguage();
  const showContact = profile?.contactForm !== false;

  const typingWords = lang === 'en' 
    ? ["Full Stack Developer", "Tech Enthusiast", "Problem Solver"]
    : ["Pengembang Full Stack", "Penggemar Teknologi", "Pemecah Masalah"];

  const statsData = stats || { projects: 0, skills: 0, testimonials: 0 };

  return (
    <section className="min-h-[100vh] flex items-center pt-32 pb-20 relative z-10 overflow-hidden" id="hero">
      <div className="container grid md:grid-cols-2 gap-[60px] items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-mono text-[#6366f1] text-sm mb-2 font-medium">{t('hero_greeting')}</p>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #fff 0%, #c7d2fe 50%, #a78bfa 100%)' }}>
            {profile?.name || 'Agus Mustofa'}
          </h1>
          <div className="flex items-center gap-2 text-xl md:text-2xl mb-8 min-h-[40px]">
            <span className="text-[#94a3b8]">{t('hero_prefix')}</span>
            <TypingEffect words={typingWords} />
          </div>
          <p className="text-[#94a3b8] text-lg max-w-[520px] mb-10 leading-relaxed">
            {profile?.heroBio || profile?.bio || t('hero_desc')}
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            {profile?.cvUrl ? (
              <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl font-bold">
                {t('hero_btn_cv')} <ChevronRight size={20} />
              </a>
            ) : (
              <a href="#projects" className="btn-primary flex items-center gap-2 px-8 py-4 rounded-xl font-bold">
                {t('hero_btn_projects')} <ChevronRight size={20} />
              </a>
            )}
            {showContact && (
              <a href="#contact" className="btn-outline flex items-center gap-2 px-8 py-4 rounded-xl font-bold border-2 border-[#6366f1] text-[#6366f1]">
                {t('hero_btn_contact')}
              </a>
            )}
          </div>

          <div className="flex gap-10">
            {[
              { label: t('stat_projects'), value: statsData.projects || "0", plus: "+" },
              { label: t('stat_clients'), value: statsData.testimonials || "0", plus: "+" },
              { label: t('stat_years'), value: String(profile?.yearsExperience || 5), plus: "+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <span className="block text-3xl font-extrabold text-[#6366f1]">
                  {stat.value}
                  <small className="text-[#8b5cf6] text-xl ml-0.5">{stat.plus}</small>
                </span>
                <span className="block text-[0.7rem] text-[#64748b] mt-1 font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative hidden md:block"
        >
          <div className="glass-card overflow-hidden animate-float">
            <div className="flex items-center gap-3 px-5 py-4 bg-black/30 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="font-mono text-[0.7rem] text-[#64748b]">developer.js</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <pre className="text-left">
                <code>
                  <span className="text-[#c792ea]">const</span>{" "}
                  <span className="text-[#82aaff]">developer</span> = {"{"}
                  {"\n  "}<span className="text-[#f78c6c]">name</span>: <span className="text-[#c3e88d]">&quot;{profile?.name || 'Agus Mustofa'}&quot;</span>,
                  {"\n  "}<span className="text-[#f78c6c]">role</span>: <span className="text-[#c3e88d]">&quot;{profile?.title || 'Full Stack Dev'}&quot;</span>,
                  {"\n  "}<span className="text-[#f78c6c]">skills</span>: [
                  {"\n    "}<span className="text-[#c3e88d]">&quot;React&quot;</span>, <span className="text-[#c3e88d]">&quot;Node.js&quot;</span>,
                  {"\n    "}<span className="text-[#c3e88d]">&quot;Go&quot;</span>, <span className="text-[#c3e88d]">&quot;Docker&quot;</span>
                  {"\n  "}],
                  {"\n  "}<span className="text-[#f78c6c]">passionate</span>: <span className="text-[#ff5370]">true</span>,
                  {"\n  "}<span className="text-[#82aaff]">build</span>() {"{"}
                  {"\n    "}<span className="text-[#c792ea]">return</span> <span className="text-[#c3e88d]">&quot;Amazing Apps&quot;</span>;
                  {"\n  "}
                  {"}"}
                  {"\n"}
                  {"}"};
                </code>
              </pre>
            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
