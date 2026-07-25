import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/attendance/get", async (req, res) => {
    try {
        const attendances = await prisma.attendance.findMany({
            include: { Student: true, Class: true, Subject: true, RecordedByTeacher: true },
        });
        res.status(200).json({ data: attendances, message: "Attendance fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch attendance" });
    }
});

router.post("/attendance/add", async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const created = [];
            for (const item of req.body) {
                const { Date: attDate, Status, StudentId, ClassId, SubjectId, RecordedByTeacherId } = item;
                const record = await prisma.attendance.create({
                    data: {
                        Date: new Date(attDate),
                        Status,
                        StudentId: Number(StudentId),
                        ClassId: Number(ClassId),
                        SubjectId: SubjectId ? Number(SubjectId) : null,
                        RecordedByTeacherId: Number(RecordedByTeacherId),
                    }
                });
                created.push(record);
            }
            return res.status(201).json({ data: created, message: "Bulk attendance recorded successfully" });
        } else {
            const { Date: attDate, Status, StudentId, ClassId, SubjectId, RecordedByTeacherId } = req.body;
            const attendance = await prisma.attendance.create({
                data: {
                    Date: new Date(attDate),
                    Status,
                    StudentId: Number(StudentId),
                    ClassId: Number(ClassId),
                    SubjectId: SubjectId ? Number(SubjectId) : null,
                    RecordedByTeacherId: Number(RecordedByTeacherId),
                },
            });
            return res.status(201).json({ data: attendance, message: "Attendance created successfully" });
        }
    } catch (error: any) {
        console.error("Failed to add attendance:", error);
        res.status(400).json({ error: error?.message || "Failed to create attendance" });
    }
});

router.delete(["/attendance/delete", "/attendance/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const attendanceId = Number(id);
        if (!id || isNaN(attendanceId)) {
            return res.status(400).json({ error: "Invalid or missing attendance ID" });
        }
        const attendance = await prisma.attendance.delete({
            where: { Id: attendanceId },
        });
        res.status(200).json({ data: attendance, message: "Attendance deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting attendance:", error);
        res.status(400).json({ error: error?.message || "Failed to delete attendance" });
    }
});

router.put(["/attendance/update", "/attendance/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const attendanceId = Number(id);
        if (!id || isNaN(attendanceId)) {
            return res.status(400).json({ error: "Invalid or missing attendance ID" });
        }
        const { Date: attDate, Status, StudentId, ClassId, SubjectId, RecordedByTeacherId } = req.body;
        const attendance = await prisma.attendance.update({
            where: { Id: attendanceId },
            data: {
                Date: attDate ? new Date(attDate) : undefined,
                Status,
                StudentId: StudentId ? Number(StudentId) : undefined,
                ClassId: ClassId ? Number(ClassId) : undefined,
                SubjectId: SubjectId ? Number(SubjectId) : undefined,
                RecordedByTeacherId: RecordedByTeacherId ? Number(RecordedByTeacherId) : undefined,
            },
        });
        res.status(200).json({ data: attendance, message: "Attendance updated successfully" });
    } catch (error: any) {
        console.error("Error updating attendance:", error);
        res.status(400).json({ error: error?.message || "Failed to update attendance" });
    }
});

router.get("/attendance/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await prisma.attendance.findUnique({
            where: { Id: Number(id) },
            include: { Student: true, Class: true, Subject: true, RecordedByTeacher: true },
        });
        res.status(200).json({ data: attendance, message: "Attendance fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch attendance" });
    }
});

export default router;
