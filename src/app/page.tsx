'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { fetchProfile, fetchProjects, trackPageView, fetchMaintenance } from "@/lib/api";

function getDevice() {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) return 'mobile';
  if (/ipad|tablet|playbook|silk/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getSource() {
  const ref = document.referrer.toLowerCase();
  if (!ref) return 'direct';
  if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo')) return 'google';
  if (ref.includes('facebook') || ref.includes('twitter') || ref.includes('instagram') || ref.includes('linkedin')) return 'social';
  return 'referral';
}

function getCountryFromTimezone(): string | undefined {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneToCountry: Record<string, string> = {
      'Asia/Jakarta': 'ID',
      'Asia/Singapore': 'SG',
      'Asia/Kuala_Lumpur': 'MY',
      'Asia/Bangkok': 'TH',
      'Asia/Manila': 'PH',
      'Asia/Ho_Chi_Minh': 'VN',
      'Asia/Hong_Kong': 'HK',
      'Asia/Shanghai': 'CN',
      'Asia/Tokyo': 'JP',
      'Asia/Seoul': 'KR',
      'Asia/Kolkata': 'IN',
      'Asia/Dubai': 'AE',
      'Asia/Riyadh': 'SA',
      'Europe/London': 'GB',
      'Europe/Paris': 'FR',
      'Europe/Berlin': 'DE',
      'Europe/Madrid': 'ES',
      'Europe/Rome': 'IT',
      'Europe/Amsterdam': 'NL',
      'America/New_York': 'US',
      'America/Los_Angeles': 'US',
      'America/Chicago': 'US',
      'America/Toronto': 'CA',
      'America/Sao_Paulo': 'BR',
      'America/Mexico_City': 'MX',
      'Australia/Sydney': 'AU',
      'Australia/Melbourne': 'AU',
      'Pacific/Auckland': 'NZ',
    };
    return timezoneToCountry[timezone];
  } catch {
    return undefined;
  }
}

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceChecked, setMaintenanceChecked] = useState(false);

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const data = await fetchMaintenance();
        if (data.maintenanceMode) {
          window.location.href = '/maintenance';
        }
      } catch (e) {
        console.error('Failed to check maintenance status');
      }
      setMaintenanceChecked(true);
    }
    checkMaintenance();
  }, []);

  useEffect(() => {
    if (!maintenanceChecked) return;
    
    const device = getDevice();
    const source = getSource();
    const country = getCountryFromTimezone();
    
    trackPageView('/', { device, source, country });
    
    const handleScroll = () => {
      const sections = ['#about', '#skills', '#services', '#projects', '#testimonials', '#contact'];
      sections.forEach(section => {
        const element = document.querySelector(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            trackPageView(section, { device, source, country });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [maintenanceChecked]);

  useEffect(() => {
    if (!maintenanceChecked) return;

    async function loadData() {
      try {
        const [profileData, projectsData] = await Promise.all([
          fetchProfile(),
          fetchProjects()
        ]);
        setProfile(profileData);
        setProjects(projectsData);
        console.log('Profile loaded:', {
          showTestimonials: profileData.showTestimonials,
          contactForm: profileData.contactForm
        });
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [maintenanceChecked]);

  if (!maintenanceChecked || loading) {
    return (
      <main className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar contactForm={profile?.contactForm} showTestimonials={profile?.showTestimonials} />
      <Hero profile={profile} stats={{ projects: projects.length, skills: profile?.skills?.length || 0, testimonials: profile?.testimonials?.length || 0 }} />
      <About profile={profile} />
      <Skills skills={Array.isArray(profile?.skills) ? profile.skills : []} />
      <Services services={Array.isArray(profile?.services) ? profile.services : []} />
      <Projects initialProjects={Array.isArray(projects) ? projects : []} />
      {profile?.showTestimonials !== false && <Testimonials testimonials={Array.isArray(profile?.testimonials) ? profile.testimonials : []} />}
      {profile?.contactForm !== false && <Contact />}
      <Footer />
    </main>
  );
}
