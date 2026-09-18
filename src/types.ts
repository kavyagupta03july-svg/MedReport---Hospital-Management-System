export type Role = 'admin' | 'medical';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  address?: string;
  department?: string;
  emergencyContact?: string;
  role: Role;
  avatar: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  admissionDate: string;
  diagnosis: string;
  status: 'Critical' | 'Stable' | 'Discharged';
  department: string;
}

export interface Lab {
  id: string;
  patientName: string;
  testName: string;
  result: string;
  date: string;
}

export interface Message {
  id: string;
  subject: string;
  content: string;
  author: string;
  date: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface BillingRecord {
  id: string;
  patientName: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export interface Report {
  id: string;
  title: string;
  type: string;
  generatedBy: string;
  date: string;
  summary: string;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'User Management' | 'Inventory' | 'Billing' | 'System' | 'Other';
  details: string;
  user: string;
  timestamp: string;
}

export interface HospitalStats {
  totalPatients: number;
  criticalCondition: number;
  availableBeds: number;
  doctorsOnDuty: number;
  admissionsTrend: { date: string; admissions: number; discharges: number }[];
  departmentStats: { name: string; value: number }[];
}
