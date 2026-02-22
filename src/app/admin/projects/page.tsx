'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Eye as EyeIcon, 
  Trash2, 
  Layout, 
  Smartphone, 
  Database, 
  ShoppingCart,
  HeartPulse,
  Wallet,
  Kanban,
  Utensils,
  Bot,
  X,
  ExternalLink,
  Github
} from 'lucide-react';
import { fetchProjects, createProject, updateProject, deleteProject } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<string, any> = {
  'shopping-cart': ShoppingCart,
  'heart-pulse': HeartPulse,
  'wallet': Wallet,
  'kanban': Kanban,
  'utensils': Utensils,
  'bot': Bot,
  'monitor': Layout,
  'smartphone': Smartphone,
  'database': Database,
};

const categoryIcons: Record<string, any> = {
  'web': Layout,
  'mobile': Smartphone,
  'api': Database,
};

const projectGradients: Record<string, string> = {
  'shopnest': 'linear-gradient(135deg, #667eea, #764ba2)',
  'fittrack': 'linear-gradient(135deg, #f093fb, #f5576c)',
  'payflow': 'linear-gradient(135deg, #4facfe, #00f2fe)',
  'taskboard': 'linear-gradient(135deg, #43e97b, #38f9d7)',
  'fooddash': 'linear-gradient(135deg, #fa709a, #fee140)',
  'chatgenius': 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
};

const defaultGradients = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
];

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  techStack: string[];
  imageUrl?: string;
  gradient?: string;
  liveUrl?: string;
  githubUrl?: string;
  status: string;
  featured: boolean;
  order: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'web',
    techStack: '',
    imageUrl: '',
    gradient: defaultGradients[0],
    liveUrl: '',
    githubUrl: '',
    status: 'live',
    featured: false,
    order: 0,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category,
        techStack: project.techStack.join(', '),
        imageUrl: project.imageUrl || '',
        gradient: project.gradient || defaultGradients[0],
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        status: project.status,
        featured: project.featured,
        order: project.order,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        category: 'web',
        techStack: '',
        imageUrl: '',
        gradient: defaultGradients[0],
        liveUrl: '',
        githubUrl: '',
        status: 'live',
        featured: false,
        order: projects.length,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const projectData = {
        title: formData.title,
        slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        category: formData.category,
        techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean),
        imageUrl: formData.imageUrl || undefined,
        gradient: formData.gradient,
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        status: formData.status,
        featured: formData.featured,
        order: formData.order,
      };

      if (editingProject) {
        await updateProject(editingProject.id, projectData);
      } else {
        await createProject(projectData);
      }

      await loadProjects();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project');
    }
  };

  if (loading) return <div className="p-20 text-center text-[var(--text-muted)]">Loading projects...</div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Projects</h1>
          <p className="text-[var(--text-secondary)] text-[0.9rem] mt-1">Manage your portfolio projects and technical details.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[0.88rem] bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f140] hover:-translate-y-0.5 transition-all"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-6 border-b border-[var(--border-color)] flex flex-wrap justify-between items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-primary)] w-64 focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
          <div className="flex gap-2.5">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="web">Web App</option>
              <option value="mobile">Mobile</option>
              <option value="api">Backend/API</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="live">Live</option>
              <option value="progress">In Progress</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="p-4 pl-6 text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Project</th>
                <th className="p-4 text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Category</th>
                <th className="p-4 text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Tech Stack</th>
                <th className="p-4 text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Status</th>
                <th className="p-4 pr-6 text-right text-[0.75rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              <AnimatePresence>
                {filteredProjects.map((project, i) => {
                  const CategoryIcon = categoryIcons[project.category] || Layout;
                  const gradient = project.gradient || projectGradients[project.slug] || defaultGradients[i % defaultGradients.length];
                  
                  return (
                    <motion.tr 
                      key={project.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-[#6366f108] transition-all group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: gradient }}>
                            <CategoryIcon size={18} className="text-white" />
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-[0.9rem] truncate">{project.title}</span>
                            <span className="block text-[0.75rem] text-[var(--text-muted)] truncate">{project.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#6366f11a] text-[var(--accent-primary)] text-[0.75rem] font-bold capitalize">
                          {project.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.slice(0, 3).map((tech: string) => (
                            <span key={tech} className="px-2 py-0.5 rounded bg-[#94a3b814] text-[var(--text-secondary)] text-[0.7rem] font-medium">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="px-2 py-0.5 rounded bg-[#94a3b814] text-[var(--text-secondary)] text-[0.7rem] font-medium">
                              +{project.techStack.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[0.72rem] font-bold ${
                          project.status === 'live' ? 'bg-[#22c55e1a] text-[#22c55e]' :
                          project.status === 'progress' ? 'bg-[#f59e0b1a] text-[#f59e0b]' :
                          'bg-[var(--border-color)] text-[var(--text-secondary)]'
                        }`}>
                          {project.status === 'live' ? 'Live' : 
                           project.status === 'progress' ? 'In Progress' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-2 outline-none">
                          <button 
                            onClick={() => handleOpenModal(project)}
                            className="p-2 rounded-lg hover:bg-[#6366f11a] hover:text-[var(--text-primary)] text-[var(--text-muted)] transition-all" 
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          {project.liveUrl && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-[#6366f11a] hover:text-[var(--text-primary)] text-[var(--text-muted)] transition-all" 
                              title="View Live"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg hover:bg-[#6366f11a] hover:text-[var(--text-primary)] text-[var(--text-muted)] transition-all" 
                              title="GitHub"
                            >
                              <Github size={16} />
                            </a>
                          )}
                          <button 
                            onClick={() => handleDelete(project.id)}
                            className="p-2 rounded-lg hover:bg-[#ef44441a] hover:text-[#ef4444] text-[var(--text-muted)] transition-all" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center text-[var(--text-muted)]">
            No projects found. Add your first project!
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
                <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-[var(--border-color)] rounded-lg transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="my-project"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      <option value="web">Web App</option>
                      <option value="mobile">Mobile</option>
                      <option value="api">Backend/API</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      <option value="live">Live</option>
                      <option value="progress">In Progress</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Gradient</label>
                  <div className="flex flex-wrap gap-2">
                    {defaultGradients.map((grad, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, gradient: grad })}
                        className={`w-10 h-10 rounded-lg border-2 ${formData.gradient === grad ? 'border-white' : 'border-transparent'}`}
                        style={{ background: grad }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Live URL</label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://myproject.com"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/user/repo"
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)]"
                  />
                  <label htmlFor="featured" className="text-[0.85rem] text-[var(--text-secondary)]">Featured project</label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 rounded-lg font-semibold text-[0.88rem] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg font-semibold text-[0.88rem] bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] text-white disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
