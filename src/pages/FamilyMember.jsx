// src/pages/FamilyDetailsWow.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Collapse,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Divider,
    Tooltip,
} from "@mui/material";
import {
    ExpandMore,
    Add,
    Remove,
    FamilyRestroom,
    Person,
    Groups,
    AccountBalance,
    Edit,
    Delete,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import memberData from "../../public/Member.json";

export default function FamilyDetailsWow() {
    const steps = ["Borrower Info", "Family Members", "Society / Loan", "Review"];

    const [activeStep, setActiveStep] = useState(0);
    const [expanded, setExpanded] = useState(null);
    const [members, setMembers] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);

    const [formData, setFormData] = useState({
        borrowerId: "",
        borrowerName: "",
        mobile: "",
        fatherSpouse: "",
        fatherMobile: "",
        fatherEmail: "",
        mother: "",
        children: [],
        brothers: [],
        sisters: [],
        familyMemberSociety: "",
        societyDetails: "",
        familyMemberLoan: "",
        loanDetails: "",
    });

    useEffect(() => {
        setMembers(memberData);

        const savedData = localStorage.getItem("familyFormData");
        if (savedData) setFormData(JSON.parse(savedData));

        const savedSubmissions = localStorage.getItem("allFamilySubmissions");
        if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
    }, []);

    useEffect(() => {
        localStorage.setItem("familyFormData", JSON.stringify(formData));
    }, [formData]);

    const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

    const handleBorrowerSelect = (memberId) => {
        const member = members.find((m) => m.memberId === memberId);
        if (member) {
            setFormData({
                ...formData,
                borrowerId: member.memberId,
                borrowerName: member.name,
                mobile: member.mobile || "",
            });
        }
    };

    const handleArrayChange = (field, index, value) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const addMember = (field) => setFormData({ ...formData, [field]: [...formData[field], ""] });
    const removeMember = (field, index) => {
        const updated = [...formData[field]];
        updated.splice(index, 1);
        setFormData({ ...formData, [field]: updated });
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const toggleExpand = (section) => setExpanded(expanded === section ? null : section);

    const handleSubmit = () => {
        const savedSubmissions = JSON.parse(localStorage.getItem("allFamilySubmissions")) || [];
        let updatedSubmissions = [];

        if (editingIndex !== null) {
            savedSubmissions[editingIndex] = formData;
            updatedSubmissions = [...savedSubmissions];
            setEditingIndex(null);
        } else {
            updatedSubmissions = [...savedSubmissions, formData];
        }

        localStorage.setItem("allFamilySubmissions", JSON.stringify(updatedSubmissions));
        setSubmissions(updatedSubmissions);

        alert("Form Submitted Successfully!");
        setFormData({
            borrowerId: "",
            borrowerName: "",
            mobile: "",
            fatherSpouse: "",
            fatherMobile: "",
            fatherEmail: "",
            mother: "",
            children: [],
            brothers: [],
            sisters: [],
            familyMemberSociety: "",
            societyDetails: "",
            familyMemberLoan: "",
            loanDetails: "",
        });
        setActiveStep(0);
    };

    const handleEdit = (index) => {
        setFormData(submissions[index]);
        setActiveStep(0);
        setEditingIndex(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (index) => {
        const updated = [...submissions];
        updated.splice(index, 1);
        setSubmissions(updated);
        localStorage.setItem("allFamilySubmissions", JSON.stringify(updated));
    };

    return (
        <Box sx={{ minHeight: "100vh", py: 5, backgroundColor: "#f5f5f5" }}>
            <Container maxWidth="md">
                <Paper elevation={6} sx={{ display: "flex", flexDirection: "column", borderRadius: 4, p: 4 }}>
                    <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 3, gap: 1 }}>
                        <FamilyRestroom color="primary" fontSize="large" />
                        <Typography variant="h4" sx={{ fontWeight: 600, borderBottom: "2px solid #1976d2", pb: 1 }}>
                            Family Member Detail
                        </Typography>
                    </Box>

                    {/* Stepper */}
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Animated Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Step Contents (Same as before) */}
                            {activeStep === 0 && (
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Borrower Name</InputLabel>
                                            <Select value={formData.borrowerId || ""} onChange={(e) => handleBorrowerSelect(e.target.value)}>
                                                {members.map((m) => (
                                                    <MenuItem key={m.memberId} value={m.memberId}>
                                                        {m.name} ({m.memberId})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Mobile Number"
                                            fullWidth
                                            value={formData.mobile}
                                            onChange={(e) => handleChange("mobile", e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            {activeStep === 1 && (
                                <Box>
                                    {/* Father / Spouse */}
                                    <Card sx={{ mb: 2, borderLeft: "5px solid #1976d2" }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                <Person sx={{ mr: 1 }} /> Father / Spouse
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Name"
                                                        fullWidth
                                                        value={formData.fatherSpouse}
                                                        onChange={(e) => handleChange("fatherSpouse", e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Mobile"
                                                        fullWidth
                                                        value={formData.fatherMobile}
                                                        onChange={(e) => handleChange("fatherMobile", e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        label="Email"
                                                        fullWidth
                                                        value={formData.fatherEmail}
                                                        onChange={(e) => handleChange("fatherEmail", e.target.value)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    {/* Mother */}
                                    <Card sx={{ mb: 2, borderLeft: "5px solid #f50057" }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                <Person sx={{ mr: 1 }} /> Mother
                                            </Typography>
                                            <TextField
                                                label="Mother’s Name"
                                                fullWidth
                                                value={formData.mother}
                                                onChange={(e) => handleChange("mother", e.target.value)}
                                            />
                                        </CardContent>
                                    </Card>

                                    {/* Children / Brothers / Sisters */}
                                    {["children", "brothers", "sisters"].map((field, i) => (
                                        <Card key={field} sx={{ mb: 2, borderLeft: "5px solid #ff9800" }}>
                                            <CardContent>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    onClick={() => toggleExpand(field)}
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    <Typography variant="h6">
                                                        <Groups sx={{ mr: 1 }} />
                                                        {i === 0 ? "Children" : i === 1 ? "Brothers" : "Sisters"}
                                                    </Typography>
                                                    <IconButton>
                                                        <ExpandMore
                                                            sx={{ transform: expanded === field ? "rotate(180deg)" : "rotate(0)", transition: "0.3s" }}
                                                        />
                                                    </IconButton>
                                                </Box>
                                                <Collapse in={expanded === field} timeout="auto">
                                                    <Box sx={{ mt: 2 }}>
                                                        {formData[field].map((val, idx) => (
                                                            <Box key={idx} display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                                                                <TextField
                                                                    label={`${field.slice(0, -1)} ${idx + 1}`}
                                                                    fullWidth
                                                                    value={val}
                                                                    onChange={(e) => handleArrayChange(field, idx, e.target.value)}
                                                                />
                                                                <IconButton color="error" onClick={() => removeMember(field, idx)}>
                                                                    <Remove />
                                                                </IconButton>
                                                            </Box>
                                                        ))}
                                                        <Button variant="outlined" startIcon={<Add />} onClick={() => addMember(field)}>
                                                            Add {field.slice(0, -1)}
                                                        </Button>
                                                    </Box>
                                                </Collapse>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            )}

                            {activeStep === 2 && (
                                <Box>
                                    {/* Society Membership */}
                                    <Card sx={{ mb: 2, borderLeft: "5px solid #4caf50" }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                <AccountBalance sx={{ mr: 1 }} /> Society Membership
                                            </Typography>
                                            <FormControl fullWidth>
                                                <InputLabel>Yes / No</InputLabel>
                                                <Select
                                                    value={formData.familyMemberSociety}
                                                    onChange={(e) => handleChange("familyMemberSociety", e.target.value)}
                                                >
                                                    <MenuItem value="Yes">Yes</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {formData.familyMemberSociety === "Yes" && (
                                                <TextField
                                                    label="Membership Details"
                                                    fullWidth
                                                    sx={{ mt: 2 }}
                                                    value={formData.societyDetails}
                                                    onChange={(e) => handleChange("societyDetails", e.target.value)}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Loan */}
                                    <Card sx={{ mb: 2, borderLeft: "5px solid #9c27b0" }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                <AccountBalance sx={{ mr: 1 }} /> Loan
                                            </Typography>
                                            <FormControl fullWidth>
                                                <InputLabel>Yes / No</InputLabel>
                                                <Select
                                                    value={formData.familyMemberLoan}
                                                    onChange={(e) => handleChange("familyMemberLoan", e.target.value)}
                                                >
                                                    <MenuItem value="Yes">Yes</MenuItem>
                                                    <MenuItem value="No">No</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {formData.familyMemberLoan === "Yes" && (
                                                <TextField
                                                    label="Loan Details"
                                                    fullWidth
                                                    sx={{ mt: 2 }}
                                                    value={formData.loanDetails}
                                                    onChange={(e) => handleChange("loanDetails", e.target.value)}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Box>
                            )}

                            {activeStep === 3 && (
                                <Box>
                                    <Typography variant="h5" gutterBottom>
                                        Review Your Details
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Card sx={{ borderLeft: "5px solid #1976d2" }}>
                                                <CardContent>
                                                    <Typography variant="subtitle1">Borrower</Typography>
                                                    <Typography>{formData.borrowerName}</Typography>
                                                    <Typography>{formData.mobile}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Card sx={{ borderLeft: "5px solid #f50057" }}>
                                                <CardContent>
                                                    <Typography variant="subtitle1">Parents</Typography>
                                                    <Typography>Father/Spouse: {formData.fatherSpouse}</Typography>
                                                    <Typography>Mobile: {formData.fatherMobile}</Typography>
                                                    <Typography>Email: {formData.fatherEmail}</Typography>
                                                    <Typography>Mother: {formData.mother}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        {["children", "brothers", "sisters"].map(
                                            (field) =>
                                                formData[field].length > 0 && (
                                                    <Grid item xs={12} key={field}>
                                                        <Card sx={{ borderLeft: "5px solid #ff9800" }}>
                                                            <CardContent>
                                                                <Typography variant="subtitle1">
                                                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                                                </Typography>
                                                                <Typography>{formData[field].join(", ")}</Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                )
                                        )}
                                    </Grid>

                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid item xs={6}>
                                            <Card sx={{ borderLeft: "5px solid #4caf50" }}>
                                                <CardContent>
                                                    <Typography variant="subtitle1">Society Membership</Typography>
                                                    <Typography>{formData.familyMemberSociety}</Typography>
                                                    <Typography>{formData.societyDetails}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card sx={{ borderLeft: "5px solid #9c27b0" }}>
                                                <CardContent>
                                                    <Typography variant="subtitle1">Loan</Typography>
                                                    <Typography>{formData.familyMemberLoan}</Typography>
                                                    <Typography>{formData.loanDetails}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                            Back
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button variant="contained" onClick={handleSubmit}>
                                {editingIndex !== null ? "Update" : "Submit"}
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Box>
                </Paper>

                {/* Submitted Forms List */}
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h5" gutterBottom>
                        Submitted Family Details
                    </Typography>
                    {submissions.length === 0 ? (
                        <Typography>No submissions yet.</Typography>
                    ) : (
                        submissions.map((sub, idx) => (
                            <Card key={idx} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={10}>
                                            <Typography variant="subtitle1">Borrower: {sub.borrowerName}</Typography>
                                            <Typography>Father: {sub.fatherSpouse}</Typography>
                                            <Typography>Mother: {sub.mother}</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Tooltip title="Edit">
                                                <IconButton color="primary" onClick={() => handleEdit(idx)}>
                                                    <Edit />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={() => handleDelete(idx)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
            </Container>
        </Box>
    );
}
