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
        const message = await prisma.message.create({
            data: { SenderId, ReceiverId, Subject, Content, IsRead },
        });
        res.status(201).json({ data: message, message: "Message created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create message" });
    }
});

router.delete("/message/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const message = await prisma.message.delete({
            where: { Id: id },
        });
        res.status(200).json({ data: message, message: "Message deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete message" });
    }
});

router.put("/message/update", async (req, res) => {
    try {
        const { id, Subject, Content, IsRead } = req.body;
        const message = await prisma.message.update({
            where: { Id: id },
            data: { Subject, Content, IsRead },
        });
        res.status(200).json({ data: message, message: "Message updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update message" });
    }
});

router.get("/message/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const message = await prisma.message.findUnique({
            where: { Id: id },
            include: { Sender: true, Receiver: true },
        });
        res.status(200).json({ data: message, message: "Message fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch message" });
    }
});

export default router;
