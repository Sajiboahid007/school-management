import prisma from "./lib/prisma.js";
import bcrypt from "bcryptjs";

async function verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
    if (!storedPassword) return false;
    try {
        const isMatch = await bcrypt.compare(inputPassword, storedPassword);
        if (isMatch) return true;
    } catch (err) {}
    return inputPassword === storedPassword;
}

async function testLogin(email: string, pass: string) {
    const user = await prisma.user.findUnique({
        where: { Email: email },
        include: { Role: true },
    });
    if (!user) {
        console.log(`User ${email} NOT found`);
        return;
    }
    const isMatch = await verifyPassword(pass, user.Password);
    console.log(`User ${email} login match:`, isMatch);
}

async function main() {
    await testLogin("superadmin@school.com", "123456");
    await testLogin("superadmin@edu.com", "123456");
}

main().catch(console.error);
