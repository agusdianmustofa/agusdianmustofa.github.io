'use client';

import { useEffect, useState } from 'react';
import { fetchMaintenance } from '@/lib/api';

export default function MaintenancePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const data = await fetchMaintenance();
        if (!data.maintenanceMode) {
          window.location.href = '/';
        }
      } catch (e) {
        console.error('Failed to check maintenance status');
      } finally {
        setLoading(false);
      }
    }
    checkMaintenance();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-lg">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-[var(--accent-primary)]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
          Under Maintenance
        </h1>
        
        <p className="text-lg text-[var(--text-secondary)] mb-8">
          We're currently working on improving our website. 
          We'll be back online shortly!
        </p>
        
        <div className="text-sm text-[var(--text-secondary)]">
          Thank you for your patience
        </div>
      </div>
    </main>
  );
}
