import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
               <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              CareerBoard
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                   <User className="w-5 h-5" />
                   <span className="hidden sm:inline">{currentUser.name || 'Profile'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-medium transition-all shadow-sm flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-medium transition-all shadow-sm flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
