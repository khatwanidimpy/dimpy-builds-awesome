import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Expertise', href: '/skills' },
    { name: 'Experience', href: '/experience' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-primary">
              Dimpy Khatwani
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const isCurrent = location.pathname === item.href || 
                                 (item.href.includes('#') && location.pathname === '/') ||
                                 (item.name === 'Blog' && location.pathname.startsWith('/blog'));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isCurrent 
                        ? 'text-primary font-medium' 
                        : 'text-muted-foreground hover:text-primary'
                    } transition-colors px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-muted">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isCurrent = location.pathname === item.href || 
                               (item.href.includes('#') && location.pathname === '/') ||
                               (item.name === 'Blog' && location.pathname.startsWith('/blog'));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isCurrent 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-primary'
                  } block px-3 py-2 rounded-md text-base font-medium transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;