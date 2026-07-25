import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/classSchedule/get", async (req, res) => {
    try {
        const schedules = await prisma.classSchedule.findMany({
            include: { Class: true, Subject: true, Teacher: true },
        });
        res.status(200).json({ data: schedules, message: "Class schedules fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch class schedules" });
    }
});

router.post("/classSchedule/add", async (req, res) => {
    try {
        const { ClassId, SubjectId, TeacherId, DayOfWeek, StartTime, EndTime, RoomNo } = req.body;
        const schedule = await prisma.classSchedule.create({
            data: {
                ClassId: Number(ClassId),
                SubjectId: Number(SubjectId),
                TeacherId: Number(TeacherId),
                DayOfWeek,
                StartTime,
                EndTime,
                RoomNo,
            },
        });
        res.status(201).json({ data: schedule, message: "Class schedule created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create class schedule" });
    }
});

router.delete(["/classSchedule/delete", "/classSchedule/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const scheduleId = Number(id);
        if (!id || isNaN(scheduleId)) {
            return res.status(400).json({ error: "Invalid or missing schedule ID" });
        }
        const schedule = await prisma.classSchedule.delete({
            where: { Id: scheduleId },
        });
        res.status(200).json({ data: schedule, message: "Schedule deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting schedule:", error);
        res.status(400).json({ error: error?.message || "Failed to delete schedule" });
    }
});

router.put(["/classSchedule/update", "/classSchedule/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const scheduleId = Number(id);
        if (!id || isNaN(scheduleId)) {
            return res.status(400).json({ error: "Invalid or missing schedule ID" });
        }
        const { ClassId, SubjectId, TeacherId, DayOfWeek, StartTime, EndTime, RoomNo } = req.body;
        const schedule = await prisma.classSchedule.update({
            where: { Id: scheduleId },
            data: {
                ClassId: ClassId ? Number(ClassId) : undefined,
                SubjectId: SubjectId ? Number(SubjectId) : undefined,
                TeacherId: TeacherId ? Number(TeacherId) : undefined,
                DayOfWeek,
                StartTime,
                EndTime,
                RoomNo,
            },
        });
        res.status(200).json({ data: schedule, message: "Schedule updated successfully" });
    } catch (error: any) {
        console.error("Error updating schedule:", error);
        res.status(400).json({ error: error?.message || "Failed to update schedule" });
    }
});

router.get("/classSchedule/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await prisma.classSchedule.findUnique({
            where: { Id: Number(id) },
            include: { Class: true, Subject: true, Teacher: true },
        });
        res.status(200).json({ data: schedule, message: "Schedule fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch schedule" });
    }
});

export default router;
