import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PlayCircle, BarChart3, Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { path: '/learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/practice', label: 'Practice', icon: <PlayCircle className="w-4 h-4" /> },
    { path: '/impact', label: 'Impact', icon: <BarChart3 className="w-4 h-4" /> },
    { path: '/security', label: 'Security', icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">₹</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">CashlessVillage</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;