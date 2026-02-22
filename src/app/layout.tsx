import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Particles from "@/components/Particles";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_URL}/profile`, { 
      cache: 'no-store' 
    });
    
    if (res.ok) {
      const profile = await res.json();
      return {
        title: `${profile.name || 'Portfolio'} | ${profile.title || 'Full Stack Developer'}`,
        description: profile.bio || `Portfolio of ${profile.name}, a ${profile.title} building elegant and scalable digital solutions.`,
        openGraph: {
          title: `${profile.name || 'Portfolio'} | ${profile.title || 'Full Stack Developer'}`,
          description: profile.bio || `Portfolio of ${profile.name}`,
          type: 'website',
        },
      };
    }
  } catch (e) {
    console.error('Failed to fetch profile for metadata');
  }
  
  return {
    title: "Portfolio",
    description: "My portfolio website",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <LanguageProvider>
          <Particles />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
