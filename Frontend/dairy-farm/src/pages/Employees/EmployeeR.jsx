import React, { useState } from 'react';
import '../../styles/main.css';
import BgCard from '../../components/Veterinary/bgCard';
import DateV from '../../components/Veterinary/DateV';
import Esidebar from "../../components/Employees/esidebar";
import EmployeeReport from './Employee_report';
import Report from './Attendance_R';
import { Box, Typography } from '@mui/material'; 
function EmployeeR() {
    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Poppins, sans-serif' }}>
            <Esidebar />
            <div style={{ 
                flex: 1,
                padding: '10px', 
                margin: '50px ', 
                marginBottom: '10px', 
                paddingLeft: '130px', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                 <Box sx={{ marginLeft: '2rem',marginTop:'-20px' ,width:'86%' }}>
                
                <h4>Welcome Back,</h4>
                <h1> Hello Disara </h1>
                <Box sx={{ marginLeft: '20rem',marginTop:'-78px' ,width:'86%' }}>
                <DateV/>
                </Box>
                </Box>
                <div style={{ marginTop:"70px", textAlign: 'center' }}>
                    <BgCard style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div>
                                <p>{new Date().toLocaleDateString()} Employee Registration</p>
                            </div>
                            <div style={{ marginLeft: '20px' }}>
                                <EmployeeReport />
                                
                            </div>
                            <div>
                           
                            </div>
                        </div>
                    </BgCard>
                    <BgCard style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           
                         
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div>
                                <p>{new Date().toLocaleDateString()} Employee Attendance</p>
                            </div>
                        
                            <div style={{ marginLeft: '20px' }}>
                                <Report />
                                
                            </div>
                            </div>
                        </div>
                    </BgCard>
                </div>
            </div>
        </div>
    );
}

export default EmployeeR;
