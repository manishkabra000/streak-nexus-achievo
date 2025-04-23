
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Award,
  BarChart2,
  Settings,
  Menu,
  X,
  LogOut,
  Github,
  Code
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Goals', path: '/goals', icon: BarChart2 },
    { name: 'Achievements', path: '/achievements', icon: Award },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Mobile Nav Header */}
      <header className="lg:hidden border-b border-border h-16 fixed top-0 left-0 right-0 bg-background z-50 flex items-center justify-between px-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
        <div className="flex items-center">
          <span className="text-primary text-2xl font-bold ml-2">Achievo</span>
        </div>
        {isAuthenticated && (
          <div className="flex items-center">
            <Link to="/profile">
              <img 
                src={user?.avatar}
                alt="Profile" 
                className="h-8 w-8 rounded-full border border-border"
              />
            </Link>
          </div>
        )}
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-sidebar-border flex items-center">
            <span className="text-primary text-2xl font-bold ml-2">Achievo</span>
          </div>

          {isAuthenticated && (
            <div className="p-4 border-b border-sidebar-border">
              <div className="flex items-center">
                <img 
                  src={user?.avatar}
                  alt="Profile" 
                  className="h-10 w-10 rounded-full border border-border"
                />
                <div className="ml-3">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-sm text-sidebar-foreground">{user?.email}</div>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon size={20} className="mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {isAuthenticated && (
            <div className="p-4 border-t border-sidebar-border space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${user?.integrations.github ? 'bg-streak-success' : 'bg-streak-danger'}`} />
                <div className="flex items-center">
                  <Github size={16} className="mr-2" />
                  <span className="text-sm">GitHub</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${user?.integrations.leetcode ? 'bg-streak-success' : 'bg-streak-danger'}`} />
                <div className="flex items-center">
                  <Code size={16} className="mr-2" />
                  <span className="text-sm">LeetCode</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={logout}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <main className="px-4 py-6 max-w-6xl mx-auto">
          {children}
        </main>
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};
