import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/class/get", async (req, res) => {
    try {
        const classes = await prisma.class.findMany({
            include: { ClassTeacher: true, Subjects: true },
        });
        res.status(200).json({ data: classes, message: "Classes fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch classes" });
    }
});

router.post("/class/add", async (req, res) => {
    try {
        const { Name, Section, RoomNumber, Capacity, ClassTeacherId, SubjectIds } = req.body;
        const cls = await prisma.class.create({
            data: {
                Name,
                Section,
                RoomNumber,
                Capacity: Capacity ? Number(Capacity) : undefined,
                ClassTeacherId: ClassTeacherId ? Number(ClassTeacherId) : null,
            },
        });
        if (SubjectIds && Array.isArray(SubjectIds)) {
            await prisma.subject.updateMany({
                where: { Id: { in: SubjectIds.map(Number) } },
                data: { ClassId: cls.Id }
            });
        }
        res.status(201).json({ data: cls, message: "Class created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create class" });
    }
});

router.delete(["/class/delete", "/class/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const classId = Number(id);
        if (!id || isNaN(classId)) {
            return res.status(400).json({ error: "Invalid or missing class ID" });
        }
        const cls = await prisma.class.delete({
            where: { Id: classId },
        });
        res.status(200).json({ data: cls, message: "Class deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting class:", error);
        res.status(400).json({ error: error?.message || "Failed to delete class" });
    }
});

router.put(["/class/update", "/class/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const classId = Number(id);
        if (!id || isNaN(classId)) {
            return res.status(400).json({ error: "Invalid or missing class ID" });
        }
        const { Name, Section, RoomNumber, Capacity, ClassTeacherId, SubjectIds } = req.body;
        const cls = await prisma.class.update({
            where: { Id: classId },
            data: {
                Name,
                Section,
                RoomNumber,
                Capacity: Capacity ? Number(Capacity) : undefined,
                ClassTeacherId: ClassTeacherId ? Number(ClassTeacherId) : null,
            },
        });
        if (SubjectIds && Array.isArray(SubjectIds)) {
            // Reset existing subjects' ClassId for this class
            await prisma.subject.updateMany({
                where: { ClassId: classId },
                data: { ClassId: null }
            });
            // Set new subjects' ClassId
            await prisma.subject.updateMany({
                where: { Id: { in: SubjectIds.map(Number) } },
                data: { ClassId: classId }
            });
        }
        res.status(200).json({ data: cls, message: "Class updated successfully" });
    } catch (error: any) {
        console.error("Error updating class:", error);
        res.status(400).json({ error: error?.message || "Failed to update class" });
    }
});

router.get("/class/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const cls = await prisma.class.findUnique({
            where: { Id: Number(id) },
            include: { ClassTeacher: true, Students: true, Subjects: true, Schedules: true },
        });
        res.status(200).json({ data: cls, message: "Class fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch class" });
    }
});

export default router;
