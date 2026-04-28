import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Appointment, MedicalReport } from '../types';
import { Calendar, FileText, Plus, Clock, MapPin, MoreVertical, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        // Fetch appointments
        const apptsQuery = query(
          collection(db, 'appointments'),
          where('patientId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const apptsSnap = await getDocs(apptsQuery);
        setAppointments(apptsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));

        // Fetch reports
        const reportsQuery = query(
          collection(db, 'reports'),
          where('patientId', '==', user.uid),
          orderBy('uploadedAt', 'desc')
        );
        const reportsSnap = await getDocs(reportsQuery);
        setReports(reportsSnap.docs.map(d => ({ id: d.id, ...d.data() } as MedicalReport)));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Hello, {profile?.fullName || 'Patient'}</h1>
          <p className="text-slate-500">Manage your appointments and view medical reports.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Appointments */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-medical-600" /> My Appointments
                </h2>
                <Link
                  to="/doctors"
                  className="text-sm font-bold text-medical-600 hover:text-medical-700 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Book New
                </Link>
              </div>

              {appointments.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <p className="text-slate-500 mb-6">You have no upcoming appointments.</p>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-all shadow-lg shadow-medical-200"
                  >
                    View Doctors <Plus className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt) => (
                    <motion.div
                      key={appt.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-md transition-all group"
                    >
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <img
                            src={`https://picsum.photos/seed/${appt.doctorId}/200/200`}
                            alt={appt.doctorName}
                            className="w-full h-full object-cover rounded-xl"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{appt.doctorName}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {format(new Date(appt.date), 'MMMM d, yyyy')}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {appt.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {appt.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteAppointment(appt.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            title="Cancel Appointment"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: Reports & Profile */}
          <div className="space-y-8">
            <section className="bg-medical-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500 rounded-full -mr-16 -mt-16 opacity-20 blur-2xl" />
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-medical-400" /> Medical Reports
                </h3>
                {reports.length === 0 ? (
                  <p className="text-slate-400 text-sm mb-6">No reports uploaded yet.</p>
                ) : (
                  <ul className="space-y-4 mb-6">
                    {reports.slice(0, 3).map((report) => (
                      <li key={report.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-medical-500 transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold truncate max-w-[120px]">{report.title}</p>
                            <p className="text-[10px] text-slate-400">{format(new Date(report.uploadedAt), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        <a href={report.fileUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-full">
                          <ExternalLink className="w-4 h-4 text-medical-400" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  to="/reports"
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-center block text-sm font-bold transition-all"
                >
                  View All Reports
                </Link>
                <Link
                  to="/reports"
                  className="w-full mt-3 py-3 bg-medical-500 hover:bg-medical-600 rounded-xl text-center block text-sm font-bold transition-all shadow-lg shadow-medical-500/20"
                >
                  Upload New Report
                </Link>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 tracking-tight">Need Help?</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Our support team is available 24/7 for any technical issues or appointment queries.
              </p>
              <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                Contact Support
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
