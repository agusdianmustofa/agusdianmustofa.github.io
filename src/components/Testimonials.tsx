"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Testimonials({ testimonials }: { testimonials: any[] }) {
  const { t } = useLanguage();
  if (!testimonials) return null;

  return (
    <section id="testimonials" className="relative">
      <div className="container">
        <div className="text-center mb-16">
          <span className="section-tag">{t('testimonials_tag')}</span>
          <h2 className="section-title">{t('testimonials_title')}</h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">{t('testimonials_subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 relative"
            >
              <div className="absolute top-10 right-10 text-[#6366f1]/10">
                <Quote size={80} />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" className="text-[#f59e0b]" />
                ))}
              </div>

              <p className="text-[#f1f5f9] text-lg italic mb-10 leading-relaxed relative z-10">
                &quot;{item.text}&quot;
              </p>

              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
                  style={{ background: item.avatarBg || "var(--accent-gradient)" }}
                >
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-bold text-[#f1f5f9]">{item.name}</h4>
                  <p className="text-[#64748b] text-sm font-medium">{item.role} @ {item.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
