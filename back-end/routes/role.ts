import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/role/get", async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.status(201)
            .json({ data: roles, message: "Role fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch roles" });
    }
});

router.post("/role/add", async (req, res) => {
    try {
        const { Name, Description } = req.body;
        const role = await prisma.role.create({
            data: { Name, Description },
        });
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: "Failed to create role" });
    }
});

router.delete("/role/delete", async (req, res) => {
    try {
        const { id } = req.body;
        const role = await prisma.role.delete({
            where: { Id: id },
        });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ error: "Failed to delete role" });
    }
});

router.put("/role/update", async (req, res) => {
    try {
        const { id, Name, Description } = req.body;
        const role = await prisma.role.update({
            where: { Id: id },
            data: { Name, Description },
        });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ error: "Failed to update role" });
    }
});

router.get("/role/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const role = await prisma.role.findUnique({
            where: { Id: id },
        });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch role" });
    }
})

export default router;