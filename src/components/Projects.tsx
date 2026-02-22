"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, Github, ExternalLink, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export function Projects({ initialProjects }: { initialProjects: any[] }) {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState("all");

  const CATEGORIES = [
    { id: "all", name: t('projects_all') },
    { id: "web", name: lang === 'en' ? "Web Apps" : "Aplikasi Web" },
    { id: "mobile", name: lang === 'en' ? "Mobile" : "Seluler" },
    { id: "api", name: lang === 'en' ? "Backend/API" : "Backend/API" },
  ];

  const filteredProjects = initialProjects.filter(
    (p) => filter === "all" || p.category === filter
  );

  return (
    <section id="projects" className="relative overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="section-tag">{t('projects_tag')}</span>
            <h2 className="section-title">{t('projects_title')}</h2>
            <p className="text-[#94a3b8] text-lg max-w-xl">{t('projects_subtitle')}</p>
          </div>
          
          <div className="flex gap-2 bg-[#111827]/40 p-1.5 rounded-xl border border-[var(--border-color)] overflow-x-auto max-w-full backdrop-blur-xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={cn(
                  "px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                  filter === cat.id
                    ? "bg-[var(--accent-gradient)] text-white shadow-lg shadow-[#6366f140]"
                    : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-card group h-full flex flex-col overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500" style={{ 
                  background: project.category === 'web' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                              project.category === 'mobile' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                }}>
                  <div className="flex flex-col items-center gap-3 text-white/40 group-hover:text-white/20 transition-colors duration-300">
                    <Folder size={48} />
                    <span className="text-xs font-bold uppercase tracking-widest">{project.category}</span>
                  </div>
                   
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-[#0a0e1a]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-5">
                      <a href={project.liveUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#6366f1] transition-all hover:scale-110">
                        <ExternalLink size={20} className="text-white" />
                      </a>
                      <a href={project.githubUrl || "#"} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#6366f1] transition-all hover:scale-110">
                        <Github size={20} className="text-white" />
                      </a>
                   </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[#6366f1] transition-colors">{project.title}</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.techStack.map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-indigo-500/5 text-[#6366f1] text-[0.65rem] font-bold rounded-lg border border-indigo-500/10">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
