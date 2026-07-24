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
                ClassId,
                DepartmentId,
                RoleId,
            },
        });
        res.status(201).json({ data: student, message: "Student created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create student" });
    }
});

router.delete("/student/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const student = await prisma.student.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: student, message: "Student deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete student" });
    }
});

router.put("/student/update", async (req, res) => {
    try {
        const { id, RollNumber, Name, Email, Password, Phone, Address, Gender, DateOfBirth, ClassId, DepartmentId, RoleId } = req.body;
        const updateData: any = {
            RollNumber,
            Name,
            Email,
            Phone,
            Address,
            Gender,
            DateOfBirth: DateOfBirth ? new Date(DateOfBirth) : undefined,
            ClassId,
            DepartmentId,
            RoleId,
        };
        if (Password) {
            updateData.Password = await bcrypt.hash(Password, 10);
        }
        const student = await prisma.student.update({
            where: { Id: id },
            data: updateData,
        });
        res.status(200).json({ data: student, message: "Student updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update student" });
    }
});

router.get("/student/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const student = await prisma.student.findUnique({
            where: { Id: id },
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
