'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  User, 
  Link2, 
  Palette, 
  Bell, 
  Shield, 
  Key,
  Eye,
  EyeOff,
  Check,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  cvUrl: string;
  yearsExperience: number;
  avatarUrl: string;
  status: string;
  education: string;
  languages: string;
  heroBio: string;
  aboutText: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  maintenanceMode: boolean;
  contactForm: boolean;
  emailNotifications: boolean;
  showTestimonials: boolean;
}

interface Settings {
  maintenanceMode: boolean;
  contactForm: boolean;
  emailNotifications: boolean;
  showTestimonials: boolean;
}

export default function AdminSettings() {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    cvUrl: '',
    yearsExperience: 5,
    avatarUrl: '',
    status: '',
    education: '',
    languages: '',
    heroBio: '',
    aboutText: '',
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    maintenanceMode: false,
    contactForm: true,
    emailNotifications: true,
    showTestimonials: true,
  });
  const [settings, setSettings] = useState<Settings>({
    maintenanceMode: false,
    contactForm: true,
    emailNotifications: true,
    showTestimonials: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profile`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          cvUrl: data.cvUrl || '',
          yearsExperience: data.yearsExperience || 5,
          avatarUrl: data.avatarUrl || '',
          status: data.status || '',
          education: data.education || '',
          languages: data.languages || '',
          heroBio: data.heroBio || '',
          aboutText: data.aboutText || '',
          github: data.github || '',
          linkedin: data.linkedin || '',
          twitter: data.twitter || '',
          instagram: data.instagram || '',
          maintenanceMode: data.maintenanceMode ?? false,
          contactForm: data.contactForm ?? true,
          emailNotifications: data.emailNotifications ?? true,
          showTestimonials: data.showTestimonials ?? true,
        });
        setSettings(prev => ({
          ...prev,
          maintenanceMode: data.maintenanceMode ?? false,
        }));
      }
    } catch (err) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/profile`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error('Save failed:', res.status);
        alert('Failed to save');
      }
    } catch (err) {
      console.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Passwords do not match');
      return;
    }
    if (passwordData.new.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new,
        }),
      });
      
      if (res.ok) {
        alert('Password changed successfully!');
        setPasswordData({ current: '', new: '', confirm: '' });
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to change password');
      }
    } catch (err) {
      alert('Failed to change password');
    }
  };

  if (loading) return <div className="p-20 text-center text-[var(--text-muted)]">Loading settings...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Settings</h1>
          <p className="text-[var(--text-secondary)] text-[0.9rem] mt-1">Manage your profile and site preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[0.88rem] bg-gradient-to-br from-[var(--accent-primary)] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f140] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* Profile Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-lg bg-[#6366f11a] flex items-center justify-center text-[var(--accent-primary)]">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Profile Information</h3>
              <p className="text-[0.75rem] text-[var(--text-muted)]">Your personal details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div>
                <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Title / Role</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
              />
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Hero Bio (Home)</label>
              <textarea
                value={profile.heroBio || ''}
                onChange={(e) => setProfile({ ...profile, heroBio: e.target.value })}
                rows={3}
                placeholder="Building elegant, performant, and scalable digital solutions..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
              />
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">About Text (Home)</label>
              <textarea
                value={profile.aboutText || ''}
                onChange={(e) => setProfile({ ...profile, aboutText: e.target.value })}
                rows={4}
                placeholder="My specialization includes full-stack web development..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div>
                <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Status</label>
                <input
                  type="text"
                  value={profile.status || ''}
                  onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                  placeholder="Available for Hire"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div>
                <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Education</label>
                <input
                  type="text"
                  value={profile.education || ''}
                  onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                  placeholder="BS in Informatics"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Languages</label>
              <input
                type="text"
                value={profile.languages || ''}
                onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
                placeholder="English, Indonesian"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Avatar URL</label>
              <input
                type="url"
                value={profile.avatarUrl || ''}
                onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  value={profile.yearsExperience || 5}
                  onChange={(e) => setProfile({ ...profile, yearsExperience: parseInt(e.target.value) || 5 })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
              <div>
                <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">CV URL</label>
                <input
                  type="url"
                  value={profile.cvUrl || ''}
                  onChange={(e) => setProfile({ ...profile, cvUrl: e.target.value })}
                  placeholder="https://example.com/cv.pdf"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-lg bg-[#22c55e1a] flex items-center justify-center text-[#22c55e]">
              <Link2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Social Links</h3>
              <p className="text-[0.75rem] text-[var(--text-muted)]">Your social media profiles</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">GitHub</label>
              <input
                type="url"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">LinkedIn</label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Twitter / X</label>
              <input
                type="url"
                value={profile.twitter}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                placeholder="https://x.com/username"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Instagram</label>
              <input
                type="url"
                value={profile.instagram}
                onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                placeholder="https://instagram.com/username"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
        </motion.div>

        {/* Site Preferences */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b1a] flex items-center justify-center text-[#f59e0b]">
              <Palette size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Site Preferences</h3>
              <p className="text-[0.75rem] text-[var(--text-muted)]">Customize your portfolio</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Temporarily disable public access to your site' },
              { key: 'contactForm', label: 'Contact Form', desc: 'Enable contact form on the portfolio page' },
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email when someone submits the contact form' },
              { key: 'showTestimonials', label: 'Show Testimonials', desc: 'Display testimonials section on the portfolio' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <span className="block text-[0.9rem] font-medium text-[var(--text-primary)]">{item.label}</span>
                  <span className="block text-[0.75rem] text-[var(--text-muted)]">{item.desc}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!profile[item.key as keyof ProfileData]}
                    onChange={(e) => setProfile({ ...profile, [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
            <div className="w-10 h-10 rounded-lg bg-[#ef44441a] flex items-center justify-center text-[#ef4444]">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[var(--text-primary)]">Security</h3>
              <p className="text-[0.75rem] text-[var(--text-muted)]">Password and account security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Current Password</label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg pl-10 pr-10 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label className="block text-[0.8rem] font-medium text-[var(--text-secondary)] mb-1.5">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <button 
              onClick={handlePasswordChange}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-[0.88rem] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-all"
            >
              <Key size={16} /> Change Password
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
