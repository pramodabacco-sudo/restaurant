// server/src/employees/leaves/leaves.service.js
import prisma from "../../config/prisma.js";

export async function listLeaves({ employeeId, status, page = 1, limit = 20 }) {
  const where = {
    ...(employeeId ? { employeeId } : {}),
    ...(status ? { status } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.leaveRequest.findMany({
      where,
      include: { employee: { select: { fullName: true, employeeCode: true } } },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.leaveRequest.count({ where }),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
}

export async function createLeaveRequest(payload) {
  return prisma.leaveRequest.create({ data: payload });
}

export async function decideLeaveRequest(id, { status, approvedById }) {
  // status: "APPROVED" | "REJECTED"
  const leave = await prisma.leaveRequest.update({
    where: { id },
    data: { status, approvedById },
  });

  if (status === "APPROVED") {
    // Reflect approved leave in the daily attendance rollup for each day in range
    const dates = [];
    const cursor = new Date(leave.fromDate);
    const end = new Date(leave.toDate);
    while (cursor <= end) {
      dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    await prisma.$transaction(
      dates.map((date) =>
        prisma.attendance.upsert({
          where: { employeeId_date: { employeeId: leave.employeeId, date } },
          create: { employeeId: leave.employeeId, date, status: "LEAVE" },
          update: { status: "LEAVE" },
        })
      )
    );
  }

  return leave;
}