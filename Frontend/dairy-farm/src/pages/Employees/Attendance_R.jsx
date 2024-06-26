import React, { useState, useEffect } from "react";
import { Button } from '@mui/material';
import axios from 'axios';
import jspdf from 'jspdf';
import 'jspdf-autotable';

import companyLogo from '../../assets/sidebar-logo.png';

// Component to generate PDF report
const Report = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Fetch attendance data from an API or any other source
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/employee/data');
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const doc = new jspdf();
      const tableRows = [];

      const margin = 14; // Left margin
      const logoWidth = 30; // Logo width
      const logoHeight = 20; // Logo height
      const maxWidth = 290; // Calculate maximum width available for text
      
      // Add company logo
      doc.addImage(companyLogo, 'PNG', doc.internal.pageSize.width - margin - logoWidth, margin, logoWidth, logoHeight);
  
      // Add company address
      doc.setFontSize(10).setFont('helvetica').text('Nevil Nutri Feeds Pvt.Ltd', margin, margin + 10);
      doc.text('No:241, Rdawana', margin, margin + 15);
      doc.text('Henagama Rd', margin, margin + 20);
      doc.text('Gampaha', margin, margin + 25);
      doc.text('Sri Lanka', margin, margin + 30);
  
      // Add current date
      const date = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      doc.setFontSize(10).text(`Date: ${date}`, margin, margin + 35);
  
      // Title
      doc.setFontSize(20).setTextColor(56, 119, 91).setFont('helvetica', 'bold').text('Attendance Report', margin, 70);
  
      // Introduction paragraph
      const textLines = doc.splitTextToSize(
        `This contains atttendance of Employees in 2024/05/07`,
        maxWidth
      );
      const textParagraph = textLines.join('\n');
      doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(0, 0, 0).text(
        textParagraph,
        margin,
        80,
        { maxWidth: maxWidth } // Specify maxWidth option for text
      );

      attendanceData.forEach((entry, index) => {
        const attendanceEntry = [
          entry.timestamp,
          entry.employeeId,
          "present",
        ];
        tableRows.push(attendanceEntry);
      });
      
      doc.autoTable(["Timestamp", "Employee ID", "Status"], tableRows, {
        styles: { fontSize: 10 },
        startY: 100, // Adjust the startY position as needed
        headerStyles: { fillColor: [31, 41, 55] },
      });

      doc.save('Attendance_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again later.');
    }
  };

  return (
    <Button onClick={handleGenerateReport} variant="contained" color="primary">
      Generate Report
    </Button>
  );
};

export default Report;
