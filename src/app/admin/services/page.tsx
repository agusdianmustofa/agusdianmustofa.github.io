'use client';

import { useState, useEffect } from 'react';
import { adminRequest } from '@/lib/api';
import { Plus, Trash2, Edit2, Loader2, Monitor, Smartphone, Database, CloudCog } from 'lucide-react';

const ICON_OPTIONS = [
  { id: 'monitor', icon: Monitor },
  { id: 'smartphone', icon: Smartphone },
  { id: 'database', icon: Database },
  { id: 'cloud-cog', icon: CloudCog },
];

export default function ServicesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'monitor',
    features: [''],
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await adminRequest('/services');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
      };

      if (editingItem) {
        await adminRequest(`/services/${editingItem.id}`, {
          method: 'PATCH',
          body: JSON.stringify(cleanData),
        });
      } else {
        await adminRequest('/services', {
          method: 'POST',
          body: JSON.stringify(cleanData),
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ title: '', description: '', icon: 'monitor', features: [''] });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await adminRequest(`/services/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      icon: item.icon || 'monitor',
      features: item.features?.length ? item.features : [''],
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#6366f1]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Services</h1>
          <p className="text-[#64748b]">What you offer to your clients</p>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); setEditingItem(null); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] text-white rounded-xl font-bold hover:bg-[#4f46e5] transition-all"
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => {
          const IconComp = ICON_OPTIONS.find(o => o.id === item.icon)?.icon || Monitor;
          return (
            <div key={item.id} className="glass-card p-8 flex flex-col group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center text-white shadow-lg">
                  <IconComp size={28} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 bg-white/5 hover:bg-[#6366f11a] hover:text-[#6366f1] rounded-lg transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-[#94a3b8] text-sm mb-6 leading-relaxed">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.features?.map((f: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-white/5 text-[0.7rem] text-[#64748b] rounded-lg border border-white/5">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[600px] glass-card p-8 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-6">{editingItem ? 'Edit Service' : 'New Service'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white appearance-none"
                  >
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id} className="bg-[var(--bg-secondary)]">{opt.id}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white resize-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Features</label>
                  <button 
                    type="button" 
                    onClick={handleAddFeature}
                    className="text-[0.7rem] font-bold text-[#6366f1] hover:underline"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 skill-scrollbar">
                  {formData.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        className="flex-1 p-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white"
                        placeholder="Feature name..."
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#6366f1] text-white rounded-xl font-bold hover:bg-[#4f46e5] transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
