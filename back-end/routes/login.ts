import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const router = express.Router();

async function verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    if (!storedPassword) return false;
    const cleanInput = inputPassword.trim();
    const cleanStored = storedPassword.trim();

    try {
        const isMatch = await bcrypt.compare(cleanInput, cleanStored);
        if (isMatch) return true;
    } catch (err) {
        // Fallback if storedPassword is not a valid bcrypt hash
    }
    return cleanInput === cleanStored;
}

router.post("/login", async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }

        const cleanEmail = String(Email).trim();
        const cleanPassword = String(Password).trim();



        // 1. Check User Table (Admins / Staff / Super Admin)
        const user = await prisma.user.findFirst({
            where: { Email: cleanEmail },
            include: { Role: true },
        });

        if (user) {
            const isMatch = await verifyPassword(cleanPassword, user.Password);
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
        const teacher = await prisma.teacher.findFirst({
            where: { Email: cleanEmail },
            include: { Department: true, Role: true, ClassesTaught: true, SubjectsTaught: true },
        });

        if (teacher) {
            const isMatch = await verifyPassword(cleanPassword, teacher.Password);
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
        const student = await prisma.student.findFirst({
            where: { Email: cleanEmail },
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
            const isMatch = await verifyPassword(cleanPassword, student.Password);
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
        console.warn(`[LOGIN FAILED] Invalid credentials for "${cleanEmail}"`);
        return res.status(400).json({ error: "Invalid Email or Password" });
    } catch (error) {
        console.error("[LOGIN ERROR]:", error);
        return res.status(500).json({ error: "Login failed" });
    }
});

export default router;
