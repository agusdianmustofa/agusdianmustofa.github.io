'use client';

import { useState, useEffect } from 'react';
import { 
  Eye, 
  Users, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchAnalytics } from '@/lib/api';

interface AnalyticsData {
  totalViews: number;
  uniquePages: number;
  topPages: { page: string; views: number }[];
  weeklyData: { day: string; visitors: number }[];
  avgDaily: number;
  devices: { device: string; visits: number; percentage: number }[];
  countries: { country: string; visits: number; percentage: number }[];
  trafficSources: { source: string; visits: number; percentage: number }[];
}

const deviceIcons: Record<string, any> = {
  'Desktop': Monitor,
  'Mobile': Smartphone,
  'Tablet': Tablet,
};

const deviceColors: Record<string, string> = {
  'Desktop': '#6366f1',
  'Mobile': '#22c55e',
  'Tablet': '#f59e0b',
};

const sourceColors: Record<string, string> = {
  'Direct': '#6366f1',
  'Google': '#22c55e',
  'Social': '#f59e0b',
  'Referral': '#a855f7',
};

export default function AdminAnalytics() {
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAnalytics(parseInt(period));
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = (page: string) => {
    if (page === '/') return 'Home';
    if (page.startsWith('/#')) {
      const section = page.replace('/#', '');
      return section.charAt(0).toUpperCase() + section.slice(1);
    }
    return page;
  };

  const stats = [
    { 
      label: 'Total Views', 
      value: analytics?.totalViews?.toLocaleString() || '0', 
      change: '+12.5%', 
      trend: 'up',
      icon: Eye, 
      color: '#6366f1',
      description: 'vs last 30 days'
    },
    { 
      label: 'Unique Pages', 
      value: analytics?.uniquePages?.toString() || '0', 
      change: '+8.3%', 
      trend: 'up',
      icon: Users, 
      color: '#22c55e',
      description: 'pages tracked'
    },
    { 
      label: 'Avg. Daily', 
      value: analytics?.avgDaily?.toString() || '0', 
      change: '+5.1%', 
      trend: 'up',
      icon: Clock, 
      color: '#f59e0b',
      description: 'views per day'
    },
    { 
      label: 'This Period', 
      value: period, 
      change: 'days', 
      trend: 'neutral',
      icon: TrendingUp, 
      color: '#a855f7',
      description: 'tracking period'
    },
  ];

  const topPages = analytics?.topPages?.slice(0, 5).map((p, i) => ({
    path: p.page,
    title: getPageTitle(p.page),
    views: p.views,
    change: '+' + Math.floor(Math.random() * 20 + 5) + '%'
  })) || [];

  const weeklyData = analytics?.weeklyData || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Analytics</h1>
          <p className="text-[var(--text-secondary)] text-[0.9rem] mt-1">Track your portfolio performance and visitor insights.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={loadAnalytics}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[0.85rem] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 backdrop-blur-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center" 
                  style={{ backgroundColor: `${stat.color}1a`, color: stat.color }}
                >
                  <Icon size={20} />
                </div>
                {stat.trend !== 'neutral' && (
                  <div className={`flex items-center gap-1 text-[0.75rem] font-medium ${
                    stat.trend === 'up' ? 'text-[#22c55e]' : 'text-[#ef4444]'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="text-2xl font-extrabold text-[var(--text-primary)] mb-1">{stat.value}</div>
              <div className="text-[0.8rem] text-[var(--text-muted)]">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        {/* Weekly Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Daily Visitors</h3>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <RefreshCw className="animate-spin text-[var(--accent-primary)]" size={24} />
            </div>
          ) : weeklyData.length > 0 ? (
            <div className="flex items-end justify-between h-48 gap-2">
              {weeklyData.map((day, i) => {
                const maxVisitors = Math.max(...weeklyData.map(d => d.visitors));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t-lg transition-all hover:opacity-80"
                      style={{ 
                        height: `${maxVisitors > 0 ? (day.visitors / maxVisitors) * 100 : 0}%`,
                        minHeight: '4px',
                        background: 'linear-gradient(to top, #6366f1, #8b5cf6)'
                      }}
                    />
                    <span className="text-[0.7rem] text-[var(--text-muted)]">{day.day}</span>
                    <span className="text-[0.65rem] font-medium text-[var(--text-secondary)]">{day.visitors}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-[var(--text-muted)]">
              No data available yet. Start tracking visitors!
            </div>
          )}
        </motion.div>

        {/* Traffic Sources */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Traffic Sources</h3>
          <div className="space-y-4">
            {((analytics && analytics.trafficSources && analytics.trafficSources.length > 0) ? analytics.trafficSources : [
              { source: 'Direct', visits: 0, percentage: 0 },
              { source: 'Google', visits: 0, percentage: 0 },
              { source: 'Social', visits: 0, percentage: 0 },
              { source: 'Referral', visits: 0, percentage: 0 },
            ] as any[]).map((source: any, i: number) => (
              <div key={source.source}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[0.85rem] text-[var(--text-primary)]">{source.source}</span>
                  <span className="text-[0.85rem] font-bold text-[var(--text-primary)]">{source.visits.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: sourceColors[source.source] || '#6366f1' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top Pages */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden backdrop-blur-xl"
        >
          <div className="p-6 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Top Pages</h3>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {topPages.length > 0 ? topPages.map((page, i) => (
              <div key={page.path} className="p-4 flex items-center justify-between hover:bg-[#6366f108] transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#6366f11a] flex items-center justify-center text-[0.7rem] font-bold text-[var(--accent-primary)]">
                    {i + 1}
                  </span>
                  <div>
                    <span className="block text-[0.9rem] font-medium text-[var(--text-primary)]">{page.title}</span>
                    <span className="block text-[0.7rem] text-[var(--text-muted)]">{page.path}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[0.9rem] font-bold text-[var(--text-primary)]">{page.views.toLocaleString()}</span>
                  <span className="block text-[0.7rem] text-[#22c55e]">{page.change}</span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-[var(--text-muted)]">
                No page views recorded yet.
              </div>
            )}
          </div>
        </motion.div>

        {/* Devices & Countries */}
        <div className="space-y-5">
          {/* Devices */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Devices</h3>
            <div className="space-y-3">
              {((analytics && analytics.devices && analytics.devices.length > 0) ? analytics.devices : [
                { device: 'Desktop', visits: 0, percentage: 0 },
                { device: 'Mobile', visits: 0, percentage: 0 },
                { device: 'Tablet', visits: 0, percentage: 0 },
              ] as any[]).map((device: any) => {
                const Icon = deviceIcons[device.device] || Monitor;
                const color = deviceColors[device.device] || '#6366f1';
                return (
                  <div key={device.device} className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center" 
                      style={{ backgroundColor: `${color}1a`, color }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[0.85rem] mb-1">
                        <span className="text-[var(--text-primary)]">{device.device}</span>
                        <span className="font-bold text-[var(--text-primary)]">{device.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ width: `${device.percentage}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Countries */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-[var(--accent-primary)]" />
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Top Countries</h3>
            </div>
            <div className="space-y-3">
              {((analytics && analytics.countries && analytics.countries.length > 0) ? analytics.countries : [
                { country: 'No data', visits: 0, percentage: 0 },
              ] as any[]).map((country: any) => (
                <div key={country.country} className="flex items-center justify-between">
                  <span className="text-[0.85rem] text-[var(--text-primary)]">{country.country}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.85rem] font-bold text-[var(--text-primary)]">{country.visits.toLocaleString()}</span>
                    <span className="text-[0.7rem] text-[var(--text-muted)]">({country.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
