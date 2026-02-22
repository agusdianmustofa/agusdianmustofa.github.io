'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Code2, 
  Server, 
  Terminal,
  GripVertical,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Skill {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'devops';
  percent: number;
  order: number;
}

const categoryConfig = {
  frontend: { label: 'Frontend', icon: Code2, color: '#6366f1' },
  backend: { label: 'Backend', icon: Server, color: '#22c55e' },
  devops: { label: 'DevOps', icon: Terminal, color: '#f59e0b' },
};

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ name: '', category: 'frontend' as 'frontend' | 'backend' | 'devops', percent: 80 });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profile/skills`);
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill => {
    if (categoryFilter !== 'all' && skill.category !== categoryFilter) return false;
    if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const groupedSkills = {
    frontend: filteredSkills.filter(s => s.category === 'frontend'),
    backend: filteredSkills.filter(s => s.category === 'backend'),
    devops: filteredSkills.filter(s => s.category === 'devops'),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingSkill 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profile/skills/${editingSkill.id}`
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profile/skills`;
    
    const method = editingSkill ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        loadSkills();
        setShowAddModal(false);
        setEditingSkill(null);
        setFormData({ name: '', category: 'frontend', percent: 80 });
      }
    } catch (err) {
      console.error('Failed to save skill');
    }
  };

  const deleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profile/skills/${id}`, {
        method: 'DELETE',
      });
      loadSkills();
    } catch (err) {
      console.error('Failed to delete skill');
    }
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({ name: skill.name, category: skill.category as 'frontend' | 'backend' | 'devops', percent: skill.percent });
    setShowAddModal(true);
  };

  if (loading) return <div className="p-20 text-center text-[var(--text-muted)]">Loading skills...</div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Skills</h1>
          <p className="text-[var(--text-secondary)] text-[0.9rem] mt-1">Manage your technical skills and expertise levels.</p>
        </div>
        <button 
          onClick={() => {
            setEditingSkill(null);
            setFormData({ name: '', category: 'frontend', percent: 80 });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[0.88rem] bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f140] hover:-translate-y-0.5 transition-all"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = skills.filter(s => s.category === key).length;
          return (
            <div key={key} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${config.color}1a`, color: config.color }}>
                  <Icon size={20} />
                </div>
                <span className="text-2xl font-extrabold text-[var(--text-primary)]">{count}</span>
              </div>
              <span className="text-[0.85rem] font-medium text-[var(--text-secondary)]">{config.label} Skills</span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 backdrop-blur-xl">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Search skills..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-primary)] w-full focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="all">All Categories</option>
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="devops">DevOps</option>
          </select>
        </div>
      </div>

      {/* Skills Grid by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => {
          if (categorySkills.length === 0) return null;
          const config = categoryConfig[category as keyof typeof categoryConfig];
          const Icon = config.icon;
          
          return (
            <div key={category} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden backdrop-blur-xl">
              <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${config.color}1a`, color: config.color }}>
                  <Icon size={16} />
                </div>
                <h3 className="font-bold text-[var(--text-primary)]">{config.label} Development</h3>
                <span className="text-[0.75rem] text-[var(--text-muted)] ml-auto">{categorySkills.length} skills</span>
              </div>
              
              <div className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    layout
                    className="group bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-xl p-4 hover:border-[#6366f14d] transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical size={16} className="text-[var(--text-muted)] cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium text-[var(--text-primary)]">{skill.name}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(skill)}
                          className="p-1.5 rounded-lg hover:bg-[#6366f11a] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => deleteSkill(skill.id)}
                          className="p-1.5 rounded-lg hover:bg-[#ef44441a] text-[var(--text-muted)] hover:text-[#ef4444] transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[0.75rem]">
                        <span className="text-[var(--text-muted)]">Proficiency</span>
                        <span className="font-bold" style={{ color: config.color }}>{skill.percent}%</span>
                      </div>
                      <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.percent}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddModal(false)}
            >
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 rounded-lg hover:bg-[#6366f11a] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[0.85rem] font-medium text-[var(--text-secondary)] mb-2">Skill Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., React, Node.js, Docker"
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[0.9rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[0.85rem] font-medium text-[var(--text-secondary)] mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-[0.9rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="devops">DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.85rem] font-medium text-[var(--text-secondary)] mb-2">
                      Proficiency: {formData.percent}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.percent}
                      onChange={(e) => setFormData({ ...formData, percent: parseInt(e.target.value) })}
                      className="w-full h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-5 py-2.5 rounded-lg font-semibold text-[0.88rem] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-5 py-2.5 rounded-lg font-bold text-[0.88rem] bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f140] hover:-translate-y-0.5 transition-all"
                    >
                      {editingSkill ? 'Save Changes' : 'Add Skill'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
