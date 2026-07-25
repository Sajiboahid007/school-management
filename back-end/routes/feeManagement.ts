import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/feeManagement/get", async (req, res) => {
    try {
        const fees = await prisma.feeManagement.findMany({
            include: { Student: true },
        });
        res.status(200).json({ data: fees, message: "Fees fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch fees" });
    }
});

router.post("/feeManagement/add", async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const created = [];
            for (const item of req.body) {
                const { InvoiceNo, StudentId, FeeType, Amount, PaidAmount, DueDate, PaymentDate, PaymentMethod, Status } = item;
                const record = await prisma.feeManagement.create({
                    data: {
                        InvoiceNo,
                        StudentId: Number(StudentId),
                        FeeType,
                        Amount: Number(Amount),
                        PaidAmount: PaidAmount ? Number(PaidAmount) : 0,
                        DueDate: DueDate ? new Date(DueDate) : new Date(),
                        PaymentDate: PaymentDate ? new Date(PaymentDate) : null,
                        PaymentMethod,
                        Status,
                    }
                });
                created.push(record);
            }
            return res.status(201).json({ data: created, message: "Bulk fees recorded successfully" });
        } else {
            const { InvoiceNo, StudentId, FeeType, Amount, PaidAmount, DueDate, PaymentDate, PaymentMethod, Status } = req.body;
            const fee = await prisma.feeManagement.create({
                data: {
                    InvoiceNo,
                    StudentId: Number(StudentId),
                    FeeType,
                    Amount: Number(Amount),
                    PaidAmount: PaidAmount ? Number(PaidAmount) : 0,
                    DueDate: DueDate ? new Date(DueDate) : new Date(),
                    PaymentDate: PaymentDate ? new Date(PaymentDate) : null,
                    PaymentMethod,
                    Status,
                },
            });
            return res.status(201).json({ data: fee, message: "Fee created successfully" });
        }
    } catch (error: any) {
        console.error("Failed to add fee:", error);
        res.status(400).json({ error: error?.message || "Failed to create fee" });
    }
});

router.delete(["/feeManagement/delete", "/feeManagement/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const feeId = Number(id);
        if (!id || isNaN(feeId)) {
            return res.status(400).json({ error: "Invalid or missing fee ID" });
        }
        const fee = await prisma.feeManagement.delete({
            where: { Id: feeId },
        });
        res.status(200).json({ data: fee, message: "Fee deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting fee:", error);
        res.status(400).json({ error: error?.message || "Failed to delete fee" });
    }
});

router.put(["/feeManagement/update", "/feeManagement/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const feeId = Number(id);
        if (!id || isNaN(feeId)) {
            return res.status(400).json({ error: "Invalid or missing fee ID" });
        }
        const { InvoiceNo, StudentId, FeeType, Amount, PaidAmount, DueDate, PaymentDate, PaymentMethod, Status } = req.body;
        const fee = await prisma.feeManagement.update({
            where: { Id: feeId },
            data: {
                InvoiceNo,
                StudentId: StudentId ? Number(StudentId) : undefined,
                FeeType,
                Amount: Amount !== undefined ? Number(Amount) : undefined,
                PaidAmount: PaidAmount !== undefined ? Number(PaidAmount) : undefined,
                DueDate: DueDate ? new Date(DueDate) : undefined,
                PaymentDate: PaymentDate ? new Date(PaymentDate) : undefined,
                PaymentMethod,
                Status,
            },
        });
        res.status(200).json({ data: fee, message: "Fee updated successfully" });
    } catch (error: any) {
        console.error("Error updating fee:", error);
        res.status(400).json({ error: error?.message || "Failed to update fee" });
    }
});

router.get("/feeManagement/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fee = await prisma.feeManagement.findUnique({
            where: { Id: Number(id) },
            include: { Student: true },
        });
        res.status(200).json({ data: fee, message: "Fee fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch fee" });
    }
});

export default router;
