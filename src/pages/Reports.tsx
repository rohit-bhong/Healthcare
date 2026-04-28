import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { MedicalReport } from '../types';
import { FileText, Upload, Plus, Download, Trash2, Search, Filter, FolderOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, 'reports'), where('patientId', '==', user.uid), orderBy('uploadedAt', 'desc'));
        const snap = await getDocs(q);
        setReports(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MedicalReport)));
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !fileUrl) return;
    
    setUploading(true);
    try {
      const newReport = {
        patientId: user.uid,
        title,
        fileUrl,
        fileName: title + '.pdf', // Simulated
        uploadedAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'reports'), newReport);
      setReports(prev => [{ id: docRef.id, ...newReport }, ...prev]);
      setShowUpload(false);
      setTitle('');
      setFileUrl('');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">Medical Reports</h1>
            <p className="text-slate-500">Secure access to all your diagnostic results and medical history.</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-medical-600 text-white rounded-2xl font-bold hover:bg-medical-700 transition-all shadow-xl shadow-medical-100"
          >
            <Upload className="w-5 h-5" /> Upload Report
          </button>
        </div>

        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl p-8 mb-12 border border-slate-200 shadow-sm overflow-hidden"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-medical-600" /> Upload New Document
              </h3>
              <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Report Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none"
                    placeholder="e.g., Blood Test Results - Apr 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">File URL (Simulated Upload)</label>
                  <input
                    type="url"
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none"
                    placeholder="Enter URL for the document (e.g., Google Drive link)"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-8 py-3 bg-medical-600 text-white rounded-xl font-bold hover:bg-medical-700 transition-all shadow-lg flex items-center gap-2"
                  >
                    {uploading ? 'Processing...' : 'Ready to Upload'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-medical-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <FolderOpen className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No reports found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-10">You haven't uploaded any medical documents yet. Start by clicking the upload button.</p>
            <button
              onClick={() => setShowUpload(true)}
              className="px-8 py-4 bg-medical-50 text-medical-700 rounded-2xl font-bold hover:bg-medical-600 hover:text-white transition-all"
            >
              Add First Report
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-medical-50 rounded-xl flex items-center justify-center group-hover:bg-medical-500 transition-colors">
                    <FileText className="w-6 h-6 text-medical-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    PDF / DOCUMENT
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate" title={report.title}>{report.title}</h3>
                <p className="text-slate-500 text-sm mb-8 flex items-center gap-1">
                  <Plus className="w-4 h-4 cursor-default" /> Added on {format(new Date(report.uploadedAt), 'MMM d, yyyy')}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={report.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    View <Search className="w-4 h-4" />
                  </a>
                  <a
                    href={report.fileUrl}
                    download
                    className="flex items-center justify-center gap-2 py-3 bg-medical-50 text-medical-700 rounded-xl text-sm font-bold hover:bg-medical-600 hover:text-white transition-all shadow-sm shadow-medical-100"
                  >
                    Save <Download className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
