const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Maintenance
export async function fetchMaintenance() {
  const res = await fetch(`${API_URL}/profile/maintenance`, { 
    cache: 'no-store'
  });
  if (!res.ok) return { maintenanceMode: false };
  return res.json();
}

// Auth
export async function login(credentials: any) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}

// Profile
export async function fetchProfile() {
  const res = await fetch(`${API_URL}/profile`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch profile');
  const data = await res.json();
  
  // Fetch dependencies
  const [skills, services, testimonials] = await Promise.all([
    fetch(`${API_URL}/profile/skills`).then(r => r.json()),
    fetch(`${API_URL}/services`).then(r => r.json()),
    fetch(`${API_URL}/testimonials`).then(r => r.json()),
  ]);

  return { ...data, skills, services, testimonials };
}

// Me (Auth)
export async function fetchMe() {
  return adminRequest('/auth/me');
}

// Overview Stats
export async function fetchOverviewStats(days: number = 30) {
  const [messages, projects, skills, services, testimonials, analytics] = await Promise.all([
    fetch(`${API_URL}/messages/stats`).then(r => { 
      if (!r.ok) throw new Error('Failed to fetch messages stats');
      return r.json();
    }).catch((e) => { console.error('Messages stats error:', e); return { total: 0, unread: 0 }; }),
    fetch(`${API_URL}/projects`).then(r => r.json()).catch(() => []),
    fetch(`${API_URL}/profile/skills`).then(r => r.json()).catch(() => []),
    fetch(`${API_URL}/services`).then(r => r.json()).catch(() => []),
    fetch(`${API_URL}/testimonials`).then(r => r.json()).catch(() => []),
    fetch(`${API_URL}/analytics?days=${days}`).then(r => r.json()).catch(() => null),
  ]);
  
  return {
    messages: messages.total || 0,
    unreadMessages: messages.unread || 0,
    projects: Array.isArray(projects) ? projects.length : 0,
    skills: Array.isArray(skills) ? skills.length : 0,
    services: Array.isArray(services) ? services.length : 0,
    testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
    totalViews: analytics?.totalViews || 0,
    avgDaily: analytics?.avgDaily || 0,
    weeklyData: analytics?.weeklyData || [],
    trafficSources: analytics?.trafficSources || [],
  };
}

// Messages
export async function fetchMessages() {
  const res = await fetch(`${API_URL}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function replyMessage(id: number, reply: string) {
  const res = await fetch(`${API_URL}/messages/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply }),
  });
  if (!res.ok) throw new Error('Failed to send reply');
  return res.json();
}

// Projects
export async function fetchProjects(category?: string) {
  const url = category ? `${API_URL}/projects?category=${category}` : `${API_URL}/projects`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createProject(data: {
  title: string;
  slug: string;
  description: string;
  category: string;
  techStack: string[];
  imageUrl?: string;
  gradient?: string;
  liveUrl?: string;
  githubUrl?: string;
  status?: string;
  featured?: boolean;
  order?: number;
}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function updateProject(id: number, data: Partial<{
  title: string;
  slug: string;
  description: string;
  category: string;
  techStack: string[];
  imageUrl: string;
  gradient: string;
  liveUrl: string;
  githubUrl: string;
  status: string;
  featured: boolean;
  order: number;
}>) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProject(id: number) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { 
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

// Services
export async function fetchServices() {
  const res = await fetch(`${API_URL}/services`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

// Testimonials
export async function fetchTestimonials() {
  const res = await fetch(`${API_URL}/testimonials`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch testimonials');
  return res.json();
}

// Analytics
export async function fetchAnalytics(days: number = 30) {
  const res = await fetch(`${API_URL}/analytics?days=${days}`, { 
    next: { revalidate: 60 } 
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function trackPageView(page: string, options?: {
  device?: string;
  country?: string;
  source?: string;
}) {
  try {
    await fetch(`${API_URL}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, ...options }),
    });
  } catch (e) {
    // Silently fail - analytics should not break the page
  }
}

// Admin API (Authenticated)
export async function adminRequest(endpoint: string, options: any = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'API request failed');
  }

  return res.json();
}

export async function fetchBlogs() {
  const res = await fetch(`${API_URL}/blogs`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function fetchProjectBySlug(slug: string) {
  const res = await fetch(`${API_URL}/projects/${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
}

export async function fetchBlogBySlug(slug: string) {
  const res = await fetch(`${API_URL}/blogs/${slug}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch blog');
  return res.json();
}
