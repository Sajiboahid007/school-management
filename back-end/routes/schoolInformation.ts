import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/schoolInformation/get", async (req, res) => {
    try {
        const info = await prisma.schoolInformation.findMany();
        res.status(200).json({ data: info, message: "School information fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch school information" });
    }
});

router.post("/schoolInformation/add", async (req, res) => {
    try {
        const { Name, Code, Address, Phone, Email, Website, LogoUrl, CurrentYear } = req.body;
        const info = await prisma.schoolInformation.create({
            data: { Name, Code, Address, Phone, Email, Website, LogoUrl, CurrentYear },
        });
        res.status(201).json({ data: info, message: "School information created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create school information" });
    }
});

router.delete("/schoolInformation/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const info = await prisma.schoolInformation.delete({
            where: { Id: Number(id) },
        });
        res.status(200).json({ data: info, message: "School information deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete school information" });
    }
});

router.put("/schoolInformation/update", async (req, res) => {
    try {
        const { id, Name, Code, Address, Phone, Email, Website, LogoUrl, CurrentYear } = req.body;
        const info = await prisma.schoolInformation.update({
            where: { Id: Number(id) },
            data: { Name, Code, Address, Phone, Email, Website, LogoUrl, CurrentYear },
        });
        res.status(200).json({ data: info, message: "School information updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to update school information" });
    }
});

router.get("/schoolInformation/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const info = await prisma.schoolInformation.findUnique({
            where: { Id: Number(id) },
        });
        res.status(200).json({ data: info, message: "School information fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch school information" });
    }
});

export default router;
