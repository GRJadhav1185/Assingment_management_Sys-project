import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, FileText, Upload, CheckSquare, BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(to)
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            LMS Portal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === 'FACULTY' ? 'Faculty Panel' : 'Student Portal'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {user?.role === 'STUDENT' && (
            <>
              <NavItem to="/student/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/student/assignments" icon={BookOpen} label="My Assignments" />
            </>
          )}

          {user?.role === 'FACULTY' && (
            <>
              <NavItem to="/faculty/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/faculty/assignments" icon={FileText} label="Assignments" />
              <NavItem to="/faculty/submissions" icon={CheckSquare} label="Submissions" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full px-4 py-3 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Welcome back, {user?.name?.split(' ')[0]}
          </h2>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
