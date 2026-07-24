import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/examsResult/get", async (req, res) => {
    try {
        const results = await prisma.examsResult.findMany({
            include: { Exam: true, Student: true, Subject: true, RecordedByTeacher: true },
        });
        res.status(200).json({ data: results, message: "Exam results fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch exam results" });
    }
});

router.post("/examsResult/add", async (req, res) => {
    try {
        const { ExamId, StudentId, SubjectId, RecordedByTeacherId, MarksObtained, TotalMarks, Grade, Remarks } = req.body;
        const result = await prisma.examsResult.create({
            data: {
                ExamId,
                StudentId,
                SubjectId,
                RecordedByTeacherId,
                MarksObtained: parseFloat(MarksObtained),
                TotalMarks: TotalMarks ? parseFloat(TotalMarks) : 100,
                Grade,
                Remarks,
            },
        });
        res.status(201).json({ data: result, message: "Exam result created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create exam result" });
    }
});

router.delete("/examsResult/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const result = await prisma.examsResult.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: result, message: "Exam result deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete exam result" });
    }
});

router.put("/examsResult/update", async (req, res) => {
    try {
        const { id, ExamId, StudentId, SubjectId, RecordedByTeacherId, MarksObtained, TotalMarks, Grade, Remarks } = req.body;
        const result = await prisma.examsResult.update({
            where: { Id: id },
            data: {
                ExamId,
                StudentId,
                SubjectId,
                RecordedByTeacherId,
                MarksObtained: MarksObtained !== undefined ? parseFloat(MarksObtained) : undefined,
                TotalMarks: TotalMarks !== undefined ? parseFloat(TotalMarks) : undefined,
                Grade,
                Remarks,
            },
        });
        res.status(200).json({ data: result, message: "Exam result updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update exam result" });
    }
});

router.get("/examsResult/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await prisma.examsResult.findUnique({
            where: { Id: id },
            include: { Exam: true, Student: true, Subject: true, RecordedByTeacher: true },
        });
        res.status(200).json({ data: result, message: "Exam result fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch exam result" });
    }
});

export default router;
