export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  role: 'patient' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experience: number;
  imageUrl: string;
  availability: string[]; // ['Monday', 'Wednesday']
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}
