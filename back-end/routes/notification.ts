import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/notification/get", async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            include: { User: true },
        });
        res.status(200).json({ data: notifications, message: "Notifications fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

router.post("/notification/add", async (req, res) => {
    try {
        const { UserId, Title, Message, Type, IsRead } = req.body;
        const notification = await prisma.notification.create({
            data: { UserId, Title, Message, Type, IsRead },
        });
        res.status(201).json({ data: notification, message: "Notification created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create notification" });
    }
});

router.delete("/notification/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const notification = await prisma.notification.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: notification, message: "Notification deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete notification" });
    }
});

router.put("/notification/update", async (req, res) => {
    try {
        const { id, Title, Message, Type, IsRead } = req.body;
        const notification = await prisma.notification.update({
            where: { Id: id },
            data: { Title, Message, Type, IsRead },
        });
        res.status(200).json({ data: notification, message: "Notification updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update notification" });
    }
});

router.get("/notification/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.findUnique({
            where: { Id: id },
            include: { User: true },
        });
        res.status(200).json({ data: notification, message: "Notification fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch notification" });
    }
});

export default router;
