// src/app/dashboard/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession, logoutAction } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, LogOut, Settings, PlusCircle, LayoutDashboard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PANDA Dashboard',
  description: 'Manage your PANDA services',
};

// Inline SVG for PANDA logo - reused from page.tsx
const PandaLogo = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="text-primary"
    aria-label="PANDA logo"
  >
    <circle cx="33" cy="33" r="12" fill="currentColor"/>
    <circle cx="67" cy="33" r="12" fill="currentColor"/>
    <path d="M50 25C38.9543 25 30 33.9543 30 45V55C30 63.866 36.7157 71 45 71H55C63.2843 71 70 63.866 70 55V45C70 33.9543 61.0457 25 50 25Z" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M35 52C35 60.2843 41.7157 67 50 67C58.2843 67 65 60.2843 65 52" stroke="hsl(var(--background))" strokeWidth="8" strokeLinecap="round"/>
    <path d="M40 70C40 76.0751 44.4772 81 50 81C55.5228 81 60 76.0751 60 70" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="42" cy="48" r="4" fill="hsl(var(--background))"/>
    <circle cx="58" cy="48" r="4" fill="hsl(var(--background))"/>
  </svg>
);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn } = await getSession();

  if (!isLoggedIn) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <PandaLogo />
            <span className="font-bold text-xl text-foreground">PANDA Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Welcome, {user?.email || 'User'}
            </span>
            <form action={logoutAction}>
              <Button variant="outline" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <nav className="hidden md:flex flex-col w-64 border-r bg-card p-4 space-y-2">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Overview</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/dashboard/create-service"><PlusCircle className="mr-2 h-4 w-4" /> Create Service</Link>
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <a href="http://localhost:9005" target="_blank" rel="noopener noreferrer">
                <Settings className="mr-2 h-4 w-4" /> Manage Servers
              </a>
            </Button>
             <Button variant="ghost" className="justify-start mt-auto" asChild>
              <Link href="/"><Home className="mr-2 h-4 w-4" /> Back to Search</Link>
            </Button>
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
       {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t p-2 flex justify-around items-center">
        <Button variant="ghost" size="sm" asChild className="flex flex-col h-auto p-1">
          <Link href="/dashboard"><LayoutDashboard className="h-5 w-5 mb-1" /> <span className="text-xs">Overview</span></Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex flex-col h-auto p-1">
          <Link href="/dashboard/create-service"><PlusCircle className="h-5 w-5 mb-1" /> <span className="text-xs">Create</span></Link>
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex flex-col h-auto p-1">
          <a href="http://localhost:9005" target="_blank" rel="noopener noreferrer">
            <Settings className="h-5 w-5 mb-1" /> <span className="text-xs">Manage</span>
          </a>
        </Button>
        <Button variant="ghost" size="sm" asChild className="flex flex-col h-auto p-1">
          <Link href="/"><Home className="h-5 w-5 mb-1" /> <span className="text-xs">Search</span></Link>
        </Button>
      </nav>
    </div>
  );
}
