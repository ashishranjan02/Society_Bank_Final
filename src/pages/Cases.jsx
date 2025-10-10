import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Container,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import memberData from "../../public/Member.json";
import { Autocomplete } from "@mui/material";
export default function CaseFormDetail() {
  const [activeForm, setActiveForm] = useState("");
  const [searchMember, setSearchMember] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [members, setMembers] = useState([]);

  const generateId = () => Date.now() + "-" + Math.floor(Math.random() * 10000);

  const [cases138, setCases138] = useState(() => {
    const saved = localStorage.getItem("cases138");
    return saved ? JSON.parse(saved) : [];
  });

  const [casesRCS, setCasesRCS] = useState(() => {
    const saved = localStorage.getItem("casesRCS");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cases138", JSON.stringify(cases138));
  }, [cases138]);

  useEffect(() => {
    localStorage.setItem("casesRCS", JSON.stringify(casesRCS));
  }, [casesRCS]);

  const [form138, setForm138] = useState({
    selectedMember: "",
    caseNo: "",
    filingDate: "",
    courtName: "",
    caseName: "",
    chequeAmount: "",
    balance: "",
    previousDate: "",
    nextDate: "",
    advocate: "",
    accusedBail: "",
    status: "",
  });

  const handleChange138 = (e) => {
    setForm138({ ...form138, [e.target.name]: e.target.value });
  };

  const handleSubmit138 = (e) => {
    e.preventDefault();

    if (editId) {
      const updated = cases138.map((c) =>
        c.id === editId ? { ...c, ...form138 } : c
      );
      setCases138(updated);
      localStorage.setItem("cases138", JSON.stringify(updated));
      setEditId(null);
    } else {
      const newCase = { id: generateId(), ...form138 };
      const updatedCases = [...cases138, newCase];
      setCases138(updatedCases);
      localStorage.setItem("cases138", JSON.stringify(updatedCases));
    }

    setForm138({
      selectedMember: "",
      caseNo: "",
      filingDate: "",
      courtName: "",
      caseName: "",
      chequeAmount: "",
      balance: "",
      previousDate: "",
      nextDate: "",
      advocate: "",
      accusedBail: "",
      status: "",
    });
    setOpenForm(false);
  };

  const [formRCS, setFormRCS] = useState({
    selectedMember: "",
    borrowerName: "",
    address: "",
    pan: "",
    aadhar: "",
    mobile: "",
    email: "",
    rcsCaseNo: "",
    balance: "",
    guarantors: "",
    rcsFiled: "",
    awardDate: "",
    awardAmount: "",
    govtStatus: "",
    salaryAttachment: "",
    recoveryStatus: "",
  });

  const handleChangeRCS = (e) => {
    setFormRCS({ ...formRCS, [e.target.name]: e.target.value });
  };

  const handleSubmitRCS = (e) => {
    e.preventDefault();

    if (editId) {
      const updated = casesRCS.map((r) =>
        r.id === editId ? { ...r, ...formRCS } : r
      );
      setCasesRCS(updated);
      localStorage.setItem("casesRCS", JSON.stringify(updated));
      setEditId(null);
    } else {
      const newCase = { id: generateId(), ...formRCS };
      const updatedCases = [...casesRCS, newCase];
      setCasesRCS(updatedCases);
      localStorage.setItem("casesRCS", JSON.stringify(updatedCases));
    }

    setFormRCS({
      selectedMember: "",
      borrowerName: "",
      address: "",
      pan: "",
      aadhar: "",
      mobile: "",
      email: "",
      rcsCaseNo: "",
      balance: "",
      guarantors: "",
      rcsFiled: "",
      awardDate: "",
      awardAmount: "",
      govtStatus: "",
      salaryAttachment: "",
      recoveryStatus: "",
    });
    setOpenForm(false);
  };

  // --- Delete Functions ---
  const handleDelete138 = (id) => {
    const updated = cases138.filter((c) => c.id !== id);
    setCases138(updated);
    localStorage.setItem("cases138", JSON.stringify(updated));
  };

  const handleDeleteRCS = (id) => {
    const updated = casesRCS.filter((r) => r.id !== id);
    setCasesRCS(updated);
    localStorage.setItem("casesRCS", JSON.stringify(updated));
  };

  // --- Edit Functions ---
  const handleEdit138 = (caseData) => {
    setForm138(caseData);
    setActiveForm("138");
    setOpenForm(true);
    setEditId(caseData.id);
  };

  const handleEditRCS = (caseData) => {
    setFormRCS(caseData);
    setActiveForm("RCS");
    setOpenForm(true);
    setEditId(caseData.id);
  };

  // Load member data
  useEffect(() => {
    const stored = localStorage.getItem("members");
    if (stored) {
      setMembers(JSON.parse(stored));
    } else {
      setMembers(memberData);
      localStorage.setItem("members", JSON.stringify(memberData));
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={4}>
        <Typography variant="h5" gutterBottom>
          Case Management
        </Typography>

        <Box mt={2} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setActiveForm("138");
              setOpenForm(true);
              setEditId(null);
            }}
          >
            Add Section 138 Case
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setActiveForm("RCS");
              setOpenForm(true);
              setEditId(null);
            }}
          >
            Add RCS Case
          </Button>
          <Button
  variant="contained"
  color="success"
  onClick={() => {
    setActiveForm("showCases");
    setOpenForm(true);
  }}
