// server/src/employees/activity-logs/activityLogs.service.js
import prisma from "../../config/prisma.js";

// Called internally from other modules (e.g. after order creation, inventory update)
// to record an auditable employee action. Not just an HTTP-triggered write.
export async function logActivity({ employeeId, action, ipAddress, device }) {
  return prisma.activityLog.create({
    data: { employeeId, action, ipAddress, device },
  });
}

export async function listActivityLogs({ employeeId, from, to, page = 1, limit = 50 }) {
  const where = {
    ...(employeeId ? { employeeId } : {}),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: { employee: { select: { fullName: true, employeeCode: true } } },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.activityLog.count({ where }),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
}