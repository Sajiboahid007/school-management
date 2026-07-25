import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/teacher/get", async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            include: { Department: true, Role: true },
        });
        res.status(200).json({ data: teachers, message: "Teachers fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch teachers" });
    }
});

router.post("/teacher/add", async (req, res) => {
    try {
        const { Name, Email, Password, Phone, Address, Gender, Qualification, JoiningDate, DepartmentId, RoleId } = req.body;
        const hashedPassword = await bcrypt.hash(Password, 10);
        const teacher = await prisma.teacher.create({
            data: {
                Name,
                Email,
                Password: hashedPassword,
                Phone,
                Address,
                Gender,
                Qualification,
                JoiningDate: JoiningDate ? new Date(JoiningDate) : null,
                DepartmentId: DepartmentId ? Number(DepartmentId) : null,
                RoleId: RoleId ? Number(RoleId) : null,
            },
        });
        res.status(201).json({ data: teacher, message: "Teacher created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create teacher" });
    }
});

router.delete(["/teacher/delete", "/teacher/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const teacherId = Number(id);
        if (!id || isNaN(teacherId)) {
            return res.status(400).json({ error: "Invalid or missing teacher ID" });
        }
        const teacher = await prisma.teacher.delete({
            where: { Id: teacherId },
        });
        res.status(200).json({ data: teacher, message: "Teacher deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting teacher:", error);
        res.status(400).json({ error: error?.message || "Failed to delete teacher" });
    }
});

router.put(["/teacher/update", "/teacher/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const teacherId = Number(id);
        if (!id || isNaN(teacherId)) {
            return res.status(400).json({ error: "Invalid or missing teacher ID" });
        }
        const { Name, Email, Password, Phone, Address, Gender, Qualification, JoiningDate, DepartmentId, RoleId } = req.body;
        const updateData: any = {
            Name,
            Email,
            Phone,
            Address,
            Gender,
            Qualification,
            JoiningDate: JoiningDate ? new Date(JoiningDate) : undefined,
            DepartmentId: DepartmentId ? Number(DepartmentId) : undefined,
            RoleId: RoleId ? Number(RoleId) : undefined,
        };
        if (Password) {
            updateData.Password = await bcrypt.hash(Password, 10);
        }
        const teacher = await prisma.teacher.update({
            where: { Id: teacherId },
            data: updateData,
        });
        res.status(200).json({ data: teacher, message: "Teacher updated successfully" });
    } catch (error: any) {
        console.error("Error updating teacher:", error);
        res.status(400).json({ error: error?.message || "Failed to update teacher" });
    }
});

router.get("/teacher/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await prisma.teacher.findUnique({
            where: { Id: Number(id) },
            include: {
                Department: true,
                Role: true,
                ClassesTaught: true,
                SubjectsTaught: true,
                Schedules: true,
            },
        });
        res.status(200).json({ data: teacher, message: "Teacher fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch teacher" });
    }
});

export default router;
