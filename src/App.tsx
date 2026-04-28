import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import BookAppointment from './pages/BookAppointment';
import Reports from './pages/Reports';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, profile, loading, isAdmin } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/book/:doctorId" element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <footer className="bg-slate-900 text-white py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-medical-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">H</span>
                  </div>
                  HealPoint
                </h3>
                <p className="text-slate-400 text-sm">
                  Dedicated to providing world-class healthcare with a personal touch. Your health is our priority.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li><a href="/" className="hover:text-medical-400 transition-colors">Home</a></li>
                  <li><a href="/doctors" className="hover:text-medical-400 transition-colors">Doctors</a></li>
                  <li><a href="/dashboard" className="hover:text-medical-400 transition-colors">Dashboard</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Departments</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>Cardiology</li>
                  <li>Neurology</li>
                  <li>Pediatrics</li>
                  <li>Orthopedics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>123 Medical Plaza</li>
                  <li>Health City, HC 56789</li>
                  <li>+1 (555) 000-HEAL</li>
                  <li>contact@healpoint.com</li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
