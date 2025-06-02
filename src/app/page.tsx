import { SearchContainer } from '@/components/search-container';
import { getSession } from '@/lib/auth';
import { logoutAction } from '@/actions/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, ExternalLink } from 'lucide-react';


const PandaLogo = () => (
  <svg 
    width="40" 
    height="40" 
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


export default async function HomePage() {
  const { isLoggedIn } = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b shadow-sm bg-card sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PandaLogo />
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground tracking-tight">
              PANDA Search
            </h1>
          </div>
          <nav className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Button asChild variant="outline">
                  <a href="http://localhost:9003" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Accéder au tableau de bord
                  </a>
                </Button>
                <form action={logoutAction}>
                  <Button variant="ghost" type="submit">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </form>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow w-full">
        <SearchContainer />
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-muted-foreground border-t bg-card">
        © {new Date().getFullYear()} PANDA Search. Crafted with care.
      </footer>
    </div>
  );
}
