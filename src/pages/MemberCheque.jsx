import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

function MemberChequeForm() {
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        memberId: "",
        chequeNo: "",
        dated: "",
        bankBranch: "",
        amount: "",
    });
    const [cheques, setCheques] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetch("/Member.json")
            .then((res) => res.json())
            .then((data) => setMembers(data))
            .catch((err) => console.error("Error loading members:", err));
    }, []);

    useEffect(() => {
        const savedCheques = JSON.parse(localStorage.getItem("cheques") || "[]");
        setCheques(savedCheques);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedMember = members.find((m) => m.memberId === formData.memberId);
        const newCheque = {
            ...formData,
            memberName: selectedMember?.name || "Unknown",
        };

        let updatedCheques = [];
        if (editIndex !== null) {
            updatedCheques = cheques.map((c, i) => (i === editIndex ? newCheque : c));
            setEditIndex(null);
        } else {
            updatedCheques = [...cheques, newCheque];
        }

        setCheques(updatedCheques);
        localStorage.setItem("cheques", JSON.stringify(updatedCheques));

        setFormData({
            memberId: "",
            chequeNo: "",
            dated: "",
            bankBranch: "",
            amount: "",
        });
    };

    const handleEdit = (index) => {
        const cheque = cheques[index];
        setFormData(cheque);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const updatedCheques = cheques.filter((_, i) => i !== index);
        setCheques(updatedCheques);
        localStorage.setItem("cheques", JSON.stringify(updatedCheques));
    };

    return (
        <Box p={3}>
            <Paper sx={{ p: 4, maxWidth: 600, mx: "auto", mb: 5, borderRadius: 3, boxShadow: 4 }}>
                <Typography variant="h5" mb={3} align="center" fontWeight={600}>
                    Member Cheque Details Form
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Select Member</InputLabel>
                                <Select
                                    name="memberId"
                                    value={formData.memberId}
                                    onChange={handleChange}
                                    label="Select Member"
                                >
                                    {members.map((member) => (
                                        <MenuItem key={member.memberId} value={member.memberId}>
                                            {member.name} ({member.memberId})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cheque No"
                                name="chequeNo"
                                value={formData.chequeNo}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Dated"
                                name="dated"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.dated}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Bank & Branch Name"
                                name="bankBranch"
                                value={formData.bankBranch}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12} textAlign="center">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ px: 4, py: 1.2, borderRadius: 2 }}
                            >
                                {editIndex !== null ? "Update Cheque" : "Submit Cheque"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {cheques.length > 0 && (
                <TableContainer
                    component={Paper}
                    sx={{ maxWidth: 900, mx: "auto", borderRadius: 3, boxShadow: 4 }}
                >
                    <Typography variant="h6" align="center" mb={2} mt={2} fontWeight={600}>
                        Submitted Cheque Details
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1976d2" }}>
                                <TableCell sx={{ color: "#fff" }}>Member Name</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Cheque No</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Dated</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Bank & Branch</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Amount</TableCell>
                                <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cheques.map((ch, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "#e3f2fd" : "#f1f8e9",
                                    }}
                                >
                                    <TableCell>{ch.memberName}</TableCell>
                                    <TableCell>{ch.chequeNo}</TableCell>
                                    <TableCell>{ch.dated}</TableCell>
                                    <TableCell>{ch.bankBranch}</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#d32f2f" }}>
                                        ₹{ch.amount}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(index)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(index)} color="error">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default MemberChequeForm;
