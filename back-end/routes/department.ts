import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/department/get", async (req, res) => {
    try {
        const departments = await prisma.department.findMany({
            include: { HeadTeacher: true },
        });
        res.status(200).json({ data: departments, message: "Departments fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});

router.post("/department/add", async (req, res) => {
    try {
        const { Name, Code, Description, HeadId } = req.body;
        const department = await prisma.department.create({
            data: { Name, Code, Description, HeadId },
        });
        res.status(201).json({ data: department, message: "Department created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create department" });
    }
});

router.delete("/department/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const department = await prisma.department.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: department, message: "Department deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete department" });
    }
});

router.put("/department/update", async (req, res) => {
    try {
        const { id, Name, Code, Description, HeadId } = req.body;
        const department = await prisma.department.update({
            where: { Id: id },
            data: { Name, Code, Description, HeadId },
        });
        res.status(200).json({ data: department, message: "Department updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update department" });
    }
});

router.get("/department/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const department = await prisma.department.findUnique({
            where: { Id: id },
            include: { HeadTeacher: true, Teachers: true, Subjects: true },
        });
        res.status(200).json({ data: department, message: "Department fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch department" });
    }
});

export default router;
