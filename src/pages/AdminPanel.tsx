import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Doctor, Appointment, UserProfile } from '../types';
import { Users, Calendar, Plus, Trash2, Edit, CheckCircle, XCircle, Search, Filter, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'patients'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  // New Doctor state
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    department: 'General Medicine',
    experience: 5,
    imageUrl: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const apptsSnap = await getDocs(query(collection(db, 'appointments'), orderBy('createdAt', 'desc')));
      setAppointments(apptsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));

      const docsSnap = await getDocs(collection(db, 'doctors'));
      setDoctors(docsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Doctor)));

      const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'patient')));
      setPatients(usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as UserProfile)));
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'appointments', id), { status });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as any } : a));
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'doctors'), {
        ...newDoctor,
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      });
      setDoctors(prev => [{ id: docRef.id, ...newDoctor, availability: [] } as Doctor, ...prev]);
      setShowAddDoctor(false);
      setNewDoctor({ name: '', specialty: '', department: 'General Medicine', experience: 5, imageUrl: '' });
    } catch (err) {
      console.error('Add doctor error:', err);
    }
  };

  const handleSeedData = async () => {
    if (doctors.length > 0) return alert('Data already seeded or exists.');
    const sampleDoctors = [
      { name: 'Dr. Sarah Smith', specialty: 'Senior Cardiologist', department: 'Cardiology', experience: 15, imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400' },
      { name: 'Dr. James Wilson', specialty: 'Neurologist', department: 'Neurology', experience: 10, imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400' },
      { name: 'Dr. Emily Chen', specialty: 'Pediatrician', department: 'Pediatrics', experience: 8, imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400' },
      { name: 'Dr. Robert Brown', specialty: 'Orthopedic Surgeon', department: 'Orthopedics', experience: 20, imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400' },
    ];

    for (const d of sampleDoctors) {
      await addDoc(collection(db, 'doctors'), d);
    }
    fetchData();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-2 tracking-tight">Admin Control Panel</h1>
            <p className="text-slate-500">Overview of hospital operations, staff, and patient bookings.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSeedData}
              className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" /> Seed Sample Doctors
            </button>
            <button
              onClick={() => setShowAddDoctor(true)}
              className="px-6 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 shadow-xl shadow-medical-100 flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Doctor
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-200 w-fit mb-8 shadow-sm">
          {[
            { id: 'appointments', label: 'Bookings', icon: Calendar },
            { id: 'doctors', label: 'Medical Staff', icon: Users },
            { id: 'patients', label: 'Patient Directory', icon: Search }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id ? 'bg-medical-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-12">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-medical-600"></div>
              <p className="text-slate-500 font-medium animate-pulse">Syncing hospital records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {activeTab === 'appointments' && (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Patient</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Doctor</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Date & Time</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map(appt => (
                      <tr key={appt.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="font-bold text-slate-900">{appt.patientName}</p>
                          <p className="text-xs text-slate-400">ID: {appt.patientId.slice(0, 8)}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="font-semibold text-slate-700">{appt.doctorName}</p>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-600 font-medium">
                          {format(new Date(appt.date), 'MMM d')} • {appt.time}
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            {appt.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                title="Confirm"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                              title="Cancel"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'doctors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                  {doctors.map(doctor => (
                    <div key={doctor.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex gap-4">
                      <img src={doctor.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h3 className="font-bold text-slate-900">{doctor.name}</h3>
                        <p className="text-xs text-medical-600 font-bold">{doctor.specialty}</p>
                        <p className="text-xs text-slate-500 mt-2">{doctor.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'patients' && (
                <div className="p-20 text-center">
                  <p className="text-slate-500 font-medium">Coming soon: Comprehensive patient management.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Doctor Modal */}
        <AnimatePresence>
          {showAddDoctor && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddDoctor(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="relative z-10">
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Register New Specialist</h2>
                  <form onSubmit={handleAddDoctor} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newDoctor.name}
                        onChange={e => setNewDoctor(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none"
                        placeholder="Dr. Gregory House"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Specialty</label>
                        <input
                          type="text"
                          required
                          value={newDoctor.specialty}
                          onChange={e => setNewDoctor(prev => ({ ...prev, specialty: e.target.value }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none"
                          placeholder="Cardiologist"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Exp. (Years)</label>
                        <input
                          type="number"
                          required
                          value={newDoctor.experience}
                          onChange={e => setNewDoctor(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                      <select
                        value={newDoctor.department}
                        onChange={e => setNewDoctor(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      >
                        <option>General Medicine</option>
                        <option>Cardiology</option>
                        <option>Neurology</option>
                        <option>Pediatrics</option>
                        <option>Orthopedics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newDoctor.imageUrl}
                        onChange={e => setNewDoctor(prev => ({ ...prev, imageUrl: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddDoctor(false)}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                      >
                        Discard
                      </button>
                      <button
                        type="submit"
                        className="flex-[2] py-4 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-all shadow-lg shadow-medical-200"
                      >
                        Register Doctor
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
