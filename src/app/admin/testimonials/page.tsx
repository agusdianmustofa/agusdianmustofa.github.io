'use client';

import { useState, useEffect } from 'react';
import { adminRequest } from '@/lib/api';
import { Plus, Trash2, Edit2, Loader2, MessageSquareQuote } from 'lucide-react';

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    text: '',
    initials: '',
    avatarBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await adminRequest('/testimonials');
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await adminRequest(`/testimonials/${editingItem.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
      } else {
        await adminRequest('/testimonials', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ name: '', role: '', company: '', text: '', initials: '', avatarBg: 'linear-gradient(135deg, #6366f1, #8b5cf6)' });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await adminRequest(`/testimonials/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      company: item.company,
      text: item.text,
      initials: item.initials || '',
      avatarBg: item.avatarBg || 'linear-gradient(135deg, #6366f1, #8b5cf6)',
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
          <h1 className="text-2xl font-bold mb-2">Testimonials</h1>
          <p className="text-[#64748b]">Manage the praise from your clients</p>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); setEditingItem(null); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] text-white rounded-xl font-bold hover:bg-[#4f46e5] transition-all"
        >
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-6 flex flex-col group">
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg"
                style={{ background: item.avatarBg }}
              >
                {item.initials || (item.name?.[0] || 'T')}
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
            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
            <p className="text-[#64748b] text-sm mb-4">{item.role} @ {item.company}</p>
            <p className="text-[#94a3b8] italic text-sm line-clamp-4">&quot;{item.text}&quot;</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[500px] glass-card p-8 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-6">{editingItem ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Initials</label>
                  <input
                    type="text"
                    value={formData.initials}
                    onChange={(e) => setFormData({ ...formData, initials: e.target.value })}
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Role</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Company</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Text</label>
                <textarea
                  required
                  rows={4}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-white resize-none"
                />
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
