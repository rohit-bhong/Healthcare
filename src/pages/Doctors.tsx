import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Doctor } from '../types';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Calendar, Filter, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctors(docs);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
        <p className="text-slate-500 font-medium">Finding our best specialists...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Our Medical Specialists</h1>
          <p className="text-slate-600">Book an appointment with world-class healthcare professionals.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-6">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <Filter className="text-slate-400 w-5 h-5 hidden md:block" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 transition-all min-w-[180px]"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No doctors found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={doctor.imageUrl || `https://picsum.photos/seed/${doctor.id}/600/600`}
                    alt={doctor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-medical-700 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-medical-600 text-medical-600" /> 4.9 (120+ reviews)
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-medical-600 text-white text-xs font-bold rounded-lg shadow-lg">
                      {doctor.department}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h3>
                    <p className="text-medical-600 text-sm font-semibold">{doctor.specialty}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Award className="w-4 h-4" /> <span>{doctor.experience} Years Experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <MapPin className="w-4 h-4" /> <span>HealPoint Main Hospital, Wing B</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" /> <span>Next Available: Tomorrow</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/book/${doctor.id}`}
                    className="w-full py-3 bg-medical-50 text-medical-700 rounded-xl font-bold hover:bg-medical-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                  >
                    Schedule Appointment <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
