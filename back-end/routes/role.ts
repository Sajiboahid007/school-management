import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

router.get("/role/get", async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.status(200).json({ data: roles, message: "Roles fetched successfully" });
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
        res.status(201).json({ data: role, message: "Role created successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to create role" });
    }
});

router.delete(["/role/delete", "/role/delete/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const role = await prisma.role.delete({
            where: { Id: Number(id) },
        });
        res.status(200).json({ data: role, message: "Role deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete role" });
    }
});

router.put(["/role/update", "/role/update/:id"], async (req, res) => {
    try {
        const id = req.params.id || req.body.id || req.body.Id;
        const { Name, Description } = req.body;
        const roleId = Number(id);
        if (!id || isNaN(roleId)) {
            return res.status(400).json({ error: "Invalid or missing role ID" });
        }
        const role = await prisma.role.update({
            where: { Id: roleId },
            data: { Name, Description },
        });
        res.status(200).json({ data: role, message: "Role updated successfully" });
    } catch (error: any) {
        console.error("Error updating role:", error);
        res.status(400).json({ error: error?.message || "Failed to update role" });
    }
});

router.get("/role/getById/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const role = await prisma.role.findUnique({
            where: { Id: Number(id) },
        });
        res.status(200).json({ data: role, message: "Role fetched successfully" });
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch role" });
    }
});

export default router;