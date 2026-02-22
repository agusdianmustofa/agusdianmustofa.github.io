"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram, Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Contact() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profile`)
      .then(r => r.json())
      .then(setProfile)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="section-tag">{t('contact_tag')}</span>
              <h2 className="section-title text-left">{t('contact_title')}</h2>
              <p className="text-[#94a3b8] text-lg leading-relaxed">
                {t('contact_subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: <Mail size={20} />, label: "Email", value: profile?.email || "hello@agusmustofa.dev", href: `mailto:${profile?.email || 'hello@agusmustofa.dev'}` },
                { icon: <Phone size={20} />, label: "WhatsApp", value: profile?.phone || "+62 812-3456-789", href: `https://wa.me/${(profile?.phone || '+628123456789').replace(/\D/g,'')}` },
                { icon: <MapPin size={20} />, label: t('about_label_location'), value: profile?.location || "Indonesia" },
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-center group">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-[#6366f1] group-hover:bg-[#6366f1] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#64748b] uppercase tracking-widest">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="text-lg font-bold text-[#f1f5f9] hover:text-[#6366f1] transition-colors">{item.value}</a>
                    ) : (
                      <span className="text-lg font-bold text-[#f1f5f9]">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              {[
                { icon: <Github size={20} />, href: profile?.github || "https://github.com/agusmustofa" },
                { icon: <Linkedin size={20} />, href: profile?.linkedin || "https://linkedin.com/in/agusmustofa" },
                { icon: <Twitter size={20} />, href: profile?.twitter || "https://x.com/agusmustofa" },
                { icon: <Instagram size={20} />, href: profile?.instagram || "https://instagram.com/agusmustofa" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-[#6366f1] hover:border-[#6366f1] transition-all duration-300 group"
                >
                  <div className="group-hover:scale-110 transition-transform duration-300 text-[#94a3b8] group-hover:text-white">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest ml-1">{t('contact_label_name')}</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest ml-1">{t('contact_label_email')}</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest ml-1">{t('contact_label_subject')}</label>
                <input 
                  type="text" 
                  placeholder="Project Inquiry" 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest ml-1">{t('contact_label_message')}</label>
                <textarea 
                  rows={4} 
                  placeholder="Your message here..." 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="w-full px-5 py-4 bg-black/20 border border-white/10 rounded-xl text-[#f1f5f9] focus:outline-none focus:border-[#6366f1] transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading || success}
                className="btn-primary w-full py-5 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Sending... <Loader2 size={20} className="animate-spin" /></>
                ) : success ? (
                  <>Message Sent! <Check size={20} /></>
                ) : (
                  <>{t('contact_btn_send')} <Send size={20} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
