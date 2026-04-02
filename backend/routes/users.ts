import { Router } from "express";
import { prisma } from "@/lib/prisma";
import {
  generateTemporaryPassword,
  hashTemporaryPassword,
} from "@/lib/password";

import { getUsers } from "@/lib/services/users/getAllUsers";
import { createUser } from "@/lib/services/users/createUser";
import { getUserById } from "@/lib/services/users/getUserById";
import { updateUser } from "@/lib/services/users/updateUser";
import { deleteUser } from "@/lib/services/users/deleteUser";
import { createActivity } from "@/lib/logActivity";
import {
  userCreateSchema,
  userUpdateSchema,
} from "@/lib/validations/userValidations";
import { requireRole } from "@/lib/require-role";
import { requireJWT } from "../lib/auth";

const router = Router();

router.get("/api/user", async (req, res) => {
  try {
    const user = await requireJWT(req);

    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    const users = await getUsers();
    return res.json(users);
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.error("GET users error:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/api/user", async (req, res) => {
  try {
    const user = await requireJWT(req);

    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    requireRole({ ...user, role: user.role as string }, ["admin"]);

    const process = userCreateSchema.safeParse(req.body);
    if (!process.success) {
      const firstError = process.error.issues[0]?.message ?? "Data tidak valid";
      return res.status(400).json({ message: firstError });
    }

    const { username, password, nip, email, role_id, employee_id } =
      process.data;

    const userCreate = await createUser({
      username,
      password,
      nip,
      email,
      role_id,
      employee_id,
    });

    await createActivity({
      userId: userCreate.id ? String(userCreate.id) : null,
      action: "create_user",
      description: {
        userId: userCreate.id,
        username: userCreate.username,
        message: "created",
      },
    });

    return res.status(201).json({
      message: "User berhasil dibuat",
      data: {
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        employee_id: userCreate.employee_id,
        link_status: userCreate.link_status,
        link_message: userCreate.link_message,
        role: {
          role_id: userCreate.role_id,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Create user error:", error);

    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/user/:id", async (req, res) => {
  try {
    const authUser = await requireJWT(req);

    if (!authUser.role || typeof authUser.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    const { id } = req.params;

    const isAdmin = authUser.role.toLowerCase() === "admin";
    const isSelf = String(authUser.userId ?? "") === id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.error("GET User Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/api/user/:id", async (req, res) => {
  try {
    const authUser = await requireJWT(req);

    if (!authUser.role || typeof authUser.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    const { id } = req.params;

    const isAdmin = authUser.role.toLowerCase() === "admin";
    const isSelf = String(authUser.userId ?? "") === id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const process = userUpdateSchema.safeParse(req.body);
    if (!process.success) {
      const firstError = process.error.issues[0]?.message ?? "Data tidak valid";
      return res.status(400).json({ message: firstError });
    }

    const nextData = { ...process.data };

    if (!isAdmin) {
      const currentUser = await getUserById(id);

      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!currentUser.role_id) {
        return res.status(400).json({ message: "Role user tidak valid" });
      }

      nextData.role_id = currentUser.role_id;
      nextData.employee_id = currentUser.employee_id;
    }

    const user = await updateUser(id, nextData);

    await createActivity({
      userId:
        authUser.userId === null || authUser.userId === undefined
          ? null
          : String(authUser.userId),
      action: "update_user",
      description: { userId: id, message: "updated" },
    });

    return res.json(user);
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (error instanceof Error && error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }

    if (error instanceof Error && error.message === "NIP wajib diisi") {
      return res.status(400).json({ message: error.message });
    }

    if ((error as { code?: string })?.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }

    console.error("PUT user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/api/user/:id", async (req, res) => {
  try {
    const authUser = await requireJWT(req);

    if (!authUser.role || authUser.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;

    await deleteUser(id);

    await createActivity({
      userId:
        authUser.userId === null || authUser.userId === undefined
          ? null
          : String(authUser.userId),
      action: "delete_user",
      description: { userId: id, message: "deleted" },
    });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if ((error as { code?: string })?.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }

    console.error("DELETE user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/user/:id/reset-password", async (req, res) => {
  try {
    const authUser = await requireJWT(req);

    if (!authUser.role || authUser.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const temporaryPassword = generateTemporaryPassword();
    const temporaryPasswordHash =
      await hashTemporaryPassword(temporaryPassword);

    await prisma.users.update({
      where: { id },
      data: { password_hash: temporaryPasswordHash },
    });

    await createActivity({
      userId:
        authUser.userId === null || authUser.userId === undefined
          ? null
          : String(authUser.userId),
      action: "reset_password",
      description: {
        userId: id,
        username: user.username,
        message: "password reset",
      },
    });

    return res.json({
      message: "Password berhasil direset",
      temporaryPassword,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      [
        "TOKEN_NOT_FOUND",
        "TOKEN_OUT_OF_SYNC",
        "SESSION_MISMATCH",
        "INVALID_TOKEN",
      ].includes(error.message)
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
