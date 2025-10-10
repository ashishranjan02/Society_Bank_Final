import React, { useState, useEffect } from "react";
import {
    Box, Card, CardContent, Typography, Avatar, IconButton, Grid, Dialog, DialogTitle,
    DialogContent, TextField, MenuItem, Button, Snackbar, Alert
} from "@mui/material";
import { Person } from "@mui/icons-material";

export default function GuarantorWithCheque() {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [chequeDialogOpen, setChequeDialogOpen] = useState(false);
    const [activeGuarantorIndex, setActiveGuarantorIndex] = useState(null);
    const [chequeForm, setChequeForm] = useState({ chequeNo: "", dated: "", bankBranch: "", amount: "" });
    const [snack, setSnack] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("members");
        if (saved) setMembers(JSON.parse(saved));
        else setMembers([]); // fetch from API if needed
    }, []);

    const openChequeDialog = (member, guarantorIndex) => {
        setSelectedMember(member);
        setActiveGuarantorIndex(guarantorIndex);
        setChequeForm({ chequeNo: "", dated: "", bankBranch: "", amount: "" });
        setChequeDialogOpen(true);
    };

    const handleChequeChange = (field, value) => setChequeForm(f => ({ ...f, [field]: value }));

    const addCheque = () => {
        if (!chequeForm.chequeNo || !chequeForm.dated || !chequeForm.bankBranch || !chequeForm.amount) {
            alert("Please fill all cheque details.");
            return;
        }

        const updatedMembers = members.map(m => {
            if (m.memberId === selectedMember.memberId) {
                const updatedGuarantors = m.guarantors.map((g, idx) => {
                    if (idx === activeGuarantorIndex) {
                        const existingCheques = g.cheques || [];
                        return { ...g, cheques: [...existingCheques, { ...chequeForm }] };
                    }
                    return g;
                });
                return { ...m, guarantors: updatedGuarantors };
            }
            return m;
        });

        // Update state
        setMembers(updatedMembers);

        // Save to localStorage
        localStorage.setItem("members", JSON.stringify(updatedMembers));

        // Close dialog and show snackbar
        setChequeDialogOpen(false);
        setSnack(true);
    };

    return (
        <Box p={2}>
            <Typography variant="h5" gutterBottom>Members & Guarantors</Typography>
            <Grid container spacing={2}>
                {members.map((m) => (
                    <Grid item xs={12} key={m.memberId}>
                        <Card sx={{ p: 1 }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar><Person /></Avatar>
                                    <Box>
                                        <Typography fontWeight={600}>{m.name}</Typography>
                                        <Typography variant="body2">Membership No: {m.memberId}</Typography>
                                    </Box>
                                </Box>

                                {m.guarantors?.length > 0 && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle1">Guarantors</Typography>
                                        <Grid container spacing={1} mt={0.5}>
                                            {m.guarantors.map((g, gi) => (
                                                <Grid item xs={12} sm={6} md={4} key={gi}>
                                                    <Card variant="outlined" sx={{ p: 1 }}>
                                                        <Box display="flex" gap={1} alignItems="center">
                                                            <Avatar src={g.photo} sx={{ width: 48, height: 48 }}>
                                                                {!g.photo && g.name ? g.name[0] : null}
                                                            </Avatar>
                                                            <Box flex={1}>
                                                                <Typography sx={{ fontWeight: 600 }}>{g.name || "N/A"}</Typography>
                                                                <Typography variant="body2">{g.mobile || "-"}</Typography>
                                                            </Box>
                                                            <Box>
                                                                <Button size="small" variant="outlined"
                                                                    onClick={() => openChequeDialog(m, gi)}>Add Cheque</Button>
                                                            </Box>
                                                        </Box>

                                                        {/* Show existing cheques */}
                                                        {g.cheques?.length > 0 && (
                                                            <Box mt={1}>
                                                                {g.cheques.map((c, ci) => (
                                                                    <Typography key={ci} variant="body2">
                                                                        Cheque: {c.chequeNo}, Date: {c.dated}, Bank: {c.bankBranch}, Amount: ₹{c.amount}
                                                                    </Typography>
                                                                ))}
                                                            </Box>
                                                        )}
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Cheque Dialog */}
            <Dialog open={chequeDialogOpen} onClose={() => setChequeDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Cheque for Guarantor</DialogTitle>
                <DialogContent>
                    <Box mt={1}>
                        <TextField
                            label="Cheque No"
                            fullWidth
                            margin="dense"
                            value={chequeForm.chequeNo}
                            onChange={e => handleChequeChange("chequeNo", e.target.value)}
                        />
                        <TextField
                            label="Dated"
                            type="date"
                            fullWidth
                            margin="dense"
                            InputLabelProps={{ shrink: true }}
                            value={chequeForm.dated}
                            onChange={e => handleChequeChange("dated", e.target.value)}
                        />
                        <TextField
                            label="Bank & Branch"
                            fullWidth
                            margin="dense"
                            value={chequeForm.bankBranch}
                            onChange={e => handleChequeChange("bankBranch", e.target.value)}
                        />
                        <TextField
                            label="Amount"
                            type="number"
                            fullWidth
                            margin="dense"
                            value={chequeForm.amount}
                            onChange={e => handleChequeChange("amount", e.target.value)}
                            inputProps={{
                                min: 0,
                                max: 1000000000,
                                step: 100
                            }}
                        />
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button variant="contained" onClick={addCheque}>Add Cheque</Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success">Cheque added successfully!</Alert>
            </Snackbar>
        </Box>
    );
}
