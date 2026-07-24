import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/attendance/get", async (req, res) => {
    try {
        const attendances = await prisma.attendance.findMany({
            include: { Student: true, Class: true, Subject: true, RecordedByTeacher: true },
        });
        res.status(200).json({ data: attendances, message: "Attendance records fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch attendance records" });
    }
});

router.post("/attendance/add", async (req, res) => {
    try {
        const { Date: dateVal, Status, StudentId, ClassId, SubjectId, RecordedByTeacherId } = req.body;
        const attendance = await prisma.attendance.create({
            data: {
                Date: new Date(dateVal),
                Status,
                StudentId,
                ClassId,
                SubjectId,
                RecordedByTeacherId,
            },
        });
        res.status(201).json({ data: attendance, message: "Attendance record created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create attendance record" });
    }
});

router.delete("/attendance/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const attendance = await prisma.attendance.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: attendance, message: "Attendance record deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete attendance record" });
    }
});

router.put("/attendance/update", async (req, res) => {
    try {
        const { id, Date: dateVal, Status, StudentId, ClassId, SubjectId, RecordedByTeacherId } = req.body;
        const attendance = await prisma.attendance.update({
            where: { Id: id },
            data: {
                Date: dateVal ? new Date(dateVal) : undefined,
                Status,
                StudentId,
                ClassId,
                SubjectId,
                RecordedByTeacherId,
            },
        });
        res.status(200).json({ data: attendance, message: "Attendance record updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update attendance record" });
    }
});

router.get("/attendance/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await prisma.attendance.findUnique({
            where: { Id: id },
            include: { Student: true, Class: true, Subject: true, RecordedByTeacher: true },
        });
        res.status(200).json({ data: attendance, message: "Attendance record fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch attendance record" });
    }
});

export default router;
