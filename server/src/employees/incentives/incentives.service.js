// server/src/employees/incentives/incentives.service.js
import prisma from "../../config/prisma.js";

export async function listIncentives({ employeeId, page = 1, limit = 20 }) {
  const where = employeeId ? { employeeId } : {};

  const [data, total] = await Promise.all([
    prisma.incentive.findMany({
      where,
      include: { employee: { select: { fullName: true, employeeCode: true } } },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.incentive.count({ where }),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
}

export async function createIncentive(payload) {
  return prisma.incentive.create({ data: payload });
}