import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { Menu, X, User, LogOut, LayoutDashboard, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Navbar() {
  const { user, profile, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Doctors', path: '/doctors' },
  ];

  if (user) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard' });
    if (isAdmin) {
      navLinks.push({ name: 'Admin', path: '/admin' });
    }
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-medical-600 rounded-xl flex items-center justify-center shadow-lg shadow-medical-200">
                <Stethoscope className="text-white w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                Heal<span className="text-medical-600">Point</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-slate-600 hover:text-medical-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <div className="text-right hidden lg:block">
                  <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-900">{profile?.fullName || user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-600 hover:text-medical-600 font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-medical-600 text-white rounded-lg font-semibold hover:bg-medical-700 transition-all shadow-md shadow-medical-200 hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-slate-600 hover:bg-medical-50 hover:text-medical-700 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-4 px-4">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-3 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center py-3 rounded-lg bg-medical-600 text-white font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
