"use client";

import { motion } from "framer-motion";
import { Monitor, Smartphone, Database, CloudCog, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ICON_MAP: any = {
  monitor: Monitor,
  smartphone: Smartphone,
  database: Database,
  'cloud-cog': CloudCog,
};

export function Services({ services }: { services: any[] }) {
  const { t } = useLanguage();
  if (!services) return null;

  return (
    <section id="services" className="relative overflow-hidden">
      <div className="container">
        <div className="text-center mb-16">
          <span className="section-tag">{t('services_tag')}</span>
          <h2 className="section-title">{t('services_title')}</h2>
          <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">{t('services_subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, idx) => {
            const Icon = ICON_MAP[service.icon] || Monitor;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-10 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center mb-8 text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)]">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-[#94a3b8] text-[0.95rem] mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature: string, fidx: number) => (
                    <li key={fidx} className="flex items-center gap-3 text-sm text-[#94a3b8]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
