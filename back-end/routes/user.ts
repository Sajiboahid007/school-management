import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/user/get", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { Role: true },
        });
        res.status(200).json({ data: users, message: "Users fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post("/user/add", async (req, res) => {
    try {
        const { Name, Email, Password, Phone, RoleId } = req.body;
        const hashedPassword = await bcrypt.hash(Password, 10);
        const user = await prisma.user.create({
            data: { Name, Email, Password: hashedPassword, Phone, RoleId },
        });
        res.status(201).json({ data: user, message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create user" });
    }
});

router.delete("/user/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const user = await prisma.user.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: user, message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete user" });
    }
});

router.put("/user/update", async (req, res) => {
    try {
        const { id, Name, Email, Password, Phone, RoleId } = req.body;
        const updateData: any = { Name, Email, Phone, RoleId };
        if (Password) {
            updateData.Password = await bcrypt.hash(Password, 10);
        }
        const user = await prisma.user.update({
            where: { Id: id },
            data: updateData,
        });
        res.status(200).json({ data: user, message: "User updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update user" });
    }
});

router.get("/user/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { Id: id },
            include: { Role: true },
        });
        res.status(200).json({ data: user, message: "User fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch user" });
    }
});

export default router;
