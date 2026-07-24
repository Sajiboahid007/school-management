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
            data: { Name, Code, DepartmentId, TeacherId, ClassId },
        });
        res.status(201).json({ data: subject, message: "Subject created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create subject" });
    }
});

router.delete("/subject/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const subject = await prisma.subject.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: subject, message: "Subject deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete subject" });
    }
});

router.put("/subject/update", async (req, res) => {
    try {
        const { id, Name, Code, DepartmentId, TeacherId, ClassId } = req.body;
        const subject = await prisma.subject.update({
            where: { Id: id },
            data: { Name, Code, DepartmentId, TeacherId, ClassId },
        });
        res.status(200).json({ data: subject, message: "Subject updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update subject" });
    }
});

router.get("/subject/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await prisma.subject.findUnique({
            where: { Id: id },
            include: { Department: true, Teacher: true, Class: true },
        });
        res.status(200).json({ data: subject, message: "Subject fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch subject" });
    }
});

export default router;
