import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Clock, Users, ArrowRight, ChevronRight, Activity, Calendar, Award } from 'lucide-react';
import { cn } from '../lib/utils';

const departments = [
  { name: 'Cardiology', icon: Heart, description: 'Comprehensive heart care and cardiovascular procedures.' },
  { name: 'Neurology', icon: Activity, description: 'Expert diagnosis and treatment for brain and nervous system.' },
  { name: 'Pediatrics', icon: Users, description: 'Specialized healthcare for infants, children, and adolescents.' },
  { name: 'Orthopedics', icon: Award, description: 'Advanced care for bone, joint, and muscle conditions.' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="hospital_hero.png"
            alt="HealPoint Hospital"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-medical-600/20 text-medical-400 rounded-full text-xs font-bold tracking-wider uppercase mb-6 border border-medical-500/30">
              <Shield className="w-3 h-3" /> Dedicated to Excellence
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
              Your Health, <br />
              <span className="text-medical-400 font-display">Our Life's Work.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
              Experience world-class healthcare with the latest technology and a compassionate team dedicated to your recovery.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/doctors"
                className="px-8 py-4 bg-medical-500 text-white rounded-xl font-bold hover:bg-medical-600 transition-all shadow-xl shadow-medical-500/20 flex items-center gap-2 group"
              >
                Book Appointment <Calendar className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/doctors"
                className="px-8 py-4 bg-white/10 text-white border border-white/20 backdrop-blur-sm rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                Explore Doctors
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Specialist Doctors', value: '250+' },
              { label: 'Modern Rooms', value: '500+' },
              { label: 'Happy Patients', value: '50k+' },
              { label: 'Years Experience', value: '25+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-display font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">Our Specialized Departments</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide the highest quality care across multiple disciplines, using state-of-the-art diagnostic and treatment tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.name}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-medical-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-medical-500 transition-colors">
                  <dept.icon className="w-7 h-7 text-medical-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{dept.name}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  {dept.description}
                </p>
                <button className="text-medical-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <img
              src="https://picsum.photos/seed/hosp/800/600"
              alt="Medical facility"
              className="rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
              Innovation & Care <br />
              <span className="text-medical-600">Perfectly Balanced.</span>
            </h2>
            <p className="text-slate-600 mb-10 leading-relaxed">
              At HealPoint, we believe that medical excellence is not just about the latest equipment, but about how that technology is used to provide better outcomes and a smoother patient experience.
            </p>
            
            <ul className="space-y-6">
              {[
                { title: 'Online Appointments', desc: 'Book consultations from the comfort of your home.', icon: Calendar },
                { title: 'Expert Team', desc: 'Over 200 world-renowned specialists at your service.', icon: Shield },
                { title: 'Emergency 24/7', desc: 'Always ready to respond to critical medical needs.', icon: Clock },
              ].map((feature, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-medical-50 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-medical-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{feature.title}</h4>
                    <p className="text-sm text-slate-500">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-medical-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-medical-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-medical-500 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-400 rounded-full -ml-32 -mb-32 opacity-30 blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Take Control of Your Health Today</h2>
              <p className="text-medical-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of families who trust HealPoint for their comprehensive medical needs and preventative care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-10 py-5 bg-white text-medical-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-lg shadow-xl"
                >
                  Create Patient Account
                </Link>
                <Link
                  to="/doctors"
                  className="px-10 py-5 bg-medical-700 text-white rounded-2xl font-bold hover:bg-medical-800 transition-all text-lg border border-medical-500 flex items-center justify-center gap-2"
                >
                  View Our Doctors <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
