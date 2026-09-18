import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, HospitalStats, Lab, Message, Appointment, StaffMember, BillingRecord, InventoryItem, Report, AuditLog } from '../types';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

interface HospitalContextType {
  stats: HospitalStats;
  patients: Patient[];
  labs: Lab[];
  messages: Message[];
  appointments: Appointment[];
  staffMembers: StaffMember[];
  billings: BillingRecord[];
  inventoryItems: InventoryItem[];
  reports: Report[];
  auditLogs: AuditLog[];
  updateStats: (newStats: HospitalStats) => Promise<void>;
  addPatient: (patient: Patient) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addLab: (lab: Lab) => Promise<void>;
  deleteLab: (id: string) => Promise<void>;
  addMessage: (message: Message) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addStaffMember: (staff: StaffMember) => Promise<void>;
  deleteStaffMember: (id: string) => Promise<void>;
  addBilling: (billing: BillingRecord) => Promise<void>;
  deleteBilling: (id: string) => Promise<void>;
  addInventoryItem: (item: InventoryItem) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  addReport: (report: Report) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  addAuditLog: (log: AuditLog) => Promise<void>;
}

const defaultStats: HospitalStats = {
  totalPatients: 0,
  criticalCondition: 0,
  availableBeds: 0,
  doctorsOnDuty: 0,
  admissionsTrend: [],
  departmentStats: []
};

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<HospitalStats>(defaultStats);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [billings, setBillings] = useState<BillingRecord[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (!user) return; // Only sync data when authenticated

    // Sync Stats
    const unsubStats = onSnapshot(doc(db, 'hospitalData', 'stats'), snap => {
      if (snap.exists()) setStats(snap.data() as HospitalStats);
    });

    const createCollectionListener = <T extends { id: string }>(path: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
      return onSnapshot(collection(db, path), snap => {
        setter(snap.docs.map(d => d.data() as T));
      }, err => console.error(`Error listening to ${path}:`, err));
    };

    const unsubPatients = createCollectionListener<Patient>('patients', setPatients);
    const unsubLabs = createCollectionListener<Lab>('labs', setLabs);
    const unsubMessages = createCollectionListener<Message>('messages', setMessages);
    const unsubAppointments = createCollectionListener<Appointment>('appointments', setAppointments);
    const unsubStaff = createCollectionListener<StaffMember>('staffMembers', setStaffMembers);
    const unsubBillings = createCollectionListener<BillingRecord>('billings', setBillings);
    const unsubInventory = createCollectionListener<InventoryItem>('inventoryItems', setInventoryItems);
    const unsubReports = createCollectionListener<Report>('reports', setReports);
    const unsubAuditLogs = createCollectionListener<AuditLog>('auditLogs', setAuditLogs);

    return () => {
      unsubStats();
      unsubPatients();
      unsubLabs();
      unsubMessages();
      unsubAppointments();
      unsubStaff();
      unsubBillings();
      unsubInventory();
      unsubReports();
      unsubAuditLogs();
    };
  }, [user]);

  const updateStats = async (s: HospitalStats) => { await setDoc(doc(db, 'hospitalData', 'stats'), s); };
  
  const addDocToCol = async (col: string, item: any) => { await setDoc(doc(db, col, item.id), item); };
  const delDocFromCol = async (col: string, id: string) => { await deleteDoc(doc(db, col, id)); };

  const addPatient = async (p: Patient) => addDocToCol('patients', p);
  const deletePatient = async (id: string) => delDocFromCol('patients', id);
  
  const addLab = async (l: Lab) => addDocToCol('labs', l);
  const deleteLab = async (id: string) => delDocFromCol('labs', id);
  
  const addMessage = async (m: Message) => addDocToCol('messages', m);
  const deleteMessage = async (id: string) => delDocFromCol('messages', id);
  
  const addAppointment = async (a: Appointment) => addDocToCol('appointments', a);
  const deleteAppointment = async (id: string) => delDocFromCol('appointments', id);
  
  const addStaffMember = async (s: StaffMember) => addDocToCol('staffMembers', s);
  const deleteStaffMember = async (id: string) => delDocFromCol('staffMembers', id);
  
  const addBilling = async (b: BillingRecord) => addDocToCol('billings', b);
  const deleteBilling = async (id: string) => delDocFromCol('billings', id);
  
  const addInventoryItem = async (i: InventoryItem) => addDocToCol('inventoryItems', i);
  const deleteInventoryItem = async (id: string) => delDocFromCol('inventoryItems', id);
  
  const addReport = async (r: Report) => addDocToCol('reports', r);
  const deleteReport = async (id: string) => delDocFromCol('reports', id);

  const addAuditLog = async (log: AuditLog) => addDocToCol('auditLogs', log);

  return (
    <HospitalContext.Provider value={{
      stats, patients, labs, messages, appointments, staffMembers, billings, inventoryItems, reports, auditLogs,
      updateStats, addPatient, deletePatient,
      addLab, deleteLab, addMessage, deleteMessage,
      addAppointment, deleteAppointment, addStaffMember, deleteStaffMember,
      addBilling, deleteBilling, addInventoryItem, deleteInventoryItem,
      addReport, deleteReport, addAuditLog
    }}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) throw new Error('useHospital must be used within HospitalProvider');
  return context;
};
