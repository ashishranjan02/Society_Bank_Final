import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Tabs,
  Snackbar,
  Alert,
  CircularProgress,
  Tab,
  Container,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Divider,
  Grid
} from '@mui/material';
import { PhotoCamera } from "@mui/icons-material";
import {
  Search,
  Add,
  PersonAdd,
  VerifiedUser,
  Payment,
  ManageAccounts,
  CloudUpload
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import membersData from "../../public/Member.json";
import { useNavigate } from 'react-router-dom';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: `1px solid ${theme.palette.divider}`,
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
  background: color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '16px',
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 120,
    height: 120,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
  }
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  ...(status === 'active' && {
    background: 'linear-gradient(135deg, #4caf50, #45a049)',
    color: 'white'
  }),
  ...(status === 'inactive' && {
    background: 'linear-gradient(135deg, #ff9800, #f57c00)',
    color: 'white'
  }),
  ...(status === 'suspended' && {
    background: 'linear-gradient(135deg, #f44336, #d32f2f)',
    color: 'white'
  }),
  ...(status === 'pending' && {
    background: 'linear-gradient(135deg, #2196f3, #1976d2)',
    color: 'white'
  })
}));

const KYCStatusChip = styled(Chip)(({ verified }) => ({
  fontWeight: 600,
  borderRadius: '8px',
  ...(verified ? {
    background: 'linear-gradient(135deg, #4caf50, #45a049)',
    color: 'white'
  } : {
    background: 'linear-gradient(135deg, #ff9800, #f57c00)',
    color: 'white'
  })
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Enhanced localStorage utility functions
const localStorageKeys = {
  MEMBERS: 'society_members_data',
  REGISTRATION_FORM: 'member_registration_form_data',
  APP_SETTINGS: 'society_app_settings'
};

const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = (key, data) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};

const removeFromLocalStorage = (key) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

const clearAllLocalStorage = () => {
  try {
    if (typeof window === 'undefined') return;
    Object.values(localStorageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);

  // Save members to localStorage whenever members state changes
  useEffect(() => {
    if (members.length > 0 && !loading) {
      saveToLocalStorage(localStorageKeys.MEMBERS, members);
      console.log('Members data saved to localStorage:', members.length, 'members');
    }
  }, [members, loading]);

  // Load initial data on component mount
  useEffect(() => {
    const initializeData = () => {
      const savedMembers = getFromLocalStorage(localStorageKeys.MEMBERS);

      if (savedMembers && savedMembers.length > 0) {
        setMembers(savedMembers);
        setLoading(false);
        console.log('Loaded from localStorage:', savedMembers.length, 'members');
      } else {
        // Load from JSON and initialize
        const membersWithFees = membersData.map(member => ({
          ...member,
          membershipFee: {
            paid: Math.random() > 0.3,
            amount: 1000,
            dueDate: "2025-12-31",
            lastPaymentDate: member.joinedAt
          }
        }));

        setMembers(membersWithFees);
        saveToLocalStorage(localStorageKeys.MEMBERS, membersWithFees);
        setLoading(false);
        console.log('Initialized new data:', membersWithFees.length, 'members');
      }
    };

    initializeData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddMember = (memberData) => {
    const newMemberId = `MEM${String(members.length + 1).padStart(4, '0')}`;

    const newMember = {
      _id: `member-${Date.now()}`,
      memberId: newMemberId,
      name: memberData.name,
      email: memberData.email,
      mobile: memberData.mobile,
      dob: memberData.dob,
      address: memberData.address,
      kyc: {
        ...memberData.kyc,
        verified: false,
        documents: memberData.uploadedDocuments || []
      },
      status: 'pending',
      joinedAt: new Date().toISOString(),
      membershipFee: {
        paid: false,
        amount: 1000,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lastPaymentDate: null
      }
    };

    const updatedMembers = [newMember, ...members];
    setMembers(updatedMembers);
    setSnackbar({ open: true, message: 'Member registered successfully', severity: 'success' });
    setTabValue(0);
  };

  const handleKYCUpload = (memberId, kycData) => {
    const updatedMembers = members.map(member =>
      member._id === memberId
        ? {
          ...member,
          kyc: { ...member.kyc, ...kycData, verified: true },
          status: 'active'
        }
        : member
    );
    setMembers(updatedMembers);
    setSnackbar({ open: true, message: 'KYC documents uploaded successfully', severity: 'success' });
  };

  const handleFeeCollection = (memberId, feeData) => {
    const updatedMembers = members.map(member =>
      member._id === memberId
        ? {
          ...member,
          membershipFee: {
            ...member.membershipFee,
            paid: true,
            lastPaymentDate: new Date().toISOString()
          }
        }
        : member
    );
    setMembers(updatedMembers);
    setSnackbar({ open: true, message: 'Membership fee collected successfully', severity: 'success' });
  };

  // Data export functionality
  const exportData = () => {
    const dataToExport = {
      members: members,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `society-members-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    setSnackbar({ open: true, message: 'Data exported successfully', severity: 'success' });
  };

  // Data import functionality
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (importedData.members && Array.isArray(importedData.members)) {
          setMembers(importedData.members);
          saveToLocalStorage(localStorageKeys.MEMBERS, importedData.members);
          setSnackbar({ open: true, message: 'Data imported successfully', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Invalid data format', severity: 'error' });
        }
      } catch (error) {
        setSnackbar({ open: true, message: 'Error importing data', severity: 'error' });
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = '';
  };

  // Clear all data
  const clearAllData = () => {
    clearAllLocalStorage();
    setMembers([]);
    setSnackbar({ open: true, message: 'All data cleared successfully', severity: 'info' });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Members Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage society members, KYC verification, and membership fees
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={exportData}
            size="small"
          >
            Export Data
          </Button>
          <Button
            variant="outlined"
            component="label"
            size="small"
          >
            Import Data
            <input
              type="file"
              hidden
              accept=".json"
              onChange={importData}
            />
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={clearAllData}
            size="small"
          >
            Clear All Data
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonAdd sx={{ fontSize: 40, opacity: 0.8, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{members.length}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Members</Typography>
              </Box>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VerifiedUser sx={{ fontSize: 40, opacity: 0.8, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {members.filter(m => m.kyc.verified).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>KYC Verified</Typography>
              </Box>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Payment sx={{ fontSize: 40, opacity: 0.8, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {members.filter(m => m.membershipFee.paid).length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Fee Paid</Typography>
              </Box>
            </Box>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard color="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ManageAccounts sx={{ fontSize: 40, opacity: 0.8, mr: 2 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {members.filter(m => m.status === 'active').length}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Active Members</Typography>
              </Box>
            </Box>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 2, p: 2, background: '#f5f5f5', borderRadius: 1, mb: 2 }}>
          <Typography variant="caption">
            Debug: {members.length} members in state |
            LocalStorage: {getFromLocalStorage(localStorageKeys.MEMBERS)?.length || 0} members
          </Typography>
        </Box>
      )}

      {/* Module Tabs */}
      <StyledPaper>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="All Members" />
          <Tab label="Member Registration" />
          <Tab label="Fee Collection" />
          <Tab label="Profile Management" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <MemberListView
            members={filteredMembers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MemberRegistration
            onAddMember={handleAddMember}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            members={members}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <FeeCollection
            members={members.filter(m => !m.membershipFee.paid)}
            onCollectFee={handleFeeCollection}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <ProfileManagement members={members} onKYCUpload={handleKYCUpload} />
        </TabPanel>
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// Member List View Component
function MemberListView({ members, searchTerm, setSearchTerm, statusFilter, setStatusFilter, page, setPage, rowsPerPage, setRowsPerPage }) {
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search by name, email, or member ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 300, flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Member ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Member Details</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Contact</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>KYC Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fee Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Member Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Join Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member) => (
              <TableRow key={member._id} hover>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {member.memberId}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{member.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {member.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{member.mobile}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {member.address.city}, {member.address.state}
                  </Typography>
                </TableCell>
                <TableCell>
                  <KYCStatusChip
                    label={member.kyc.verified ? "Verified" : "Pending"}
                    verified={member.kyc.verified}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.membershipFee.paid ? "Paid" : "Due"}
                    color={member.membershipFee.paid ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <StatusChip label={member.status} status={member.status} size="small" />
                </TableCell>
                <TableCell>
                  {new Date(member.joinedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={members.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

// Member Registration Component with localStorage for form data
const steps = ["Personal Info", "Contact & Address", "Documents", "Preview & Submit"];
function MemberRegistration({ onAddMember, activeStep, setActiveStep, members }) {
  const [photo, setPhoto] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");

  // Load form data from localStorage or use default empty values
  const [formData, setFormData] = useState(() =>
    getFromLocalStorage(localStorageKeys.REGISTRATION_FORM, {
      applicantName: "",
      fatherHusbandName: "",
      motherName: "",
      dob: "",
      age: "",
      gender: "",
      maritalStatus: "",
      monthlyIncome: "",
      occupation: "",
      residenceType: "",
      correspondenceAddress: "",
      permanentAddress: "",
      contact: "",
      email: "",
      pan: "",
      aadhar: "",
    })
  );

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage(localStorageKeys.REGISTRATION_FORM, formData);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleMemberChange = (e) => {
    const memberId = e.target.value;
    setSelectedMember(memberId);
    const member = members.find((m) => m.memberId === memberId);
    if (member) {
      setFormData(prev => ({
        ...prev,
        applicantName: member.name,
        contact: member.mobile || "",
        email: member.email || "",
        correspondenceAddress: member.address ? `${member.address.street}, ${member.address.city}` : "",
        permanentAddress: member.address ? `${member.address.street}, ${member.address.city}` : "",
      }));
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Submit the form
      const newMemberData = {
        name: formData.applicantName,
        email: formData.email,
        mobile: formData.contact,
        dob: formData.dob,
        address: {
          street: formData.correspondenceAddress.split(',')[0]?.trim() || '',
          city: formData.correspondenceAddress.split(',')[1]?.trim() || '',
          state: '',
          pincode: ''
        },
        kyc: {
          aadhar: formData.aadhar,
          pan: formData.pan,
          verified: false,
          documents: []
        }
      };

      onAddMember(newMemberData);

      // Clear form data from localStorage after successful submission
      removeFromLocalStorage(localStorageKeys.REGISTRATION_FORM);

      // Reset form
      setFormData({
        applicantName: "",
        fatherHusbandName: "",
        motherName: "",
        dob: "",
        age: "",
        gender: "",
        maritalStatus: "",
        monthlyIncome: "",
        occupation: "",
        residenceType: "",
        correspondenceAddress: "",
        permanentAddress: "",
        contact: "",
        email: "",
        pan: "",
        aadhar: "",
      });
      setSelectedMember("");
      setPhoto(null);
      setActiveStep(0);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 8,
          background: "linear-gradient(135deg,#e3f2fd,#ffffff)",
          p: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1e3a8a" }}
          >
            Add Member
          </Typography>

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Personal Info */}
          {activeStep === 0 && (
            <Box>
              <Box textAlign="center" mb={2}>
                <Avatar
                  src={photo}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "auto",
                    border: "2px solid #1976d2",
                  }}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input hidden accept="image/*" type="file" onChange={handlePhotoUpload} />
                  <PhotoCamera />
                </IconButton>
              </Box>
              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <InputLabel>Select Existing Member (Optional)</InputLabel>
                <Select value={selectedMember} onChange={handleMemberChange}>
                  <MenuItem value="">Create New Member</MenuItem>
                  {members.map((m) => (
                    <MenuItem key={m.memberId} value={m.memberId}>
                      {m.name} ({m.memberId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Applicant Name"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Father/Husband Name"
                name="fatherHusbandName"
                value={formData.fatherHusbandName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Mother Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  label="Gender"
                  onChange={handleChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Marital Status</InputLabel>
                <Select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  label="Marital Status"
                  onChange={handleChange}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                  <MenuItem value="divorced">Divorced</MenuItem>
                  <MenuItem value="widowed">Widowed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Step 2: Contact & Address */}
          {activeStep === 1 && (
            <Box>
              <TextField
                fullWidth
                label="Monthly Income"
                name="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Residence Type</InputLabel>
                <Select
                  name="residenceType"
                  value={formData.residenceType}
                  label="Residence Type"
                  onChange={handleChange}
                >
                  <MenuItem value="owned">Owned</MenuItem>
                  <MenuItem value="rented">Rented</MenuItem>
                  <MenuItem value="leased">Leased</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Correspondence Address"
                name="correspondenceAddress"
                multiline
                rows={3}
                value={formData.correspondenceAddress}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Permanent Address"
                name="permanentAddress"
                multiline
                rows={3}
                value={formData.permanentAddress}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
            </Box>
          )}

          {/* Step 3: Documents */}
          {activeStep === 2 && (
            <Box>
              <TextField
                fullWidth
                label="PAN Number"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Aadhar Number"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Upload Documents
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ mr: 2 }}
                >
                  Upload ID Proof
                  <input type="file" hidden />
                </Button>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  Upload Address Proof
                  <input type="file" hidden />
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 4: Preview */}
          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review Member Details
              </Typography>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography><strong>Name:</strong> {formData.applicantName}</Typography>
                <Typography><strong>Email:</strong> {formData.email}</Typography>
                <Typography><strong>Contact:</strong> {formData.contact}</Typography>
                <Typography><strong>Address:</strong> {formData.correspondenceAddress}</Typography>
                <Typography><strong>PAN:</strong> {formData.pan}</Typography>
                <Typography><strong>Aadhar:</strong> {formData.aadhar}</Typography>
              </Card>
              <Alert severity="info">
                Please review all details before submitting. The member will be added to the system.
              </Alert>
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              sx={{ borderRadius: 3 }}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              sx={{
                px: 4,
                borderRadius: 3,
                background: "linear-gradient(90deg,#1976d2,#42a5f5)",
              }}
            >
              {activeStep === steps.length - 1 ? "Confirm & Submit" : "Next"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

// Fee Collection Component
function FeeCollection({ members, onCollectFee }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Pending Fee Collection ({members.length} members)
      </Typography>
      {members.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          All membership fees are up to date!
        </Typography>
      ) : (
        members.map(member => (
          <Card key={member._id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" fontWeight={600}>{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{member.memberId}</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2">Due Amount: ₹{member.membershipFee.amount}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due: {new Date(member.membershipFee.dueDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Chip label="Payment Due" color="error" />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onCollectFee(member._id, { amount: member.membershipFee.amount })}
                  >
                    Collect Fee
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

// Profile Management Component
function ProfileManagement({ members, onKYCUpload }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [kycData, setKycData] = useState({ aadhar: '', pan: '', documents: [] });
  const [documentFiles, setDocumentFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setDocumentFiles(files);
    setKycData(prev => ({
      ...prev,
      documents: files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }))
    }));
  };

  const handleKYCSubmit = () => {
    if (selectedMember) {
      onKYCUpload(selectedMember._id, {
        ...kycData,
        aadhar: kycData.aadhar || selectedMember.kyc.aadhar,
        pan: kycData.pan || selectedMember.kyc.pan,
        verified: true
      });
      setKycData({ aadhar: '', pan: '', documents: [] });
      setDocumentFiles([]);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>Select Member</Typography>
        {members.map(member => (
          <Card
            key={member._id}
            sx={{
              mb: 1,
              cursor: 'pointer',
              backgroundColor: selectedMember?._id === member._id ? 'action.selected' : 'background.paper'
            }}
            onClick={() => {
              setSelectedMember(member);
              setKycData({
                aadhar: member.kyc.aadhar,
                pan: member.kyc.pan,
                documents: member.kyc.documents || []
              });
            }}
          >
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2">{member.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {member.memberId} • {member.status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <Grid item xs={12} md={8}>
        {selectedMember ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Manage {selectedMember.name}
            </Typography>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Contact Information</Typography>
              <Typography><strong>Email:</strong> {selectedMember.email}</Typography>
              <Typography><strong>Mobile:</strong> {selectedMember.mobile}</Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Address</Typography>
              <Typography>
                {selectedMember.address.street}, {selectedMember.address.city}, {selectedMember.address.state} - {selectedMember.address.pincode}
              </Typography>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>KYC Information</Typography>
              <Typography><strong>Aadhar:</strong> {selectedMember.kyc.aadhar}</Typography>
              <Typography><strong>PAN:</strong> {selectedMember.kyc.pan}</Typography>
              <KYCStatusChip
                label={selectedMember.kyc.verified ? "KYC Verified" : "KYC Pending"}
                verified={selectedMember.kyc.verified}
                sx={{ mt: 1, mb: 2 }}
              />

              {!selectedMember.kyc.verified && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Update KYC Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Aadhar Number"
                        value={kycData.aadhar}
                        onChange={(e) => setKycData({ ...kycData, aadhar: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PAN Number"
                        value={kycData.pan}
                        onChange={(e) => setKycData({ ...kycData, pan: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        component="label"
                        startIcon={<CloudUpload />}
                        variant="outlined"
                        sx={{ mr: 2 }}
                      >
                        Upload KYC Documents
                        <input
                          type="file"
                          hidden
                          multiple
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </Button>
                      {documentFiles.length > 0 && (
                        <Typography variant="body2">
                          {documentFiles.length} file(s) selected
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleKYCSubmit}
                        disabled={!kycData.aadhar || !kycData.pan}
                      >
                        Verify KYC
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Select a member to manage their profile
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}