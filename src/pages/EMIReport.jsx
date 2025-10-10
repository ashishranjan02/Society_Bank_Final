import React, { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
    Grid,
    Dialog,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";

export default function EMIReport() {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);

    // ===== Load members & loans =====
    const loadLoans = () => {
        const stored = localStorage.getItem("members");
        if (!stored) return;

        const data = JSON.parse(stored);
        setMembers(data);

        const allLoans = data.flatMap((m) =>
            (m.loans || []).map((loan) => {
                const repayments = loan.repayments || [];

                //  Due date: first EMI due date
                const dueDate = repayments.length > 0 ? repayments[0].date : "-";

                //Last Paid Date: last paidOn entry
                const paidRepayments = repayments.filter((r) => r.paid);
                const paidDate =
                    paidRepayments.length > 0
                        ? paidRepayments[paidRepayments.length - 1].paidOn
                        : "-";

                //  Total Paid
                const totalPaid = paidRepayments.reduce(
                    (sum, r) => sum + (r.amount || 0),
                    0
                );

                //  Format: remove extra decimals cleanly
                const formatNumber = (num) => {
                    if (isNaN(num)) return "0";
                    const rounded = Number(num).toFixed(2);
                    return rounded.endsWith(".00") ? rounded.slice(0, -3) : rounded;
                };

                const recovery = Math.max((loan.totalPayable || 0) - (totalPaid || 0), 0);
                // Penalty for late payments
                const penalty = repayments.reduce((sum, r) => {
                    if (r.paid && r.paidOn && new Date(r.paidOn) > new Date(r.date)) {
                        const diffDays =
                            (new Date(r.paidOn) - new Date(r.date)) / (1000 * 60 * 60 * 24);
                        return sum + Math.round(diffDays) * 50;
                    }
                    return sum;
                }, 0);

                //  Status (Pending / Completed only)
                const status =
                    totalPaid >= loan.totalPayable && loan.totalPayable > 0
                        ? "Completed"
                        : "Pending";

                return {
                    memberId: m.memberId,
                    memberName: m.name,
                    loanId: loan.loanId,
                    principal: formatNumber(loan.principal),
                    interest: loan.interest,
                    emi: formatNumber(loan.emi),
                    totalPayable: formatNumber(loan.totalPayable),
                    tenureMonths: loan.tenureMonths,
                    dueDate,
                    paidDate,
                    totalPaid: formatNumber(totalPaid),
                    recovery: formatNumber(recovery),
                    penalty: formatNumber(penalty),
                    status,
                };
            })
        );

        setFilteredLoans(allLoans);
    };

    useEffect(() => {
        loadLoans();
        const handleStorageChange = () => loadLoans();
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // ===== Search filter =====
    useEffect(() => {
        if (!search.trim()) {
            loadLoans();
            return;
        }

        const lower = search.toLowerCase();
        const filtered = members.flatMap((m) =>
            (m.loans || [])
                .filter(
                    () =>
                        m.memberId.toLowerCase().includes(lower) ||
                        m.name.toLowerCase().includes(lower)
                )
                .map((loan) => ({
                    ...loan,
                    memberId: m.memberId,
                    memberName: m.name,
                }))
        );
        setFilteredLoans(filtered);
    }, [search]);

    // ===== Generate PDF =====
    const handleDownload = () => {
        const doc = new jsPDF("portrait", "pt", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.setFont("helvetica", "normal");

        // Header
        doc.setFillColor(25, 118, 210);
        doc.rect(0, 0, pageWidth, 45, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text("Loan EMI Report", 40, 28);
        doc.setFontSize(11);
        doc.text(
            `Generated on: ${new Date().toLocaleDateString()}`,
            pageWidth - 40,
            28,
            { align: "right" }
        );

        let y = 80;
        const formatCurrency = (val) => "Rs. " + val;

        filteredLoans.forEach((loan) => {
            if (y > pageHeight - 220) {
                doc.addPage();
                y = 80;
            }

            const cardHeight = 200;
            doc.setDrawColor(180);
            doc.roundedRect(30, y - 20, pageWidth - 60, cardHeight, 8, 8);

            doc.setFontSize(13);
            doc.setTextColor(25, 118, 210);
            doc.text(`${loan.memberName} (${loan.memberId})`, 50, y + 5);

            const loanIdY = y + 25;
            doc.setFillColor(227, 242, 253);
            doc.roundedRect(50, loanIdY - 12, pageWidth - 100, 22, 4, 4, "F");
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(11);
            doc.text(`Loan ID: ${loan.loanId}`, 60, loanIdY + 4);

            const leftCol = [
                ["Loan Amount", formatCurrency(loan.principal)],
                ["Tenure", `${loan.tenureMonths || 0} months`],
                ["Interest", `${loan.interest}%`],
                ["EMI", formatCurrency(loan.emi)],
            ];

            const rightCol = [
                ["Total Payable", formatCurrency(loan.totalPayable)],
                ["Total Paid", formatCurrency(loan.totalPaid)],
                ["Recovery", formatCurrency(loan.recovery)],
                ["Penalty", formatCurrency(loan.penalty)],
                ["Due Date", loan.dueDate || "-"],
                ["Paid Date", loan.paidDate || "-"],
                ["Status", loan.status],
            ];

            let rowY = loanIdY + 35;
            const leftX = 60;
            const rightX = 330;

            leftCol.forEach(([label, value]) => {
                doc.setFont("helvetica", "bold");
                doc.text(`${label}:`, leftX, rowY);
                doc.setFont("helvetica", "normal");
                doc.text(value, leftX + 120, rowY);
                rowY += 18;
            });

            let rightRowY = loanIdY + 35;
            rightCol.forEach(([label, value]) => {
                doc.setFont("helvetica", "bold");
                doc.text(`${label}:`, rightX, rightRowY);
                doc.setFont("helvetica", "normal");
                doc.text(String(value), rightX + 120, rightRowY);
                rightRowY += 18;
            });

            y += cardHeight + 25;
        });

        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - 60, pageHeight - 20);
        }

        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setOpenPreview(true);
    };

    const confirmDownload = () => {
        const link = document.createElement("a");
        link.href = previewUrl;
        link.download = "Loan_EMI_Report.pdf";
        link.click();
        setOpenPreview(false);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: 6,
                    background: "linear-gradient(145deg,#e3f2fd,#ffffff)",
                }}
            >
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: "bold", color: "#0d47a1", mb: 3 }}
                >
                    EMI & Repayment Report
                </Typography>

                <Grid container spacing={2} alignItems="center" mb={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Search by Member ID / Name"
                            variant="outlined"
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md="auto">
                        <Button
                            variant="contained"
                            onClick={handleDownload}
                            startIcon={<DownloadIcon />}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                background: "linear-gradient(90deg,#1976d2,#42a5f5)",
                                fontWeight: "bold",
                            }}
                        >
                            Generate Report
                        </Button>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        overflowX: "auto",
                        borderRadius: 2,
                        boxShadow: 2,
                        "&::-webkit-scrollbar": { height: "8px" },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#90caf9",
                            borderRadius: "10px",
                        },
                    }}
                >
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableRow>
                                {[
                                    "Loan ID",
                                    "Member ID",
                                    "Member Name",
                                    "Principal (Rs.)",
                                    "Interest (%)",
                                    "Tenure (Months)",
                                    "EMI (Rs.)",
                                    "Total Payable (Rs.)",
                                    "Total Paid (Rs.)",
                                    "Recovery (Rs.)",
                                    "Penalty (Rs.)",
                                    "Due Date",
                                    "Paid Date",
                                    "Status",
                                ].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: "bold" }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredLoans.length > 0 ? (
                                filteredLoans.map((r, i) => (
                                    <TableRow key={i} hover>
                                        <TableCell>{r.loanId}</TableCell>
                                        <TableCell>{r.memberId}</TableCell>
                                        <TableCell>{r.memberName}</TableCell>
                                        <TableCell>Rs. {r.principal}</TableCell>
                                        <TableCell>{r.interest}%</TableCell>
                                        <TableCell>{r.tenureMonths}</TableCell>
                                        <TableCell>Rs. {r.emi}</TableCell>
                                        <TableCell>Rs. {r.totalPayable}</TableCell>
                                        <TableCell>Rs. {r.totalPaid}</TableCell>
                                        <TableCell>Rs. {r.recovery}</TableCell>
                                        <TableCell>Rs. {r.penalty}</TableCell>
                                        <TableCell>{r.dueDate}</TableCell>
                                        <TableCell>{r.paidDate}</TableCell>
                                        <TableCell>{r.status}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={14} align="center">
                                        No loan data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Paper>

            {/* ===== PDF PREVIEW ===== */}
            <Dialog
                open={openPreview}
                onClose={() => setOpenPreview(false)}
                fullWidth
                maxWidth="lg"
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    px={2}
                    py={1.5}
                    sx={{
                        background: "linear-gradient(90deg,#1976d2,#2196f3)",
                        color: "#fff",
                    }}
                >
                    <Typography variant="h6">EMI Report Preview</Typography>
                    <IconButton onClick={() => setOpenPreview(false)} sx={{ color: "#fff" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent sx={{ backgroundColor: "#fafafa" }}>
                    {previewUrl && (
                        <iframe
                            src={previewUrl}
                            width="100%"
                            height="600px"
                            title="PDF Preview"
                            style={{
                                border: "none",
                                borderRadius: "8px",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                            }}
                        />
                    )}
                    <Box display="flex" justifyContent="center" mt={3}>
                        <Button
                            variant="contained"
                            onClick={confirmDownload}
                            startIcon={<DownloadIcon />}
                            sx={{ borderRadius: 3, px: 3, fontWeight: "bold" }}
                        >
                            Confirm & Download
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
}