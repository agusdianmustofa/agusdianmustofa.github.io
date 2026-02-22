'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Search, Moon, Bell, Menu, ChevronRight, LogOut } from 'lucide-react';
import { fetchMe, fetchOverviewStats } from '@/lib/api';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    }

    if (token) {
      fetchMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        });
      
      fetchOverviewStats()
        .then((stats: any) => setUnreadCount(stats.unreadMessages || 0))
        .catch(() => {});
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isMounted) return null;

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-[var(--bg-primary)]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <AdminSidebar />
      
      <main className="ml-[260px] min-h-screen transition-all duration-250">
        {/* Top Header */}
        <header className="sticky top-0 h-16 flex items-center justify-between px-7 bg-[var(--bg-primary)]/85 backdrop-blur-xl border-b border-[var(--border-color)] z-50">
          <div className="flex items-center gap-4">
            <button className="hidden md:p-1.5">
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-2 text-[0.9rem] text-[var(--text-muted)]">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span className="font-semibold text-[var(--text-primary)]">Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[0.85rem] text-[var(--text-primary)] w-56 focus:outline-none focus:border-[var(--accent-primary)] focus:w-72 transition-all duration-250"
              />
            </div>
            <button 
              onClick={() => router.push('/admin/messages')}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[var(--border-color)] transition-all text-[var(--text-secondary)] border border-white/5"
              title="Messages"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 group transition-all text-[var(--text-secondary)] border border-white/5"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            {/* <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-[var(--border-color)] transition-all cursor-default">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-bold text-xs text-white">
                {user ? getInitials(user.fullName) : 'AM'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                  {user ? user.fullName : 'Admin'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] leading-tight">
                  {user ? user.role : 'Administrator'}
                </span>
              </div>
            </div> */}
          </div>
        </header>

        <div className="p-7">
          {children}
        </div>
      </main>
    </div>
  );
}
