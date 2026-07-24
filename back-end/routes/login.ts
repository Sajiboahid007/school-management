import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }

        // 1. Check User Table (Admins / Staff)
        const user = await prisma.user.findUnique({
            where: { Email },
            include: { Role: true },
        });

        if (user) {
            const isMatch = await bcrypt.compare(Password, user.Password);
            if (isMatch) {
                const { Password: _, ...userWithoutPassword } = user;
                return res.status(200).json({
                    data: userWithoutPassword,
                    userType: "USER",
                    message: "Login successful",
                });
            }
        }

        // 2. Check Teacher Table
        const teacher = await prisma.teacher.findUnique({
            where: { Email },
            include: { Department: true, Role: true, ClassesTaught: true, SubjectsTaught: true },
        });

        if (teacher) {
            const isMatch = await bcrypt.compare(Password, teacher.Password);
            if (isMatch) {
                const { Password: _, ...teacherWithoutPassword } = teacher;
                return res.status(200).json({
                    data: teacherWithoutPassword,
                    userType: "TEACHER",
                    message: "Login successful",
                });
            }
        }

        // 3. Check Student Table
        const student = await prisma.student.findUnique({
            where: { Email },
            include: {
                Class: true,
                Department: true,
                Role: true,
                ExamsResults: {
                    include: { Exam: true, Subject: true, RecordedByTeacher: true },
                },
                Fees: true,
            },
        });

        if (student) {
            const isMatch = await bcrypt.compare(Password, student.Password);
            if (isMatch) {
                const { Password: _, ...studentWithoutPassword } = student;
                return res.status(200).json({
                    data: studentWithoutPassword,
                    userType: "STUDENT",
                    message: "Login successful",
                });
            }
        }

        // Invalid Credentials
        return res.status(400).json({ error: "Invalid Email or Password" });
    } catch (error) {
        return res.status(500).json({ error: "Login failed" });
    }
});

export default router;
