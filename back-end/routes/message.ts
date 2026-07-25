import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/message/get", async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            include: { Sender: true, Receiver: true },
        });
        res.status(200).json({ data: messages, message: "Messages fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

router.post("/message/add", async (req, res) => {
    try {
        const { SenderId, ReceiverId, Subject, Content, IsRead } = req.body;
        const msg = await prisma.message.create({
            data: {
                SenderId: Number(SenderId),
                ReceiverId: Number(ReceiverId),
                Subject,
                Content,
                IsRead: IsRead !== undefined ? IsRead : false,
            },
        });
        res.status(201).json({ data: msg, message: "Message created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create message" });
    }
});

router.delete("/message/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const msg = await prisma.message.delete({
            where: { Id: Number(id) },
        });
        res.status(200).json({ data: msg, message: "Message deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete message" });
    }
});

router.put("/message/update", async (req, res) => {
    try {
        const { id, SenderId, ReceiverId, Subject, Content, IsRead } = req.body;
        const msg = await prisma.message.update({
            where: { Id: Number(id) },
            data: {
                SenderId: SenderId ? Number(SenderId) : undefined,
                ReceiverId: ReceiverId ? Number(ReceiverId) : undefined,
                Subject,
                Content,
                IsRead,
            },
        });
        res.status(200).json({ data: msg, message: "Message updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update message" });
    }
});

router.get("/message/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const msg = await prisma.message.findUnique({
            where: { Id: Number(id) },
            include: { Sender: true, Receiver: true },
        });
        res.status(200).json({ data: msg, message: "Message fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch message" });
    }
});

export default router;
