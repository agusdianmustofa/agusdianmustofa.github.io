import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fetchMe, fetchOverviewStats } from '@/lib/api';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Mail, 
  Code2, 
  MessageSquareQuote, 
  Briefcase, 
  Settings, 
  BarChart3, 
  ExternalLink,
  Bell,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Main', isLabel: true },
  { label: 'Overview', icon: LayoutDashboard, href: '/admin', page: 'overview' },
  { label: 'Projects', icon: FolderKanban, href: '/admin/projects', page: 'projects', countKey: 'projects' },
  { label: 'Messages', icon: Mail, href: '/admin/messages', page: 'messages', countKey: 'unreadMessages', countAccent: true },
  { label: 'Content', isLabel: true },
  { label: 'Skills', icon: Code2, href: '/admin/skills', page: 'skills', countKey: 'skills' },
  { label: 'Testimonials', icon: MessageSquareQuote, href: '/admin/testimonials', page: 'testimonials', countKey: 'testimonials' },
  { label: 'Services', icon: Briefcase, href: '/admin/services', page: 'services', countKey: 'services' },
  { label: 'System', isLabel: true },
  { label: 'Settings', icon: Settings, href: '/admin/settings', page: 'settings' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics', page: 'analytics' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [darkMode, setDarkMode] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => setUser(null));
    
    const interval = setInterval(() => {
      fetchOverviewStats()
        .then((data) => {
          setCounts(data);
          if (data.unreadMessages > 0 && pathname !== '/admin/messages') {
            setHasNewMessage(true);
          }
        })
        .catch(() => {});
    }, 30000);

    fetchOverviewStats()
      .then(setCounts)
      .catch(() => {});

    return () => clearInterval(interval);
  }, [pathname]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const getCount = (item: typeof navItems[number]) => {
    if (!item.countKey) return undefined;
    return counts[item.countKey] || 0;
  };

  return (
    <aside className="fixed top-0 left-0 w-[260px] h-screen bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col z-[100]">
      <div className="flex items-center justify-between p-5 pb-4 border-b border-[var(--border-color)]">
        <Link href="/" className="text-[1.4rem] font-extrabold flex items-center gap-1">
          <span className="text-[var(--accent-primary)]">&lt;</span>AM<span className="text-[var(--accent-primary)]">/&gt;</span>
        </Link>
         <div className="flex items-center gap-2">
        {/* <Link 
          href="/admin/messages" 
          className="relative p-1.5 rounded-lg hover:bg-[var(--accent-primary)]/10 transition-all"
          onClick={() => setHasNewMessage(false)}
        >
          <Bell size={18} className="text-[var(--text-secondary)]" />
          {hasNewMessage && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full border border-[var(--bg-primary)]"></span>
          )}
        </Link> */}
        <button 
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-[var(--accent-primary)]/10 transition-all"
        >
          {darkMode ? <Sun size={18} className="text-[var(--text-secondary)]" /> : <Moon size={18} className="text-[var(--text-secondary)]" />}
        </button>
        </div>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto skill-scrollbar">
        {navItems.map((item, idx) => {
          if (item.isLabel) {
            return (
              <span key={idx} className="block text-[0.7rem] font-bold uppercase tracking-widest text-[var(--text-muted)] px-3 pt-4 pb-2">
                {item.label}
              </span>
            );
          }

          if (!item.href || !item.icon) return null;

          const Icon = item.icon;
          const count = getCount(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all mb-0.5",
                pathname === item.href 
                  ? "bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent-primary)]/40" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10"
              )}
            >
              <Icon size={20} className="shrink-0" />
              <span>{item.label}</span>
              {count !== undefined && count > 0 && (
                <span className={cn(
                  "ml-auto text-[0.75rem] font-bold px-2 py-0.5 rounded-full",
                  pathname === item.href 
                    ? "bg-white/20 text-white" 
                    : item.countAccent 
                      ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]" 
                      : "bg-[var(--border-color)] text-[var(--text-muted)]"
                )}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--accent-primary)]/10 mb-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-bold text-xs text-white shrink-0">
            {user?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'AM'}
          </div>
          <div className="min-w-0">
            <span className="block text-[0.85rem] font-semibold truncate">{user?.fullName || 'Loading...'}</span>
            <span className="block text-[0.73rem] text-[var(--text-muted)] truncate">{user?.role || '...'}</span>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
          <ExternalLink size={20} className="shrink-0" />
          <span>View Site</span>
        </Link>
      </div>
    </aside>
  );
}
