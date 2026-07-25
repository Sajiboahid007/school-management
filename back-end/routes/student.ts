import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/student/get", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            include: { Class: true, Department: true, Role: true },
        });
        res.status(200).json({ data: students, message: "Students fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

router.post("/student/add", async (req, res) => {
    try {
        const { RollNumber, Name, Email, Password, Phone, Address, Gender, DateOfBirth, ClassId, DepartmentId, RoleId } = req.body;
        const hashedPassword = await bcrypt.hash(Password, 10);
        const student = await prisma.student.create({
            data: {
                RollNumber,
                Name,
                Email,
                Password: hashedPassword,
                Phone,
                Address,
                Gender,
                DateOfBirth: DateOfBirth ? new Date(DateOfBirth) : null,
                ClassId: ClassId ? Number(ClassId) : null,
                DepartmentId: DepartmentId ? Number(DepartmentId) : null,
                RoleId: RoleId ? Number(RoleId) : null,
            },
        });
        res.status(201).json({ data: student, message: "Student created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create student" });
    }
});

router.delete(["/student/delete", "/student/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const studentId = Number(id);
        if (!id || isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid or missing student ID" });
        }
        const student = await prisma.student.delete({
            where: { Id: studentId },
        });
        res.status(200).json({ data: student, message: "Student deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting student:", error);
        res.status(400).json({ error: error?.message || "Failed to delete student" });
    }
});

router.put(["/student/update", "/student/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const studentId = Number(id);
        if (!id || isNaN(studentId)) {
            return res.status(400).json({ error: "Invalid or missing student ID" });
        }
        const { RollNumber, Name, Email, Password, Phone, Address, Gender, DateOfBirth, ClassId, DepartmentId, RoleId } = req.body;
        const updateData: any = {
            RollNumber,
            Name,
            Email,
            Phone,
            Address,
            Gender,
            DateOfBirth: DateOfBirth ? new Date(DateOfBirth) : undefined,
            ClassId: ClassId ? Number(ClassId) : undefined,
            DepartmentId: DepartmentId ? Number(DepartmentId) : undefined,
            RoleId: RoleId ? Number(RoleId) : undefined,
        };
        if (Password) {
            updateData.Password = await bcrypt.hash(Password, 10);
        }
        const student = await prisma.student.update({
            where: { Id: studentId },
            data: updateData,
        });
        res.status(200).json({ data: student, message: "Student updated successfully" });
    } catch (error: any) {
        console.error("Error updating student:", error);
        res.status(400).json({ error: error?.message || "Failed to update student" });
    }
});

router.get("/student/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const student = await prisma.student.findUnique({
            where: { Id: Number(id) },
            include: {
                Class: true,
                Department: true,
                Role: true,
                ExamsResults: {
                    include: { Exam: true, Subject: true, RecordedByTeacher: true },
                },
                Fees: true,
                Attendances: true,
                Admissions: true,
            },
        });
        res.status(200).json({ data: student, message: "Student fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch student" });
    }
});

export default router;
