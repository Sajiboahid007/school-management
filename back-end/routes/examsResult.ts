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
                ExamId: Number(ExamId),
                StudentId: Number(StudentId),
                SubjectId: Number(SubjectId),
                RecordedByTeacherId: RecordedByTeacherId ? Number(RecordedByTeacherId) : null,
                MarksObtained: Number(MarksObtained),
                TotalMarks: TotalMarks ? Number(TotalMarks) : 100,
                Grade,
                Remarks,
            },
        });
        res.status(201).json({ data: result, message: "Exam result created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create exam result" });
    }
});

router.delete(["/examsResult/delete", "/examsResult/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const resultId = Number(id);
        if (!id || isNaN(resultId)) {
            return res.status(400).json({ error: "Invalid or missing exam result ID" });
        }
        const result = await prisma.examsResult.delete({
            where: { Id: resultId },
        });
        res.status(200).json({ data: result, message: "Exam result deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting exam result:", error);
        res.status(400).json({ error: error?.message || "Failed to delete exam result" });
    }
});

router.put(["/examsResult/update", "/examsResult/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const resultId = Number(id);
        if (!id || isNaN(resultId)) {
            return res.status(400).json({ error: "Invalid or missing exam result ID" });
        }
        const { ExamId, StudentId, SubjectId, RecordedByTeacherId, MarksObtained, TotalMarks, Grade, Remarks } = req.body;
        const result = await prisma.examsResult.update({
            where: { Id: resultId },
            data: {
                ExamId: ExamId ? Number(ExamId) : undefined,
                StudentId: StudentId ? Number(StudentId) : undefined,
                SubjectId: SubjectId ? Number(SubjectId) : undefined,
                RecordedByTeacherId: RecordedByTeacherId ? Number(RecordedByTeacherId) : undefined,
                MarksObtained: MarksObtained !== undefined ? Number(MarksObtained) : undefined,
                TotalMarks: TotalMarks !== undefined ? Number(TotalMarks) : undefined,
                Grade,
                Remarks,
            },
        });
        res.status(200).json({ data: result, message: "Exam result updated successfully" });
    } catch (error: any) {
        console.error("Error updating exam result:", error);
        res.status(400).json({ error: error?.message || "Failed to update exam result" });
    }
});

router.get("/examsResult/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await prisma.examsResult.findUnique({
            where: { Id: Number(id) },
            include: { Exam: true, Student: true, Subject: true, RecordedByTeacher: true },
        });
        res.status(200).json({ data: result, message: "Exam result fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch exam result" });
    }
});

export default router;
