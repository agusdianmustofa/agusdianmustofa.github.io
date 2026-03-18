'use client';

import { useEffect, useState } from 'react';
import { 
  Download, 
  Plus, 
  Eye, 
  Mail, 
  FolderKanban, 
  Clock, 
  TrendingUp, 
  Minus,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { fetchMe, fetchOverviewStats } from '@/lib/api';

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

interface Stats {
  messages: number;
  unreadMessages: number;
  projects: number;
  services: number;
  testimonials: number;
  totalViews: number;
  avgDaily: number;
  weeklyData: { day: string; visitors: number }[];
  trafficSources: { source: string; visits: number; percentage: number }[];
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#a855f7'];

export default function AdminOverview() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    messages: 0,
    unreadMessages: 0,
    projects: 0,
    services: 0,
    testimonials: 0,
    totalViews: 0,
    avgDaily: 0,
    weeklyData: [],
    trafficSources: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(30);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedDays]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, statsData] = await Promise.all([
        fetchMe(),
        fetchOverviewStats(selectedDays)
      ]);
      setUser(userData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.fullName?.split(' ')[0] || 'Admin';

  const trafficSources = stats.trafficSources.length > 0 ? stats.trafficSources : [
    { source: 'Direct', visits: 0, percentage: 0 },
    { source: 'Google', visits: 0, percentage: 0 },
    { source: 'Social', visits: 0, percentage: 0 },
    { source: 'Referral', visits: 0, percentage: 0 },
  ];

  const weeklyData = stats.weeklyData.length > 0 ? stats.weeklyData : [
    { day: 'Mon', visitors: 0 },
    { day: 'Tue', visitors: 0 },
    { day: 'Wed', visitors: 0 },
    { day: 'Thu', visitors: 0 },
    { day: 'Fri', visitors: 0 },
    { day: 'Sat', visitors: 0 },
    { day: 'Sun', visitors: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {/* <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Welcome back, {userName}! 👋</h1>
          <p className="text-[var(--text-secondary)] text-[0.9rem] mt-1">Here&apos;s what&apos;s happening with your portfolio today.</p>
        </div>
        <div className="flex gap-2.5">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-[0.82rem] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 transition-all">
            <Download size={16} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-[0.82rem] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f140] hover:-translate-y-0.5 transition-all">
            <Plus size={16} /> New Project
          </button>
        </div>
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Visitors */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[0.8rem] font-medium text-[var(--text-secondary)]">Total Visitors</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <Eye size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            {loading ? '...' : stats.totalViews.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-[var(--text-muted)]">
            <Clock size={12} />
            <span>Last {selectedDays} days</span>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[0.8rem] font-medium text-[var(--text-secondary)]">Messages</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
              <Mail size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            {loading ? '...' : stats.messages}
          </div>
          <div className={`flex items-center gap-1 text-[0.75rem] ${stats.unreadMessages > 0 ? 'text-[#22c55e]' : 'text-[var(--text-muted)]'}`}>
            {stats.unreadMessages > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
            <span>{stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : 'All read'}</span>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[0.8rem] font-medium text-[var(--text-secondary)]">Projects</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <FolderKanban size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            {loading ? '...' : stats.projects}
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-[var(--text-muted)]">
            <Minus size={12} />
            <span>Active projects</span>
          </div>
        </div>

        {/* Avg. Daily */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[0.8rem] font-medium text-[var(--text-secondary)]">Avg. Daily</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            {loading ? '...' : stats.avgDaily}
          </div>
          <div className="flex items-center gap-1 text-[0.75rem] text-[var(--text-muted)]">
            <TrendingUp size={12} />
            <span>Visitors / day</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        {/* Visitors Overview - Area Chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-bold">Visitors Overview</h3>
            <select 
              value={selectedDays} 
              onChange={(e) => setSelectedDays(Number(e.target.value))}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-secondary)] focus:outline-none cursor-pointer"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <div className="p-5 h-[260px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCw className="animate-spin text-[var(--accent-primary)]" size={24} />
              </div>
            ) : stats.totalViews === 0 ? (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-color)] rounded-xl">
                No visitors yet. Share your portfolio to get started!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    stroke="var(--text-muted)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisitors)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Traffic Sources - Donut Chart */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-bold">Traffic Sources</h3>
            <button className="p-1 hover:bg-[var(--accent-primary)]/10 rounded transition-all text-[var(--text-muted)]">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="p-5 h-[180px] flex items-center justify-center">
            {loading ? (
              <RefreshCw className="animate-spin text-[var(--accent-primary)]" size={24} />
            ) : stats.totalViews === 0 ? (
              <div className="text-[var(--text-muted)]">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="visits"
                    strokeWidth={0}
                  >
                    {trafficSources.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 px-5 pb-5">
            {trafficSources.map((source: any, index: number) => (
              <div key={source.source} className="flex items-center gap-2 text-[0.82rem] text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                {source.source} <strong className="ml-auto text-[var(--text-primary)]">{source.percentage}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
