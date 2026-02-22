"use client";

import { motion } from "framer-motion";
import { Code2, Server, Terminal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Skills({ skills }: { skills: any[] }) {
  const { t, lang } = useLanguage();
  if (!skills) return null;

  const categories = [
    { id: "frontend", name: lang === 'en' ? "Frontend Development" : "Pengembangan Frontend", icon: Code2 },
    { id: "backend", name: lang === 'en' ? "Backend Engineering" : "Rekayasa Backend", icon: Server },
    { id: "devops", name: lang === 'en' ? "Cloud & DevOps" : "Cloud & DevOps", icon: Terminal },
  ];

  return (
    <section id="skills" className="relative overflow-hidden">
      <div className="container">
        <div className="text-center mb-16">
          <span className="section-tag">{t('skills_tag')}</span>
          <h2 className="section-title">{t('skills_title')}</h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">{t('skills_subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-10 group"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-[#6366f11a] flex items-center justify-center text-[#6366f1] group-hover:scale-110 group-hover:bg-[#6366f1] group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold">{cat.name}</h3>
                </div>

                <div className="space-y-8">
                  {skills
                    .filter((s) => s.category === cat.id)
                    .map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between mb-2">
                          <span className="text-[0.9rem] font-medium text-[#94a3b8]">{skill.name}</span>
                          <span className="text-[0.9rem] font-bold text-[#6366f1] font-mono">{skill.percent}%</span>
                        </div>
                        <div className="h-2 w-full bg-indigo-500/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.percent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
