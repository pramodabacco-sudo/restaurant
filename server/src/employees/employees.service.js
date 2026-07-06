// server/src/employees/employees.service.js
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

/**
 * Generates the next sequential employee code, e.g. EMP-0001, EMP-0002.
 * NOTE: simple count-based approach — fine for single-writer admin usage.
 * If concurrent creation becomes an issue, switch to a DB sequence.
 */
async function generateEmployeeCode() {
  const count = await prisma.employee.count();
  const next = count + 1;
  return `EMP-${String(next).padStart(4, "0")}`;
}

export async function listEmployees({ search, department, designation, status, page = 1, limit = 20 }) {
  const where = {
    ...(status ? { status } : {}),
    ...(department ? { department } : {}),
    ...(designation ? { designation } : {}),
    ...(search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { employeeCode: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: { address: true, userAccount: { select: { username: true, role: true, isActive: true } } },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.employee.count({ where }),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
}

export async function getEmployeeById(id) {
  return prisma.employee.findUnique({
    where: { id },
    include: {
      address: true,
      userAccount: { select: { username: true, email: true, role: true, isActive: true, lastLoginAt: true } },
    },
  });
}

export async function createEmployee(payload) {
  const { address, ...employeeData } = payload;
  const employeeCode = await generateEmployeeCode();

  return prisma.employee.create({
    data: {
      ...employeeData,
      employeeCode,
      ...(address
        ? {
            address: { create: address },
          }
        : {}),
    },
    include: { address: true },
  });
}

export async function updateEmployee(id, payload) {
  const { address, ...employeeData } = payload;

  return prisma.employee.update({
    where: { id },
    data: {
      ...employeeData,
      ...(address
        ? {
            address: {
              upsert: {
                create: address,
                update: address,
              },
            },
          }
        : {}),
    },
    include: { address: true },
  });
}

export async function deleteEmployee(id) {
  // Soft-delete preferred over hard delete so history (attendance, salary, etc.) isn't orphaned.
  return prisma.employee.update({
    where: { id },
    data: { status: "TERMINATED" },
  });
}

export async function createLoginAccount(employeeId, { username, email, password, pin, role }) {
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.userAccount.create({
    data: { employeeId, username, email, passwordHash, pin, role },
    select: { id: true, username: true, email: true, role: true, isActive: true },
  });
}

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, present, absent, onLeave, pendingLeaveRequests] = await Promise.all([
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.attendance.count({ where: { date: today, status: "PRESENT" } }),
    prisma.attendance.count({ where: { date: today, status: "ABSENT" } }),
    prisma.attendance.count({ where: { date: today, status: "LEAVE" } }),
    prisma.leaveRequest.count({ where: { status: "PENDING" } }),
  ]);

  return { totalEmployees: total, presentToday: present, absentToday: absent, onLeaveToday: onLeave, pendingLeaveRequests };
}