>
  Show Cases
</Button>

        </Box>
      </Box>

      {/* ------------------ 138 FORM ------------------ */}
      {openForm && activeForm === "138" && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">DETAILS OF CASE UNDER SECTION 138</Typography>
            <Button onClick={() => setOpenForm(false)} color="error">
              Close
            </Button>
          </Box>

          <form onSubmit={handleSubmit138}>
            <Grid container spacing={2} mt={1}>
              {/* Select Member Dropdown */}
              <Grid item xs={4}>
                <Typography>Select Member</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  select
                  fullWidth
                  name="selectedMember"
                  value={form138.selectedMember}
                  onChange={handleChange138}
                  variant="outlined"
                  size="small"
                >
                  {members.map((m, i) => (
                    <MenuItem key={i} value={m.name || m.memberName}>
                      {m.name || m.memberName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Other Fields */}
              {[
                { label: "Case No.", name: "caseNo" },
                { label: "Date of Filing", name: "filingDate", type: "date" },
                { label: "Court Name & No.", name: "courtName" },
                { label: "Case Name", name: "caseName" },
                { label: "Cheque Amount", name: "chequeAmount", type: "number" },
                { label: "Balance (as on 31.05.23)", name: "balance", type: "number" },
                { label: "Previous Date", name: "previousDate", type: "date" },
                { label: "Next Date", name: "nextDate", type: "date" },
              ].map((field, idx) => (
                <React.Fragment key={idx}>
                  <Grid item xs={4}>
                    <Typography>{field.label}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      name={field.name}
                      type={field.type || "text"}
                      value={form138[field.name]}
                      onChange={handleChange138}
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: field.type === "date" }}
                    />
                  </Grid>
                </React.Fragment>
              ))}

              <Grid item xs={4}>
                <Typography>Advocate</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  select
                  fullWidth
                  name="advocate"
                  value={form138.advocate}
                  onChange={handleChange138}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Petitioner">Petitioner</MenuItem>
                  <MenuItem value="Respondent">Respondent</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={4}>
                <Typography>Accused Bail/Reason</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="accusedBail"
                  value={form138.accusedBail}
                  onChange={handleChange138}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={4}>
                <Typography>Present Status</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  select
                  fullWidth
                  name="status"
                  value={form138.status}
                  onChange={handleChange138}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Disposed">Disposed</MenuItem>
                  <MenuItem value="Appealed">Appealed</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box textAlign="center" mt={4}>
              <Button type="submit" variant="contained">
                {editId ? "Update Case" : "Save Case"}
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* ------------------ RCS FORM ------------------ */}
      {openForm && activeForm === "RCS" && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">DETAILS OF RCS CASE</Typography>
            <Button onClick={() => setOpenForm(false)} color="error">
              Close
            </Button>
          </Box>

          <form onSubmit={handleSubmitRCS}>
            <Grid container spacing={2} mt={1}>
              {/* Select Member Dropdown */}
              <Grid item xs={4}>
                <Typography>Select Member</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  select
                  fullWidth
                  name="selectedMember"
                  value={formRCS.selectedMember}
                  onChange={handleChangeRCS}
                  variant="outlined"
                  size="small"
                >
                  {members.map((m, i) => (
                    <MenuItem key={i} value={m.name || m.memberName}>
                      {m.name || m.memberName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {[
                { label: "Name of Borrower & Membership No.", name: "borrowerName" },
                { label: "Address", name: "address" },
                { label: "PAN", name: "pan" },
                { label: "Aadhar", name: "aadhar" },
                { label: "Mobile", name: "mobile" },
                { label: "Email", name: "email" },
                { label: "RCS Case No.", name: "rcsCaseNo" },
                { label: "Balance as on (31.05.23)", name: "balance", type: "number" },
                { label: "Guarantors' Name & M.No.", name: "guarantors" },
                { label: "RCS Filed & Degree?", name: "rcsFiled" },
                { label: "Date of Award/Degree", name: "awardDate", type: "date" },
                { label: "Amount of Award", name: "awardAmount", type: "number" },
                { label: "Govt. Employee Status", name: "govtStatus" },
              ].map((field, idx) => (
                <React.Fragment key={idx}>
                  <Grid item xs={4}>
                    <Typography>{field.label}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      name={field.name}
                      type={field.type || "text"}
                      value={formRCS[field.name]}
                      onChange={handleChangeRCS}
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: field.type === "date" }}
                    />
                  </Grid>
                </React.Fragment>
              ))}

              <Grid item xs={4}>
                <Typography>Salary Attachment or Reason</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  name="salaryAttachment"
                  value={formRCS.salaryAttachment}
                  onChange={handleChangeRCS}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={4}>
                <Typography>Present Status of Recovery</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  name="recoveryStatus"
                  value={formRCS.recoveryStatus}
                  onChange={handleChangeRCS}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            <Box textAlign="center" mt={4}>
              <Button type="submit" variant="contained">
                {editId ? "Update RCS Case" : "Save RCS Case"}
              </Button>
            </Box>
          </form>
        </Paper>
      )}


{/* ---------- SHOW ALL CASES BY MEMBER WITH SEARCH ---------- */}
{openForm && activeForm === "showCases" && (
  <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6">All Members & Their Cases</Typography>
      <Button onClick={() => setOpenForm(false)} color="error">
        Close
      </Button>
    </Box>

    {/* Autocomplete Search */}
    <Box mb={3}>
      <Autocomplete
        options={members.map((m) => m.name || m.memberName)}
        value={searchMember}
        onChange={(event, newValue) => setSearchMember(newValue || "")}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            placeholder="Search member by name..."
          />
        )}
        freeSolo
      />
    </Box>

    {members
      .filter((m) => {
        const memberName = m.name || m.memberName;
        return memberName.toLowerCase().includes(searchMember.toLowerCase());
      })
      .map((m) => {
        const memberName = m.name || m.memberName;
        const memberCases138 = cases138.filter(
          (c) => c.selectedMember === memberName
        );
        const memberCasesRCS = casesRCS.filter(
          (r) => r.selectedMember === memberName
        );

        if (memberCases138.length === 0 && memberCasesRCS.length === 0) return null;

        return (
          <Box
            key={memberName}
            sx={{
              mt: 3,
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="h6" color="primary">
              {memberName}
            </Typography>

            {memberCases138.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Section 138 Cases
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Case No.</TableCell>
                      <TableCell>Case Name</TableCell>
                      <TableCell>Court</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {memberCases138.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.caseNo}</TableCell>
                        <TableCell>{c.caseName}</TableCell>
                        <TableCell>{c.courtName}</TableCell>
                        <TableCell>{c.status || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}

            {memberCasesRCS.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  RCS Cases
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>RCS Case No.</TableCell>
                      <TableCell>Borrower</TableCell>
                      <TableCell>Award Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {memberCasesRCS.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.rcsCaseNo}</TableCell>
                        <TableCell>{r.borrowerName}</TableCell>
                        <TableCell>{r.awardAmount}</TableCell>
                        <TableCell>{r.recoveryStatus || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Box>
        );
      })}
  </Paper>
)}



      {/* ---------- Section 138 TABLE ---------- */}
      {activeForm !== "showCases" && cases138.length > 0 && (
        <Paper elevation={4} sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
          <Box
            sx={{
              background: "linear-gradient(90deg, #1976d2, #42a5f5)",
              color: "#fff",
              p: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Saved Section 138 Cases
            </Typography>
          </Box>

          <Table>
            <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Member</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Case No.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Case Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Court</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases138.map((c) => (
                <TableRow
                  key={c.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f1f8ff",
                      transition: "0.3s",
                    },
                  }}
                >
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.selectedMember || "N/A"}</TableCell>
                  <TableCell>{c.caseNo}</TableCell>
                  <TableCell>{c.caseName}</TableCell>
                  <TableCell>{c.courtName}</TableCell>
                  <TableCell>
                    <Chip
                      label={c.status || "N/A"}
                      color={
                        c.status === "Disposed"
                          ? "success"
                          : c.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit138(c)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete138(c.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ---------- RCS TABLE ---------- */}
      {activeForm !== "showCases" && casesRCS.length > 0 && (
        <Paper elevation={4} sx={{ mt: 4, borderRadius: 3, overflow: "hidden" }}>
          <Box
            sx={{
              background: "linear-gradient(90deg, #ff9800, #ffb74d)",
              color: "#fff",
              p: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Saved RCS Cases
            </Typography>
          </Box>

          <Table>
            <TableHead sx={{ backgroundColor: "#fff3e0" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Member</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Borrower</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>RCS Case No.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Award Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {casesRCS.map((r) => (
                <TableRow
                  key={r.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#fff8e1",
                      transition: "0.3s",
                    },
                  }}
                >
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.selectedMember || "N/A"}</TableCell>
                  <TableCell>{r.borrowerName}</TableCell>
                  <TableCell>{r.rcsCaseNo}</TableCell>
                  <TableCell>{r.awardAmount}</TableCell>
                  <TableCell>
                    <Chip
                      label={r.recoveryStatus || "N/A"}
                      color={
                        r.recoveryStatus?.includes("Recovered")
                          ? "success"
                          : r.recoveryStatus?.includes("Pending")
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditRCS(r)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteRCS(r.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
