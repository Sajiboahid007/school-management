import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/exam/get", async (req, res) => {
    try {
        const exams = await prisma.exam.findMany();
        res.status(200).json({ data: exams, message: "Exams fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch exams" });
    }
});

router.post("/exam/add", async (req, res) => {
    try {
        const { Title, Term, AcademicYear, StartDate, EndDate } = req.body;
        const exam = await prisma.exam.create({
            data: {
                Title,
                Term,
                AcademicYear,
                StartDate: new Date(StartDate),
                EndDate: new Date(EndDate),
            },
        });
        res.status(201).json({ data: exam, message: "Exam created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create exam" });
    }
});

router.delete(["/exam/delete", "/exam/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const examId = Number(id);
        if (!id || isNaN(examId)) {
            return res.status(400).json({ error: "Invalid or missing exam ID" });
        }
        const exam = await prisma.exam.delete({
            where: { Id: examId },
        });
        res.status(200).json({ data: exam, message: "Exam deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting exam:", error);
        res.status(400).json({ error: error?.message || "Failed to delete exam" });
    }
});

router.put(["/exam/update", "/exam/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const examId = Number(id);
        if (!id || isNaN(examId)) {
            return res.status(400).json({ error: "Invalid or missing exam ID" });
        }
        const { Title, Term, AcademicYear, StartDate, EndDate } = req.body;
        const exam = await prisma.exam.update({
            where: { Id: examId },
            data: {
                Title,
                Term,
                AcademicYear,
                StartDate: StartDate ? new Date(StartDate) : undefined,
                EndDate: EndDate ? new Date(EndDate) : undefined,
            },
        });
        res.status(200).json({ data: exam, message: "Exam updated successfully" });
    } catch (error: any) {
        console.error("Error updating exam:", error);
        res.status(400).json({ error: error?.message || "Failed to update exam" });
    }
});

router.get("/exam/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await prisma.exam.findUnique({
            where: { Id: Number(id) },
            include: { ExamsResults: true },
        });
        res.status(200).json({ data: exam, message: "Exam fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch exam" });
    }
});

export default router;
