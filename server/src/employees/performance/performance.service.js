// server/src/employees/performance/performance.service.js
import prisma from "../../config/prisma.js";

export async function listPerformance({ employeeId, period }) {
  return prisma.performanceRecord.findMany({
    where: {
      ...(employeeId ? { employeeId } : {}),
      ...(period ? { period } : {}),
    },
    include: { employee: { select: { fullName: true, employeeCode: true } } },
    orderBy: { period: "desc" },
  });
}

export async function upsertPerformance(payload) {
  const { employeeId, period, ...metrics } = payload;

  return prisma.performanceRecord.upsert({
    where: { employeeId_period: { employeeId, period } },
    create: { employeeId, period, ...metrics },
    update: metrics,
  });
}