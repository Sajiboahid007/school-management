import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/feeManagement/get", async (req, res) => {
    try {
        const fees = await prisma.feeManagement.findMany({
            include: { Student: true },
        });
        res.status(200).json({ data: fees, message: "Fee records fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch fee records" });
    }
});

router.post("/feeManagement/add", async (req, res) => {
    try {
        const { InvoiceNo, StudentId, FeeType, Amount, PaidAmount, DueDate, PaymentDate, PaymentMethod, Status } = req.body;
        const fee = await prisma.feeManagement.create({
            data: {
                InvoiceNo,
                StudentId,
                FeeType,
                Amount: parseFloat(Amount),
                PaidAmount: PaidAmount ? parseFloat(PaidAmount) : 0,
                DueDate: new Date(DueDate),
                PaymentDate: PaymentDate ? new Date(PaymentDate) : null,
                PaymentMethod,
                Status,
            },
        });
        res.status(201).json({ data: fee, message: "Fee record created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create fee record" });
    }
});

router.delete("/feeManagement/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const fee = await prisma.feeManagement.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: fee, message: "Fee record deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete fee record" });
    }
});

router.put("/feeManagement/update", async (req, res) => {
    try {
        const { id, InvoiceNo, StudentId, FeeType, Amount, PaidAmount, DueDate, PaymentDate, PaymentMethod, Status } = req.body;
        const fee = await prisma.feeManagement.update({
            where: { Id: id },
            data: {
                InvoiceNo,
                StudentId,
                FeeType,
                Amount: Amount !== undefined ? parseFloat(Amount) : undefined,
                PaidAmount: PaidAmount !== undefined ? parseFloat(PaidAmount) : undefined,
                DueDate: DueDate ? new Date(DueDate) : undefined,
                PaymentDate: PaymentDate ? new Date(PaymentDate) : undefined,
                PaymentMethod,
                Status,
            },
        });
        res.status(200).json({ data: fee, message: "Fee record updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update fee record" });
    }
});

router.get("/feeManagement/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fee = await prisma.feeManagement.findUnique({
            where: { Id: id },
            include: { Student: true },
        });
        res.status(200).json({ data: fee, message: "Fee record fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch fee record" });
    }
});

export default router;
