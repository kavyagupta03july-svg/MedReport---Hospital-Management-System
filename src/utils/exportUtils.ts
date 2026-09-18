import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Patient } from '../types';

export const exportPatientsToPDF = (patients: Patient[], title: string = 'Patient Report') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  const tableColumn = ["ID", "Name", "Age", "Gender", "Date", "Diagnosis", "Status", "Dept"];
  const tableRows = patients.map(p => [
    p.id,
    p.name,
    p.age.toString(),
    p.gender,
    new Date(p.admissionDate).toLocaleDateString(),
    p.diagnosis,
    p.status,
    p.department
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] } // Tailwind blue-500
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};

export const exportPatientsToExcel = (patients: Patient[], filename: string = 'patients_report') => {
  const worksheet = XLSX.utils.json_to_sheet(patients.map(p => ({
    'Patient ID': p.id,
    'Full Name': p.name,
    'Age': p.age,
    'Gender': p.gender,
    'Admission Date': new Date(p.admissionDate).toLocaleDateString(),
    'Diagnosis': p.diagnosis,
    'Status': p.status,
    'Department': p.department
  })));
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
  
  XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`);
};
