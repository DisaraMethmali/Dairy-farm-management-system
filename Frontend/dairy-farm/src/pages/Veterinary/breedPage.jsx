import React from 'react';
import '../../styles/main.css';
import DateV from '../../components/Veterinary/DateV';
import Sidebar from '../../components/Veterinary/vetNav';
import BreedingCards from './bredding';
import FemaleCowTable from './femaleCowTable';

function BreedPage() {
    return (
        <div style={{ display: 'flex', height: '100vh',fontFamily: 'Poppins, sans-serif' }}>
            <Sidebar />
            <div style={{ 
                flex: 1,
                padding: '10px', 
                margin: '50px ', 
                marginBottom: '20px',
                paddingLeft: '130px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4>Welcome Back,</h4>
                        <h1>Duvini Ranaweera</h1>
                    </div>
                    <DateV />
                </div>
                
                <h3 style={{ marginTop: 20, marginBottom: '20px' }}>Pregnant Cow List</h3>
                <div style={{marginLeft:60,width:'93%'}}>
                    <BreedingCards/>
                </div>
               
                <h3 style={{ marginTop: 40, marginBottom: '20px' }}>Pregnancy Cycle Track</h3>
                <div style={{ marginTop: '100px',fontFamily: 'Poppins, sans-serif' }}>
                <FemaleCowTable/>
                </div>
               
            </div>
        </div>
    );
}

export default BreedPage;
