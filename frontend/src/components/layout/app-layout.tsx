import { Menu, Moon, Sun, Waves, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const navigation = [
  { name: 'Municipal Dashboard', to: '/' },
  { name: 'Citizen Portal', to: '/citizen-portal' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { citizen, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-midnight dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <Link to="/" className="text-lg font-bold">
                Fair Water Distribution — Raipur
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart City Water Control & Citizen Transparency
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <nav className="flex items-center gap-4 text-sm font-medium">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-3 py-2 transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {citizen ? (
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <div className="font-medium">{citizen.full_name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{citizen.email}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button>Sign in</Button>
                  </Link>
                </div>
              )}

              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {mobileNavOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <nav className="flex flex-col gap-2 text-sm font-medium">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-2',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                    )
                  }
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

