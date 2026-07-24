import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/class/get", async (req, res) => {
    try {
        const classes = await prisma.class.findMany({
            include: { ClassTeacher: true },
        });
        res.status(200).json({ data: classes, message: "Classes fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch classes" });
    }
});

router.post("/class/add", async (req, res) => {
    try {
        const { Name, Section, RoomNumber, Capacity, ClassTeacherId } = req.body;
        const newClass = await prisma.class.create({
            data: { Name, Section, RoomNumber, Capacity, ClassTeacherId },
        });
        res.status(201).json({ data: newClass, message: "Class created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create class" });
    }
});

router.delete("/class/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const deletedClass = await prisma.class.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: deletedClass, message: "Class deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete class" });
    }
});

router.put("/class/update", async (req, res) => {
    try {
        const { id, Name, Section, RoomNumber, Capacity, ClassTeacherId } = req.body;
        const updatedClass = await prisma.class.update({
            where: { Id: id },
            data: { Name, Section, RoomNumber, Capacity, ClassTeacherId },
        });
        res.status(200).json({ data: updatedClass, message: "Class updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update class" });
    }
});

router.get("/class/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const singleClass = await prisma.class.findUnique({
            where: { Id: id },
            include: {
                ClassTeacher: true,
                Students: true,
                Subjects: true,
                Schedules: true,
            },
        });
        res.status(200).json({ data: singleClass, message: "Class fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch class" });
    }
});

export default router;
