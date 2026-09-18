import React, { useState } from 'react';
import { Mail, Phone, GraduationCap, Award, X, Clock, BookOpen } from 'lucide-react';

interface Doctor {
  id: number;
  name: string;
  image: string;
  specialty: string;
  qualification: string;
  phone: string;
  email: string;
  experience: string;
  bio: string;
  education: string[];
  workingHours: string;
}

export const DoctorDetails: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Smith",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
      specialty: "Cardiology",
      qualification: "MD, FACC - Cardiovascular Disease",
      phone: "+1 (555) 123-4567",
      email: "sarah.smith@medreport.com",
      experience: "15+ Years",
      bio: "Dr. Sarah Smith is a board-certified cardiologist with over 15 years of experience treating complex cardiovascular diseases. She specializes in preventative cardiology and heart failure management.",
      education: ["Harvard Medical School - MD", "Johns Hopkins Hospital - Residency & Fellowship"],
      workingHours: "Mon-Wed: 8:00 AM - 4:00 PM"
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
      specialty: "Neurology",
      qualification: "MD, PhD - Clinical Neurology",
      phone: "+1 (555) 234-5678",
      email: "james.wilson@medreport.com",
      experience: "12+ Years",
      bio: "Dr. Wilson brings extensive expertise in diagnosing and treating neurological disorders. His research focuses on neurodegenerative diseases and cutting-edge therapeutics.",
      education: ["Stanford University - MD, PhD", "UCSF Medical Center - Residency"],
      workingHours: "Tue-Fri: 9:00 AM - 5:00 PM"
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      image: "https://images.unsplash.com/photo-1594824432257-27e1f4862f92?auto=format&fit=crop&q=80&w=300&h=300",
      specialty: "Orthopedics",
      qualification: "DO, FAAOS - Orthopedic Surgery",
      phone: "+1 (555) 345-6789",
      email: "emily.chen@medreport.com",
      experience: "10+ Years",
      bio: "Specializing in sports medicine and joint replacement, Dr. Chen is dedicated to helping patients regain their mobility and improve their quality of life through advanced surgical techniques.",
      education: ["UCLA - DO", "Mayo Clinic - Orthopedic Residency"],
      workingHours: "Mon-Thu: 7:00 AM - 3:00 PM"
    },
    {
      id: 4,
      name: "Dr. Michael Chang",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
      specialty: "Pediatrics",
      qualification: "MD, FAAP - Pediatric Medicine",
      phone: "+1 (555) 456-7890",
      email: "michael.chang@medreport.com",
      experience: "8+ Years",
      bio: "Dr. Chang is passionate about child health and development. He provides comprehensive care for infants, children, and adolescents, focusing on preventive care and family education.",
      education: ["University of Pennsylvania - MD", "Children's Hospital of Philadelphia - Residency"],
      workingHours: "Mon, Wed, Fri: 8:00 AM - 4:00 PM"
    },
    {
      id: 5,
      name: "Dr. Jessica Martinez",
      image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300",
      specialty: "General Practice",
      qualification: "MD - Family Medicine",
      phone: "+1 (555) 567-8901",
      email: "jessica.martinez@medreport.com",
      experience: "14+ Years",
      bio: "As a family medicine practitioner, Dr. Martinez believes in building long-term relationships with her patients to provide personalized, holistic care for all ages.",
      education: ["University of Texas Medical Branch - MD", "Baylor College of Medicine - Residency"],
      workingHours: "Tue-Sat: 9:00 AM - 5:00 PM"
    },
    {
      id: 6,
      name: "Dr. Robert Taylor",
      image: "https://images.unsplash.com/photo-1537368910025-702804a92d4b?auto=format&fit=crop&q=80&w=300&h=300",
      specialty: "Oncology",
      qualification: "MD, PhD - Medical Oncology",
      phone: "+1 (555) 678-9012",
      email: "robert.taylor@medreport.com",
      experience: "20+ Years",
      bio: "Dr. Taylor is a renowned medical oncologist with over two decades of experience. He is committed to providing compassionate, evidence-based cancer care and participating in innovative clinical trials.",
      education: ["Yale School of Medicine - MD", "MD Anderson Cancer Center - Fellowship"],
      workingHours: "Mon-Fri: 8:00 AM - 2:00 PM"
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Doctor Directory</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed profiles of our medical staff and specialists.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <div key={doctor.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col transition-all hover:shadow-md">
            <div className="p-6 pb-0 flex items-start space-x-4">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{doctor.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {doctor.specialty}
                </span>
              </div>
            </div>
            
            <div className="p-6 pt-5 space-y-4 flex-1">
              <div className="flex items-start">
                <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Qualifications</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{doctor.qualification}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Award className="w-4 h-4 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Experience</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{doctor.experience}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-2 space-y-3">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
                  <a href={`tel:${doctor.phone.replace(/[^0-9]/g, '')}`} className="hover:text-blue-600 transition-colors">
                    {doctor.phone}
                  </a>
                </div>
                
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
                  <a href={`mailto:${doctor.email}`} className="hover:text-blue-600 transition-colors truncate">
                    {doctor.email}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => setSelectedDoctor(doctor)}
                className="w-full py-2 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:bg-slate-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Full Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Profile View */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setSelectedDoctor(null)}>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          </div>

          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors shadow-sm focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-6 sm:space-y-0 sm:space-x-8 border-b border-slate-200 dark:border-slate-700">
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name} 
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
                />
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedDoctor.name}</h3>
                  <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {selectedDoctor.specialty}
                  </span>
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <a href={`tel:${selectedDoctor.phone.replace(/[^0-9]/g, '')}`} className="flex items-center justify-center sm:justify-start hover:text-blue-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {selectedDoctor.phone}
                    </a>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <a href={`mailto:${selectedDoctor.email}`} className="flex items-center justify-center sm:justify-start hover:text-blue-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {selectedDoctor.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-10 space-y-8">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedDoctor.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-blue-500" /> Education & Credentials
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-slate-600 dark:text-slate-300">{selectedDoctor.qualification}</span>
                      </li>
                      {selectedDoctor.education.map((edu, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-slate-600 dark:text-slate-300">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" /> Availability
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-slate-700 font-medium">{selectedDoctor.workingHours}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">To schedule an appointment, please contact the main reception desk or use the Appointments tab.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end flex-shrink-0">
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
