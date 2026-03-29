import { Router } from "express";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getEmployees } from "@/lib/services/employee/getEmployees";
import { createEmployee } from "@/lib/services/employee/createEmployee";
import { getEmployeeById } from "@/lib/services/employee/getEmployeeById";
import { updateEmployee } from "@/lib/services/employee/updateEmployee";
import { getDocumentsByEmployee } from "@/lib/services/employee/getDocumentsByEmployee";
import { employeeSchema } from "@/lib/validations/employeeValidations";
import { createActivity } from "@/lib/logActivity";
import { requireJWT } from "@/backend/lib/auth";

const router = Router();

router.get("/api/employees", async (req, res) => {
  try {
    const user = requireJWT(req);
    if (!user.role || typeof user.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    const employees = await getEmployees();
    return res.json(employees);
  } catch (error) {
    console.error("GET employees error:", error);
    return res.status(500).json({ message: "Failed to fetch employees" });
  }
});

router.post("/api/employees", async (req, res) => {
  try {
    const { role, userId } = requireJWT(req);

    if (role !== "admin" && role !== "employee" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const shouldLinkToCurrentUser = req.body?.linkToCurrentUser === true;
    const process = employeeSchema.safeParse(req.body);

    if (!process.success) {
      return res.status(400).json({ message: process.error.issues });
    }

    const employee = await createEmployee(process.data);

    if ((role === "employee" || shouldLinkToCurrentUser) && userId) {
      await prisma.users.update({
        where: { id: String(userId) },
        data: { employee_id: employee.id },
      });
    }

    await createActivity({
      userId: userId === null || userId === undefined ? null : String(userId),
      action: "create_employee",
      description: {
        employeeId: employee.id,
        name: (employee.nama as string | null) ?? null,
        message: "created",
      },
    });

    return res.status(201).json({
      message: "Employee created successfully",
      data: employee,
    });
  } catch (error) {
    console.error("ERROR:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/employees/:id", async (req, res) => {
  try {
    const auth = requireJWT(req);
    const { id } = req.params;

    if (!auth.role || typeof auth.role !== "string") {
      return res.status(400).json({ message: "User role is required" });
    }

    if (auth.role !== "admin") {
      if (auth.role !== "employee" && !auth.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const me = await prisma.users.findUnique({
        where: { id: String(auth.userId) },
        select: { employee_id: true },
      });

      if (!me?.employee_id || me.employee_id !== id) {
        return res.status(404).json({ message: "Not Found" });
      }
    }

    const employee = await getEmployeeById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json(employee);
  } catch (error) {
    console.error("GET Employee Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/api/employees/:id", async (req, res) => {
  try {
    const { userId, role } = requireJWT(req);
    const employeeId = req.params.id;

    if (userId === null || role === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role !== "admin" && role !== "hr") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (role === "hr") {
      const me = await prisma.users.findUnique({
        where: { id: String(userId) },
        select: { employee_id: true },
      });

      if (!me?.employee_id || me.employee_id !== employeeId) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    const employeeOwner = await getEmployeeById(employeeId);

    if (!employeeOwner && role !== "admin") {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employee = await updateEmployee(employeeId, req.body);

    await createActivity({
      userId: userId === null || userId === undefined ? null : String(userId),
      action: "update_employee",
      description: {
        employeeId,
        employeeName: employeeOwner?.nama ?? null,
        message: "updated",
      },
    });

    return res.json(employee);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/api/employees/:id", async (req, res) => {
  try {
    const { userId, role } = requireJWT(req);
    const employeeId = req.params.id;

    if (userId === null || role === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const employeeOwner = await getEmployeeById(employeeId);

    if (!employeeOwner) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.users.updateMany({
        where: { employee_id: employeeId },
        data: { employee_id: null },
      });

      await tx.employees.delete({ where: { id: employeeId } });
    });

    await createActivity({
      userId: userId === null || userId === undefined ? null : String(userId),
      action: "delete_employee",
      description: {
        employeeId,
        employeeName: employeeOwner?.nama ?? null,
        message: "deleted",
      },
    });

    return res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return res.status(409).json({
        message:
          "Employee tidak bisa dihapus karena masih terhubung ke data lain",
      });
    }

    console.error("DELETE employee error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/api/employees/:id/documents", async (req, res) => {
  try {
    const { id } = req.params;
    const documents = await getDocumentsByEmployee(id);
    return res.json({ success: true, data: documents });
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ success: false, message });
  }
});

export default router;
