import React, { useState, useEffect } from "react";
import {
    Box, TextField, Button, MenuItem, Dialog, DialogContent, DialogTitle, Stepper, Step, StepLabel,
    Typography, Grid, InputAdornment, IconButton, Radio, RadioGroup, FormControlLabel, FormControl,
    FormLabel, Snackbar, Alert, Tabs, Tab, Card, CardContent, Avatar
} from "@mui/material";
import { Search, Clear, Close, Person, Visibility } from "@mui/icons-material";

const steps = ["Personal Information", "Contact & References", "Documents", "Bank Details", "Guarantee Details", "Preview & Submit"];
const fieldConfig = {
    0: [{ name: "name", label: "Name of Guarantor" }, { name: "fatherName", label: "Father's Name" },
    { name: "motherName", label: "Mother's Name" }, { name: "dob", label: "Date of Birth", type: "date" },
    { name: "age", label: "Age in Years", type: "number" }, { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { name: "maritalStatus", label: "Marital Status", type: "select", options: ["Married", "Unmarried", "Divorced", "Widowed"] },
    { name: "membershipId", label: "Membership ID", helper: "Select membership id if any" },
    { name: "membershipDate", label: "Membership Date", type: "date" },
    { name: "qualification", label: "Qualification (if professional, mention institute name)" },
    { name: "familyMemberSociety", label: "Any family member in society? (if yes, mention name & membership no.)", full: true },
    { name: "creditAmount", label: "Amount in credit as on (31.05.2025)", type: "number" },
    { name: "referenceName", label: "Reference Name" }, { name: "referenceNumber", label: "Reference Contact No." }],
    1: [{ name: "mobile", label: "Mobile / Landline No." }, { name: "email", label: "Email" },
    { name: "permanentAddress", label: "Permanent Address", full: true },
    { name: "currentAddress", label: "Current Residential Address", full: true },
    { name: "witnessName", label: "Witness Name" }, { name: "witnessNumber", label: "Witness Contact No." },
    { name: "staffReference", label: "Staff Reference (if any)" }, { name: "otherFamilyContact", label: "Any other family contact no." }],
    2: [{ name: "pan", label: "PAN No." }, { name: "aadhar", label: "Aadhar No." },
    { name: "passport", label: "Passport No." }, { name: "rationOrDL", label: "Ration Card / Driving License" },
    { name: "photo", label: "Upload Passport Size Photo", type: "file", full: true }],
    3: [{ name: "bankName", label: "Bank Name" }, { name: "branch", label: "Branch" },
    { name: "accountNo", label: "Account Number" }, { name: "ifsc", label: "IFSC Code" },
    { name: "chequeCopy", label: "Upload Attached Cheque Copy", type: "file", full: true },
    { name: "passbook", label: "Upload Passbook Copy", type: "file", full: true }],
    4: [{ name: "givenGuaranteeOther", label: "Guarantor has given guarantee in other loans?", type: "radio", options: ["Yes", "No"], full: true },
    { name: "otherSocietyName", label: "Society Name (if Yes)", conditional: "givenGuaranteeOther" },
    { name: "otherGuaranteeAmount", label: "Amount of Guarantee (if Yes)", type: "number", conditional: "givenGuaranteeOther" },
    { name: "givenGuaranteeOur", label: "Guarantor has given guarantee in our society?", type: "radio", options: ["Yes", "No"], full: true, after: true },
    { name: "ourMemberName", label: "Member Name", conditional: "givenGuaranteeOur" },
    { name: "ourMembershipNo", label: "Membership No.", conditional: "givenGuaranteeOur" },
    { name: "ourLoanAmount", label: "Amount of Loan", type: "number", conditional: "givenGuaranteeOur" },
    { name: "loanStatus", label: "Regular / Irregular", type: "select", options: ["regular", "irregular"], conditional: "givenGuaranteeOur" },
    { name: "loanSince", label: "Since When", type: "date", conditional: "givenGuaranteeOur" }]
};

function RenderFields({
    fields, formData, handleChange, handleFileChange, previews, errors, index, members, selected, allForms
}) {

    const usedIds = allForms
        .map((g, gi) => (gi === index ? null : g?.membershipId))
        .filter(Boolean);

    return (
        <Grid container spacing={2}>
            {fields.map(f => {
                if (f.conditional && !formData[f.conditional]) return null;

                if (f.name === "membershipId") {
                    return (
                        <Grid key={f.name} item xs={12} sm={f.full ? 12 : 6}>
                            <TextField
                                select
                                label={f.label}
                                fullWidth
                                value={formData[f.name] || ""}
                                onChange={e => handleChange(index, f.name, e.target.value)}
                                helperText={f.helper || ""}
                            >
                                <MenuItem value="">Select Member ID</MenuItem>
                                {members
                                    .filter(m => String(m.memberId) !== String(selected?.memberId) && !usedIds.includes(m.memberId))
                                    .map(m => <MenuItem key={m.memberId} value={m.memberId}>{m.memberId}{m.name ? ` - ${m.name}` : ""}</MenuItem>)}
                            </TextField>
                        </Grid>
                    );
                }

                if (f.type === "select") {
                    return (
                        <Grid key={f.name} item xs={12} sm={f.full ? 12 : 6}>
                            <TextField select label={f.label} fullWidth value={formData[f.name] || ""}
                                onChange={e => handleChange(index, f.name, e.target.value)}>
                                <MenuItem value="">Select</MenuItem>
                                {f.options.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                            </TextField>
                        </Grid>
                    );
                }
                if (f.type === "file") {
                    return (
                        <Grid key={f.name} item xs={12} sm={f.full ? 12 : 6}>
                            <Box>
                                <Button variant="contained" component="label">{f.label}
                                    <input hidden accept="image/*" type="file" onChange={e => handleFileChange(index, f.name, e)} />
                                </Button>
                                {previews?.[f.name] && <Box mt={1}><img src={previews[f.name]} alt="preview" width={120} /></Box>}
                            </Box>
                        </Grid>
                    );
                }
                if (f.type === "radio") {
                    return (
                        <Grid key={f.name} item xs={12} sm={f.full ? 12 : 6}>
                            <FormControl fullWidth>
                                <FormLabel>{f.label}</FormLabel>
                                <RadioGroup row value={formData[f.name] ? "Yes" : "No"}
                                    onChange={e => handleChange(index, f.name, e.target.value === "Yes")}>
                                    {f.options.map(opt => <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />)}
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    );
                }
                return (
                    <Grid key={f.name} item xs={12} sm={f.full ? 12 : 6}>
                        <TextField
                            type={f.type || "text"}
                            label={f.label}
                            fullWidth
                            InputLabelProps={f.type === "date" ? { shrink: true } : {}}
                            value={formData[f.name] || ""}
                            helperText={errors?.[f.name] || f.helper || ""}
                            error={Boolean(errors?.[f.name])}
                            onChange={e => handleChange(index, f.name, e.target.value)}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
}
export default function Guarantor() {
    const [members, setMembers] = useState([]),
        [filtered, setFiltered] = useState([]),
        [search, setSearch] = useState(""),
        [status, setStatus] = useState(""),
        [open, setOpen] = useState(false),
        [step, setStep] = useState(0),
        // three slots for upto 3 guarantors in dialog
        [formData, setForm] = useState([{}, {}, {}]),
        [previews, setPreviews] = useState([{}, {}, {}]),
        [selected, setSelected] = useState(null),
        [snack, setSnack] = useState(false),
        [errors, setErrors] = useState([{}, {}, {}]),
        [activeGuarantor, setActiveGuarantor] = useState(0),
        [viewOpen, setViewOpen] = useState(false),
        [viewData, setViewData] = useState(null);
    useEffect(() => {
        const saved = localStorage.getItem("members");
        if (saved) { const p = JSON.parse(saved); setMembers(p); setFiltered(p); }
        else {
            fetch("/Member.json").then(r => r.json()).then(d => {
                const arr = Array.isArray(d) ? d : (d.members || []);
                setMembers(arr); setFiltered(arr);
            }).catch(() => { setMembers([]); setFiltered([]); });
        }
    }, []);
    useEffect(() => { if (members.length) localStorage.setItem("members", JSON.stringify(members)); }, [members]);
    useEffect(() => {
        const q = search.trim().toLowerCase();
        let res = members.filter(m => `${m.name || ""} ${m.memberId || ""} ${m.email || ""} ${m.mobile || ""}`.toLowerCase().includes(q));
        if (status) res = res.filter(m => (m.status || "").toLowerCase() === status.toLowerCase());
        setFiltered(res);
    }, [search, status, members]);
    const handleChange = (i, f, v) => {
        setForm(p => {
            const c = [...p];
            c[i] = { ...c[i], [f]: v };
            if (f === "membershipId" && v) {
                const m = members.find(mm => String(mm.memberId) === String(v));
                if (m) {
                    const addr = m.address || {};
                    c[i] = {
                        ...c[i],
                        membershipId: m.memberId,
                        name: m.name || c[i].name,
                        dob: m.dob || c[i].dob,
                        mobile: m.mobile || c[i].mobile,
                        permanentAddress: `${addr.street || ""}${addr.street ? ", " : ""}${addr.city || ""}${addr.city ? ", " : ""}${addr.state || ""}${addr.pincode ? " - " + addr.pincode : ""}`,
                        pan: m.kyc?.pan || c[i].pan || "",
                        aadhar: m.kyc?.aadhar || c[i].aadhar || ""
                    };
                }
            }
            return c;
        });
    };
    const handleFileChange = (i, f, e) => {
        const file = e.target.files?.[0]; if (!file) return;
        setForm(p => { const a = [...p]; a[i] = { ...a[i], [f]: file }; return a; });
        setPreviews(p => { const a = [...p]; a[i] = { ...a[i], [f]: URL.createObjectURL(file) }; return a; });
    };
    // Add guarantor dialog opener - check existing count
    const openAddGuarantorDialog = () => {
        if (!selected) { alert("Select a member first."); return; }
        const existing = (selected.guarantors || []).length;
        if (existing >= 3) {
            alert("This member already has maximum 3 guarantors.");
            return;
        }
        setForm([{}, {}, {}]);
        setPreviews([{}, {}, {}]);
        setStep(0);
        setActiveGuarantor(0);
        setOpen(true);
    };
    const submit = () => {
        if (!selected) { alert("Please select a member first."); return; }
        // build new guarantors from formData
        const toSaveRaw = formData.reduce((acc, g, i) => {
            const has = (g.name && String(g.name).trim()) || (g.membershipId && String(g.membershipId).trim()) || (g.mobile && String(g.mobile).trim());
            if (has) {
                const c = { ...g };
                // convert file objects to their preview URL for storage (same behaviour as before)
                ["photo", "chequeCopy", "passbook"].forEach(f => { if (c[f] instanceof File) c[f] = previews[i]?.[f] || ""; });
                acc.push(c);
            }
            return acc;
        }, []);

        if (!toSaveRaw.length) { alert("Please fill at least one guarantor before submitting!"); return; }

        const existing = selected.guarantors || [];

        // Create quick lookup for existing guarantors by membershipId or mobile
        const existingKeys = new Set();
        existing.forEach(ex => {
            const k1 = ex.membershipId ? `id:${String(ex.membershipId)}` : null;
            const k2 = ex.mobile ? `m:${String(ex.mobile)}` : null;
            if (k1) existingKeys.add(k1);
            if (k2) existingKeys.add(k2);
        });

        // Filter out duplicates (both against existing and duplicates within the new batch)
        const seenNew = new Set();
        const uniqueNew = toSaveRaw.filter(g => {
            const kId = g.membershipId ? `id:${String(g.membershipId)}` : null;
            const kMobile = g.mobile ? `m:${String(g.mobile)}` : null;

            // if either key exists in existing, skip
            if ((kId && existingKeys.has(kId)) || (kMobile && existingKeys.has(kMobile))) {
                console.warn('Skipping duplicate (already exists):', g);
                return false;
            }

            // if duplicate within the batch
            if (kId && seenNew.has(kId)) { console.warn('Skipping duplicate in batch (membershipId):', g); return false; }
            if (kMobile && seenNew.has(kMobile)) { console.warn('Skipping duplicate in batch (mobile):', g); return false; }

            if (kId) seenNew.add(kId);
            if (kMobile) seenNew.add(kMobile);

            return true;
        });

        if (!uniqueNew.length) {
            alert("All entered guarantors already exist for this member or were duplicates in your input.");
            return;
        }

        const existingCount = existing.length;
        if (existingCount + uniqueNew.length > 3) {
            alert(`Cannot add ${uniqueNew.length} guarantor(s). This member already has ${existingCount} guarantor(s). Maximum allowed is 3.`);
            return;
        }

        const updated = members.map(m => String(m.memberId) === String(selected.memberId)
            ? { ...m, guarantors: [...(m.guarantors || []), ...uniqueNew] }
            : m
        );

        setMembers(updated);
        setFiltered(updated);
        // update selected reference to the updated member object so UI shows new guarantors
        const newSelected = updated.find(m => String(m.memberId) === String(selected.memberId));
        setSelected(newSelected || selected);
        setSnack(true);
        setForm([{}, {}, {}]);
        setPreviews([{}, {}, {}]);
        setStep(0);
        setActiveGuarantor(0);
    };
    const renderPreview = (data, i, usePrev = false) => {
        const allFields = Object.values(fieldConfig).flat().map(f => f.name).filter((v, i, a) => a.indexOf(v) === i);
        return (
            <Grid container spacing={1}>
                {allFields.map(k => {
                    const def = Object.values(fieldConfig).flat().find(ff => ff.name === k), label = def?.label || k;
                    let val = data?.[k];
                    if (val === undefined || val === "" || val === null) val = "-";
                    else if (typeof val === "boolean") val = val ? "Yes" : "No";
                    else if (["photo", "chequeCopy", "passbook"].includes(k)) {
                        const src = (usePrev && previews[i]?.[k]) ? previews[i][k] : val;
                        val = src ? <img src={src} alt={k} style={{ maxWidth: 160 }} /> : "-";
                    } else val = String(val);
                    return (<Grid item xs={12} sm={6} key={k}><Typography variant="subtitle2">{label}</Typography><Typography variant="body2">{val}</Typography></Grid>);
                })}
            </Grid>
        );
    };
    const renderStep = (data, i) => fieldConfig[step] ? (
        <RenderFields
            fields={fieldConfig[step]}
            formData={data}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            previews={previews[i]}
            errors={errors[i]}
            index={i}
            members={members}
            selected={selected}
            allForms={formData}
        />
    ) : step === 5 ? (
        <Box>
            <Typography variant="h6" gutterBottom>Preview</Typography>
            {renderPreview(data, i, true)}
            <Box mt={2}><Button variant="contained" onClick={submit}>Confirm & Submit</Button></Box>
        </Box>
    ) : null;

    return (
        <Box p={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth placeholder="Search Id and Member Name..." value={search} onChange={e => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),
                            endAdornment: search && (<InputAdornment position="end"><IconButton onClick={() => setSearch("")}><Clear /></IconButton></InputAdornment>)
                        }} />
                </Grid>
                <Grid item xs={6} md={3}>
                    <TextField select fullWidth label="Status" value={status} onChange={e => setStatus(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={6} md={3}>
                    <Button variant="contained" onClick={openAddGuarantorDialog}>Add Guarantor</Button>
                </Grid>
            </Grid>

            <Box mt={2}>
                {filtered.map(m => (
                    <Card key={m.memberId} sx={{ mb: 2, cursor: "pointer", bgcolor: selected?.memberId === m.memberId ? "#e3f2fd" : "white" }} onClick={() => setSelected(m)}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2} justifyContent="space-between">
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar><Person /></Avatar>
                                    <Box>
                                        <Typography fontWeight={600}>{m.name}</Typography>
                                        <Typography variant="body2">Membership No: {m.memberId}</Typography>
                                        <Typography variant="body2" color="text.secondary">{m.email || ""}{m.mobile ? ` | ${m.mobile}` : ""}</Typography>
                                    </Box>
                                </Box>
                                <Box><Typography variant="caption">{m.status || ""}</Typography></Box>
                            </Box>

                            {m.guarantors?.length > 0 && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1">Guarantors ({m.guarantors.length})</Typography>
                                    <Grid container spacing={1} mt={0.5}>
                                        {m.guarantors.map((g, gi) => (
                                            <Grid item xs={12} sm={6} md={4} key={gi}>
                                                <Card variant="outlined" sx={{ p: 1 }}>
                                                    <Box display="flex" gap={1} alignItems="center">
                                                        <Avatar src={g.photo} sx={{ width: 48, height: 48 }}>{!g.photo && g.name ? g.name[0] : null}</Avatar>
                                                        <Box flex={1}>
                                                            <Typography sx={{ fontWeight: 600 }}>{g.name || "N/A"}</Typography>
                                                            <Typography variant="body2">{g.mobile || "-"}</Typography>
                                                            <Typography variant="body2" color="text.secondary">Age: {g.age || "-"}</Typography>
                                                        </Box>
                                                        <Box>
                                                            <IconButton size="small" onClick={() => { setViewData(g); setViewOpen(true); }} title="View guarantor"><Visibility /></IconButton>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    Add Guarantor {selected ? `for ${selected.name}` : ""}
                    <IconButton onClick={() => setOpen(false)} sx={{ ml: 1 }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Tabs value={activeGuarantor} onChange={(e, v) => { setActiveGuarantor(v); setStep(0); }} sx={{ mb: 2 }}>
                        <Tab label="Guarantor 1" /><Tab label="Guarantor 2" /><Tab label="Guarantor 3" />
                    </Tabs>
                    <Stepper activeStep={step} alternativeLabel>
                        {steps.map(s => <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
                    </Stepper>
                    <Box mt={2}>{renderStep(formData[activeGuarantor], activeGuarantor)}</Box>
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>Back</Button>
                        <Box>
                            {step === steps.length - 1 && activeGuarantor < 2 && (
                                <Button variant="outlined" sx={{ mr: 1 }} onClick={() => { setActiveGuarantor(p => p + 1); setStep(0); }}>Next Guarantor</Button>
                            )}
                            <Button variant="contained" onClick={() => { if (step < steps.length - 1) setStep(s => s + 1); else submit(); }}>
                                {step < steps.length - 1 ? "Next" : "Submit"}
                            </Button>
                        </Box>
                    </Box>
                    <Box mt={1} mb={2}>
                        <Typography variant="caption" color="text.secondary">
                            Note: A member can have minimum 1 and maximum 3 guarantors. After saving, you can add more (until total reaches 3).
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={viewOpen} onClose={() => setViewOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    Guarantor Details
                    <IconButton onClick={() => setViewOpen(false)} sx={{ ml: 1 }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent>{viewData && renderPreview(viewData, 0, false)}</DialogContent>
            </Dialog>
            <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert severity="success" onClose={() => setSnack(false)}>Guarantor saved successfully!</Alert>
            </Snackbar>
        </Box>
    );
}