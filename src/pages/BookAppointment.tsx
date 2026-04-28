import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Doctor } from '../types';
import { Calendar as CalendarIcon, Clock, ArrowLeft, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) return;
      try {
        const docRef = doc(db, 'doctors', doctorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() } as Doctor);
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleBook = async () => {
    if (!user || !doctor || !selectedTime) return;
    
    setBooking(true);
    setError('');
    
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: profile?.fullName || user.email,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'appointments');
      setError('Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
    </div>
  );

  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/doctors')}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-medical-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </button>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-slate-100"
            >
              <div className="w-24 h-24 bg-medical-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-medical-600" />
              </div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Appointment Confirmed!</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Your appointment with <span className="font-bold text-slate-900">{doctor.name}</span> on <span className="font-bold text-slate-900">{format(selectedDate, 'MMMM do')}</span> at <span className="font-bold text-slate-900">{selectedTime}</span> has been successfully booked.
              </p>
              <p className="text-sm text-slate-400">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden"
            >
              <div className="md:flex">
                {/* Doctor Sidebar */}
                <div className="md:w-1/3 bg-slate-900 p-8 text-white">
                  <img
                    src={doctor.imageUrl || `https://picsum.photos/seed/${doctor.id}/400/400`}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-2xl object-cover mb-6 border-2 border-medical-500/30"
                    referrerPolicy="no-referrer"
                  />
                  <h3 className="text-2xl font-bold mb-1">{doctor.name}</h3>
                  <p className="text-medical-400 font-semibold mb-4 text-sm">{doctor.specialty}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Professional consultation at HealPoint Main Hospital. Please arrive 15 minutes before your slot.
                  </p>
                  <div className="space-y-4 pt-6 border-t border-white/10 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-medical-400" /> 30 Min Session
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="md:w-2/3 p-8 md:p-12">
                  <div className="mb-10">
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <CalendarIcon className="w-6 h-6 text-medical-600" /> Select Date & Time
                    </h2>
                    
                    {/* Date Selection */}
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                        const date = addDays(startOfToday(), i);
                        const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(date)}
                            className={cn(
                              "flex-shrink-0 w-20 py-4 rounded-2xl border transition-all flex flex-col items-center gap-1",
                              isSelected 
                                ? "bg-medical-600 border-medical-600 text-white shadow-lg shadow-medical-200" 
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-medical-300"
                            )}
                          >
                            <span className="text-[10px] font-bold uppercase opacity-70">{format(date, 'EEE')}</span>
                            <span className="text-xl font-display font-bold">{format(date, 'dd')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Available Slots</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 text-sm font-semibold rounded-xl border transition-all",
                            selectedTime === time
                              ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={!selectedTime || booking}
                    className="w-full py-5 bg-medical-600 text-white rounded-2xl font-bold text-lg hover:bg-medical-700 transition-all shadow-xl shadow-medical-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group"
                  >
                    {booking ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Confirm Appointment <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
