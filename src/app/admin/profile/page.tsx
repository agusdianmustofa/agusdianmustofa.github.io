'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram,
  Save,
  Link as LinkIcon
} from 'lucide-react';
import { fetchProfile } from '@/lib/api';
import { motion } from 'framer-motion';

export default function AdminProfile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchProfile();
        setData(result);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-20 text-center text-[#64748b]">Loading profile...</div>;
  if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

  const profile = data?.profile;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Profile Settings</h1>
          <p className="text-[var(--text-secondary)] text-[0.9rem] mt-1">Manage your professional information and social presence.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[0.88rem] bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f140] hover:-translate-y-0.5 transition-all">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-[var(--accent-primary)]" /> Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={profile?.name}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[0.9rem] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Job Title</label>
                <input 
                  type="text" 
                  defaultValue={profile?.title}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[0.9rem] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
                  <input 
                    type="email" 
                    defaultValue={profile?.email}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-12 pr-4 py-3 text-[0.9rem] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
                  <input 
                    type="text" 
                    defaultValue={profile?.phone}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-12 pr-4 py-3 text-[0.9rem] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Professional Bio</label>
                <textarea 
                  defaultValue={profile?.bio}
                  rows={4}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[0.9rem] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                />
              </div>
              <div className="space-y-2 text-wrap">
                <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
                  <input 
                    type="text" 
                    defaultValue={profile?.location}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-12 pr-4 py-3 text-[0.9rem] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 backdrop-blur-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <LinkIcon size={20} className="text-[var(--accent-primary)]" /> Social Presence
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'GitHub', icon: Github, key: 'github' },
                { label: 'LinkedIn', icon: Linkedin, key: 'linkedin' },
                { label: 'Twitter', icon: Twitter, key: 'twitter' },
                { label: 'Instagram', icon: Instagram, key: 'instagram' },
              ].map((social) => (
                <div key={social.key} className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#64748b]">{social.label}</label>
                  <div className="relative">
                    <social.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
                    <input 
                      type="url" 
                      defaultValue={profile?.[social.key]}
                      placeholder={`https://${social.label.toLowerCase()}.com/username`}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-12 pr-4 py-3 text-[0.9rem] focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] mx-auto flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-[#6366f140] mb-4">
              AM
            </div>
            <h4 className="font-bold text-lg">{profile?.name}</h4>
            <p className="text-[#64748b] text-sm mb-6">{profile?.title}</p>
            <button className="w-full py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-bold text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-all">
              Change Avatar
            </button>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl">
            <h4 className="font-bold mb-4">Quick Stats</h4>
            <div className="space-y-4">
              {[
                { label: 'Skills Added', val: data.skills?.length || 0 },
                { label: 'Services Offered', val: data.services?.length || 0 },
                { label: 'Testimonials', val: data.testimonials?.length || 0 },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)]">{stat.label}</span>
                  <span className="font-bold text-[var(--accent-primary)]">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
