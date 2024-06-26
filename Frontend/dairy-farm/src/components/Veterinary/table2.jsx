import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#EAEAEA',
    color: theme.palette.common.black,
    fontSize: 17,
    fontFamily: 'Poppins, sans-serif'
    
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    fontFamily: 'Poppins, sans-serif'
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  
}));

const StyledTableContainer = styled(TableContainer)({
  margin: '0 auto',
  maxWidth: '600px', 
  display: 'flex', 
  justifyContent: 'right' ,
  marginRight:'200px'
});

function CustomizedTables1(props) {
  const { rows, headers, handleEdit, handleDelete } = props;

  return (
    <StyledTableContainer component={Paper} sx={{ maxWidth: 600, display: 'flex', justifyContent: 'right' }}>
      <Table sx={{ maxWidth: 600 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <StyledTableCell key={index}>{header}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <StyledTableRow key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <StyledTableCell key={colIndex} align="left">
                  {value}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default CustomizedTables1;
