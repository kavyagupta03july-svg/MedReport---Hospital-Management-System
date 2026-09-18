import { Patient, HospitalStats } from '../types';
import { subDays } from 'date-fns';

const today = new Date();

export const generateMockPatients = (): Patient[] => {
  return [
    { id: 'PT-1001', name: 'Eleanor Shellstrop', age: 34, gender: 'Female', admissionDate: subDays(today, 2).toISOString(), diagnosis: 'Pneumonia', status: 'Stable', department: 'Pulmonology' },
    { id: 'PT-1002', name: 'Chidi Anagonye', age: 38, gender: 'Male', admissionDate: subDays(today, 5).toISOString(), diagnosis: 'Ulcer', status: 'Discharged', department: 'Gastroenterology' },
    { id: 'PT-1003', name: 'Tahani Al-Jamil', age: 31, gender: 'Female', admissionDate: subDays(today, 1).toISOString(), diagnosis: 'Concussion', status: 'Critical', department: 'Neurology' },
    { id: 'PT-1004', name: 'Jason Mendoza', age: 28, gender: 'Male', admissionDate: today.toISOString(), diagnosis: 'Fractured Arm', status: 'Stable', department: 'Orthopedics' },
    { id: 'PT-1005', name: 'Michael Realman', age: 55, gender: 'Male', admissionDate: subDays(today, 10).toISOString(), diagnosis: 'Heart Bypass', status: 'Stable', department: 'Cardiology' },
    { id: 'PT-1006', name: 'Janet Dela-Den', age: 42, gender: 'Female', admissionDate: subDays(today, 0).toISOString(), diagnosis: 'Appendicitis', status: 'Critical', department: 'Surgery' },
    { id: 'PT-1007', name: 'Shawn Badplace', age: 45, gender: 'Male', admissionDate: subDays(today, 3).toISOString(), diagnosis: 'Migraine', status: 'Stable', department: 'Neurology' },
    { id: 'PT-1008', name: 'Mindy St. Claire', age: 48, gender: 'Female', admissionDate: subDays(today, 7).toISOString(), diagnosis: 'Asthma', status: 'Discharged', department: 'Pulmonology' },
  ];
};

export const generateMockStats = (): HospitalStats => {
  return {
    totalPatients: 245,
    criticalCondition: 12,
    availableBeds: 45,
    doctorsOnDuty: 38,
    admissionsTrend: [
      { date: subDays(today, 6).toLocaleDateString('en-US', { weekday: 'short' }), admissions: 12, discharges: 8 },
      { date: subDays(today, 5).toLocaleDateString('en-US', { weekday: 'short' }), admissions: 19, discharges: 15 },
      { date: subDays(today, 4).toLocaleDateString('en-US', { weekday: 'short' }), admissions: 15, discharges: 12 },
      { date: subDays(today, 3).toLocaleDateString('en-US', { weekday: 'short' }), admissions: 22, discharges: 18 },
      { date: subDays(today, 2).toLocaleDateString('en-US', { weekday: 'short' }), admissions: 18, discharges: 20 },
      { date: subDays(today, 1).toLocaleDateString('en-US', { weekday: 'short' }), admissions: 25, discharges: 14 },
      { date: today.toLocaleDateString('en-US', { weekday: 'short' }), admissions: 10, discharges: 5 },
    ],
    departmentStats: [
      { name: 'Cardiology', value: 45 },
      { name: 'Neurology', value: 30 },
      { name: 'Orthopedics', value: 55 },
      { name: 'Pediatrics', value: 80 },
      { name: 'Surgery', value: 35 },
    ]
  };
};
