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
            data: { ClassId, SubjectId, TeacherId, DayOfWeek, StartTime, EndTime, RoomNo },
        });
        res.status(201).json({ data: schedule, message: "Class schedule created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create class schedule" });
    }
});

router.delete("/classSchedule/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const schedule = await prisma.classSchedule.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: schedule, message: "Class schedule deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete class schedule" });
    }
});

router.put("/classSchedule/update", async (req, res) => {
    try {
        const { id, ClassId, SubjectId, TeacherId, DayOfWeek, StartTime, EndTime, RoomNo } = req.body;
        const schedule = await prisma.classSchedule.update({
            where: { Id: id },
            data: { ClassId, SubjectId, TeacherId, DayOfWeek, StartTime, EndTime, RoomNo },
        });
        res.status(200).json({ data: schedule, message: "Class schedule updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update class schedule" });
    }
});

router.get("/classSchedule/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await prisma.classSchedule.findUnique({
            where: { Id: id },
            include: { Class: true, Subject: true, Teacher: true },
        });
        res.status(200).json({ data: schedule, message: "Class schedule fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch class schedule" });
    }
});

export default router;
