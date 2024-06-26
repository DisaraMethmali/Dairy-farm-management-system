import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Button,
  IconButton,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TablePagination,
  FormHelperText
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const MilkingSessionsTable = () => {
  const [openFormIndex, setOpenFormIndex] = useState(null);
  const [sessionsData, setSessionsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [sessionToEdit, setSessionToEdit] = useState(null);
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [selectedSessionNotes, setSelectedSessionNotes] = useState('');
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const [milkBatchId, setMilkBatchId] = useState('');
  const [amountOfMilk, setAmountOfMilk] = useState('');
  const [duration, setDuration] = useState('');
  const [qualityCheckResult, setQualityCheckResult] = useState('');
  const [issues, setIssues] = useState('');
  const [errors, setErrors] = useState({
    amountOfMilk: '',
    duration: '',
    qualityCheckResult: '',
    issues: ''
  });
  const [editFormErrors, setEditFormErrors] = useState({
    date: '',
    time: '',
    cowGroup: '',
    specialNotes: ''
  });
  const [cowGroups, setCowGroups] = useState([]);
    
  const displaySuccessToast = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 2800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
  };

  const displayErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2800,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = async (e, sessionId) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:3000/api/milkingData", {
          milkBatchId,
          amountOfMilk,
          duration,
          qualityCheckResult,
          issues
        });
  
        const updateSessionResponse = await axios.put(`http://localhost:3000/api/milkingSessions/${sessionId}/complete`);
        
        if (response.data.success) {
          setMilkBatchId('');
          setAmountOfMilk('');
          setDuration('');
          setQualityCheckResult('');
          setIssues('');
  
          fetchSessionsData();
          displaySuccessToast('New milk batch added!');

        } else {
          displayErrorToast('Something went wrong!');
        }
  
      } catch (err) {
        console.error(err);
        displayErrorToast('Something went wrong!');
      }
    }
  };
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      amountOfMilk: '',
      duration: '',
      qualityCheckResult: '',
      issues: ''
    };
  
    if (amountOfMilk === '') {
      newErrors.amountOfMilk = 'Amount of Milk is required';
      valid = false;
    } else if (parseFloat(amountOfMilk) < 0) {
      newErrors.amountOfMilk = 'Amount of Milk must be a positive number';
      valid = false;
    }
  
    if (duration === '') {
      newErrors.duration = 'Duration is required';
      valid = false;
    } else if (parseInt(duration) < 0) {
      newErrors.duration = 'Duration must be a positive number';
      valid = false;
    }
  
    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    fetchSessionsData();
    fetchCowGroups();
  }, []);

  const fetchCowGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/animalReg/batches');
      if (response.data.success) {
        setCowGroups(response.data.data);
      } else {
        console.error('Failed to fetch cow groups:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching cow groups:', error);
    }
  };

  const fetchSessionsData = () => {
    fetch('http://localhost:3000/api/milkingSessions')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSessionsData(data.data);
        } else {
          console.error('Failed to fetch milking sessions:', data.error);
        }
      })
      .catch(error => console.error('Error fetching milking sessions:', error));
  };

  const toggleAddForm = (index) => {
    setOpenFormIndex(index === openFormIndex ? null : index);
    setSessionToEdit(null);
  };

  const toggleEditForm = (index, session) => {
    setOpenFormIndex(index === openFormIndex ? null : index);
    setSessionToEdit(session);
  };

  const cancelEdit = () => {
    setSessionToEdit(null);
  };

  const cancelAdd = () => {
    setOpenFormIndex(null);
  };

  const handleDeleteSession = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/milkingSessions/${sessionToDelete}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        displaySuccessToast("Record deleted successfully!")
        fetchSessionsData();
        setDeleteConfirmationOpen(false);
      } else {
        displayErrorToast('Failed to delete milking session!');
        console.error('Failed to delete milking session:', data.error);
      }
    } catch (error) {
      displayErrorToast('Failed to delete milking session!');
      console.error('Error deleting milking session:', error);
    }
  };

  const openDeleteConfirmation = (sessionId) => {
    setSessionToDelete(sessionId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setSessionToDelete(null);
  };

  const handleEditSession = async (event) => {
    event.preventDefault();

    if (validateEditForm()) {
      const formData = new FormData(event.target);
      const editedSession = {
        date: formData.get('date') || sessionToEdit.date,
        time: formData.get('time') || sessionToEdit.time,
        cowGroup: formData.get('cowGroup') || sessionToEdit.cowGroup,
        status: sessionToEdit.status,
        specialNotes: formData.get('specialNotes') || sessionToEdit.specialNotes
      };

      try {
        const response = await fetch(`http://localhost:3000/api/milkingSessions/${sessionToEdit._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedSession)
        });
        const data = await response.json();
        if (data.success) {
          displaySuccessToast("Record edited successfully!")
          fetchSessionsData();
          setSessionToEdit(null);
        } else {
          displayErrorToast('Failed to update milking session!');
          console.error('Failed to update milking session:', data.error);
        }
      } catch (error) {
        displayErrorToast('Failed to update milking session!');
        console.error('Error updating milking session:', error);
      }
    }
    
  };

  const validateEditForm = () => {
    let valid = true;
    const newErrors = {
      date: '',
      time: '',
      cowGroup: '',
      specialNotes: ''
    };
  
    if (sessionToEdit.date === '') {
      newErrors.date = 'Date is required';
      valid = false;
    } else if (sessionToEdit.date !== '') {
      const enteredDate = new Date(sessionToEdit.date);
      const today = new Date();
      today.setDate(today.getDate() - 1); 
      if (enteredDate < today) {
        newErrors.date = 'Date must be today or later';
        valid = false;
      }
    }
    

    if (sessionToEdit.time === '') {
      newErrors.time = 'Time is required';
      valid = false;
    }

    if (sessionToEdit.cowGroup === '') {
      newErrors.cowGroup = 'Cow group is required';
      valid = false;
    }

    setEditFormErrors(newErrors);
  
    return valid;
  };
  

  const handleShowNotes = (notes) => {
    setSelectedSessionNotes(notes);
    setShowNotesPopup(true);
  };

  const filteredSessions = sessionsData.filter(session => {
    if (!selectedDate) {
      const today = new Date();
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      return (
        today.getFullYear() === sessionDate.getFullYear() &&
        today.getMonth() === sessionDate.getMonth() &&
        today.getDate() === sessionDate.getDate()
      );
    } else {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      const selectedDateMidnight = new Date(selectedDate);
      selectedDateMidnight.setHours(0, 0, 0, 0);

      return (
        sessionDate.getFullYear() === selectedDateMidnight.getFullYear() &&
        sessionDate.getMonth() === selectedDateMidnight.getMonth() &&
        sessionDate.getDate() === selectedDateMidnight.getDate()
      );
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} style={{borderRadius: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', width: '80vw'}}>
        <div>
          <h2
            style={{
              fontFamily: 'Poppins',
            }}
          >Milking Sessions</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </LocalizationProvider>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '18px' }}>#</TableCell>
            <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '18px' }}>Date</TableCell>
            <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '18px' }}>Time</TableCell>
            <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '18px' }}>Cow Group</TableCell>
            <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '18px' }}>Special Notes</TableCell>
            <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '18px' }}>Status</TableCell>
            <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '18px' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? filteredSessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : filteredSessions
          ).map((session, index) => (
            <React.Fragment key={session._id}>
              <TableRow style={{ backgroundColor: '#D9D9D9', margin: '8px'}}>
                <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '16px' }}>{index + 1}</TableCell>
                <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '16px' }}>{new Date(session.date).toISOString().split('T')[0]}</TableCell>
                <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '16px' }}>{session.time}</TableCell>
                <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '16px' }}>{session.cowGroup}</TableCell>
                <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '16px' }}>
                  {session.specialNotes ? (
                    <a href="#" onClick={() => handleShowNotes(session.specialNotes)} className='specialNotesLink'>Click here</a>
                  ) : <em>No notes recorded</em>}
                </TableCell>
                <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '16px' }}>{session.status}</TableCell>
                <TableCell style={{ textAlign: 'center', fontFamily: 'Poppins', fontSize: '16px' }}>
                  <>
                    {session.status === 'Incomplete' && (
                      <>
                        <IconButton onClick={() => toggleAddForm(index)}>
                          <AddCircleOutlineIcon style={{color: '#38775B'}} />
                        </IconButton>
                        <IconButton onClick={() => toggleEditForm(index, session)}>
                          <EditIcon style={{color: '#38775B'}} />
                        </IconButton>
                      </>
                    )}
                    <IconButton onClick={() => openDeleteConfirmation(session._id)}>
                      <DeleteIcon style={{color: '#F3797E'}} />
                    </IconButton>
                  </>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={7}>
                  <Collapse in={index === openFormIndex && sessionToEdit === null}>
                    <div>
                      {index === openFormIndex && sessionToEdit === null && (
                        <form onSubmit={(e) => handleSubmit(e, session._id)} style={{borderBottom: '6px solid #38775B'}}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                              label="Amount of Milk (in Litres)"
                              onChange={(e) => setAmountOfMilk(e.target.value)}
                              type="number"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              style={{fontFamily: 'Poppins', marginRight: '16px' }}
                              error={!!errors.amountOfMilk}
                              helperText={errors.amountOfMilk}
                              onBlur={() => validateForm()}
                            />

                            <TextField
                              label="Duration (in minutes)"
                              onChange={(e) => setDuration(e.target.value)}
                              type="number"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              style={{fontFamily: 'Poppins', marginRight: '16px' }}
                              error={!!errors.duration}
                              helperText={errors.duration}
                              onBlur={() => validateForm()}
                            />

                            <FormControl variant="outlined" fullWidth margin="normal" error={!!errors.qualityCheckResult}>
                              <InputLabel id="quality-check-result-label">Quality Check Result</InputLabel>
                              <Select
                                labelId="quality-check-result-label"
                                id="quality-check-result-select"
                                value={qualityCheckResult}
                                onChange={(e) => setQualityCheckResult(e.target.value)}
                                label="Quality Check Result"
                                required
                              >
                                <MenuItem value="Pass">Pass</MenuItem>
                                <MenuItem value="Fail">Fail</MenuItem>
                              </Select>
                              {errors.qualityCheckResult && <FormHelperText>{errors.qualityCheckResult}</FormHelperText>}
                            </FormControl>
                          </div>
                          <TextField
                            label="Issues"
                            onChange={(e) => setIssues(e.target.value)}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            error={!!errors.issues}
                            helperText={errors.issues}
                            onBlur={() => validateForm()}
                          />
                          <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0'}}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary" 
                              style={{ marginRight: '10px', fontFamily: 'Poppins', backgroundColor: '#38775B', width: '200px'}}
                            >
                              Submit
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={cancelAdd}
                              style={{fontFamily: 'Poppins', width: '200px'}}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>                        
                      )}
                    </div>
                  </Collapse>
                  <Collapse in={index === openFormIndex && sessionToEdit !== null}>
                    <div>
                      {index === openFormIndex && sessionToEdit !== null && (
                        <form onSubmit={handleEditSession} style={{borderBottom: '6px solid #38775B'}}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                              label="Edit Date"
                              type="date"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              defaultValue={new Date(sessionToEdit.date).toISOString().split('T')[0]}
                              onChange={(e) => setSessionToEdit({ ...sessionToEdit, date: e.target.value })}
                              style={{ fontFamily: 'Poppins', marginRight: '16px' }}
                              inputProps={{
                                min: new Date().toISOString().split('T')[0]
                              }}
                              error={!!editFormErrors.date}
                              helperText={editFormErrors.date}
                            />
                            <TextField
                              label="Edit Time"
                              type="time"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              defaultValue={sessionToEdit.time}
                              onChange={(e) => setSessionToEdit({ ...sessionToEdit, time: e.target.value })}
                              style={{fontFamily: 'Poppins', marginRight: '16px' }}
                            />
                            <FormControl variant="outlined" fullWidth margin="normal">
                              <InputLabel id="cow-group-label">Edit Cow Group</InputLabel>
                              <Select
                                labelId="cow-group-label"
                                id="cow-group-select"
                                value={sessionToEdit.cowGroup}
                                onChange={(e) => setSessionToEdit({ ...sessionToEdit, cowGroup: e.target.value })}
                                label="Edit Cow Group"
                              >
                                {cowGroups.map((group) => (
                                  <MenuItem key={group} value={group}>{group}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          <TextField
                            label="Edit Special Notes"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                            defaultValue={sessionToEdit.specialNotes}
                            onChange={(e) => setSessionToEdit({ ...sessionToEdit, specialNotes: e.target.value })}
                            style={{fontFamily: 'Poppins' }}
                          />
                          <div style={{display: 'flex', justifyContent: 'center', margin: '16px 0'}}>
                            <Button variant="contained" color="primary" style={{ marginRight: '10px', fontFamily: 'Poppins', backgroundColor: '#38775B', width: '200px'}} type="submit">
                              Update
                            </Button>
                            <Button variant="outlined" onClick={cancelEdit} style={{fontFamily: 'Poppins', width: '200px'}} >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      
      <TablePagination
        rowsPerPageOptions={[3]}
        component="div"
        count={filteredSessions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={deleteConfirmationOpen}
        onClose={closeDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this milking session?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSession} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showNotesPopup}
        onClose={() => setShowNotesPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Special Notes</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedSessionNotes || 'No recorded data'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNotesPopup(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default MilkingSessionsTable;
