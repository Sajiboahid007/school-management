import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/subject/get", async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany({
            include: { Department: true, Teacher: true, Class: true },
        });
        res.status(200).json({ data: subjects, message: "Subjects fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch subjects" });
    }
});

router.post("/subject/add", async (req, res) => {
    try {
        const { Name, Code, DepartmentId, TeacherId, ClassId } = req.body;
        const subject = await prisma.subject.create({
            data: {
                Name,
                Code,
                DepartmentId: DepartmentId ? Number(DepartmentId) : null,
                TeacherId: TeacherId ? Number(TeacherId) : null,
                ClassId: ClassId ? Number(ClassId) : null,
            },
        });
        res.status(201).json({ data: subject, message: "Subject created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create subject" });
    }
});

router.delete(["/subject/delete", "/subject/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const subjectId = Number(id);
        if (!id || isNaN(subjectId)) {
            return res.status(400).json({ error: "Invalid or missing subject ID" });
        }
        const subject = await prisma.subject.delete({
            where: { Id: subjectId },
        });
        res.status(200).json({ data: subject, message: "Subject deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting subject:", error);
        res.status(400).json({ error: error?.message || "Failed to delete subject" });
    }
});

router.put(["/subject/update", "/subject/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const subjectId = Number(id);
        if (!id || isNaN(subjectId)) {
            return res.status(400).json({ error: "Invalid or missing subject ID" });
        }
        const { Name, Code, DepartmentId, TeacherId, ClassId } = req.body;
        const subject = await prisma.subject.update({
            where: { Id: subjectId },
            data: {
                Name,
                Code,
                DepartmentId: DepartmentId ? Number(DepartmentId) : null,
                TeacherId: TeacherId ? Number(TeacherId) : null,
                ClassId: ClassId ? Number(ClassId) : null,
            },
        });
        res.status(200).json({ data: subject, message: "Subject updated successfully" });
    } catch (error: any) {
        console.error("Error updating subject:", error);
        res.status(400).json({ error: error?.message || "Failed to update subject" });
    }
});

router.get("/subject/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await prisma.subject.findUnique({
            where: { Id: Number(id) },
            include: { Department: true, Teacher: true, Class: true },
        });
        res.status(200).json({ data: subject, message: "Subject fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch subject" });
    }
});

export default router;
