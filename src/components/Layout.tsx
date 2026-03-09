import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/chat", label: "Ask Assistant" },
    { path: "/sources", label: "Sources" },
    { path: "/about", label: "About" },
    { path: "/admin", label: "Admin" },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`
            ${mobile ? 'block py-2' : 'px-3 py-2'}
            rounded-md text-sm font-medium transition-colors
            ${location.pathname === item.path 
              ? 'bg-accent text-accent-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }
          `}
        >
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">IKA</span>
              </div>
              <span className="font-semibold text-lg">Islamic Knowledge Assistant</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <NavLinks />
            </nav>
            
            {/* Mobile Navigation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-1 mt-6">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              This is a learning tool. Please consult qualified Islamic scholars for personal religious guidance.
            </p>
            <p className="text-xs mt-2">
              Islamic Knowledge Assistant - Providing answers based on authentic Islamic sources
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;