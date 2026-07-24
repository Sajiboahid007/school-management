import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/admission/get", async (req, res) => {
    try {
        const admissions = await prisma.admission.findMany({
            include: { Student: true, Class: true },
        });
        res.status(200).json({ data: admissions, message: "Admissions fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch admissions" });
    }
});

router.post("/admission/add", async (req, res) => {
    try {
        const { ApplicationNo, StudentId, ClassId, AcademicYear, AdmissionDate, Status } = req.body;
        const data: any = { ApplicationNo, StudentId, ClassId, AcademicYear };
        if (AdmissionDate) data.AdmissionDate = new Date(AdmissionDate);
        if (Status) data.Status = Status;

        const admission = await prisma.admission.create({ data });
        res.status(201).json({ data: admission, message: "Admission created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create admission" });
    }
});

router.delete("/admission/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const admission = await prisma.admission.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: admission, message: "Admission deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete admission" });
    }
});

router.put("/admission/update", async (req, res) => {
    try {
        const { id, ApplicationNo, StudentId, ClassId, AcademicYear, AdmissionDate, Status } = req.body;
        const data: any = {};
        if (ApplicationNo) data.ApplicationNo = ApplicationNo;
        if (StudentId) data.StudentId = StudentId;
        if (ClassId) data.ClassId = ClassId;
        if (AcademicYear) data.AcademicYear = AcademicYear;
        if (AdmissionDate) data.AdmissionDate = new Date(AdmissionDate);
        if (Status) data.Status = Status;

        const admission = await prisma.admission.update({
            where: { Id: id },
            data,
        });
        res.status(200).json({ data: admission, message: "Admission updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update admission" });
    }
});

router.get("/admission/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const admission = await prisma.admission.findUnique({
            where: { Id: id },
            include: { Student: true, Class: true },
        });
        res.status(200).json({ data: admission, message: "Admission fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch admission" });
    }
});

export default router;
