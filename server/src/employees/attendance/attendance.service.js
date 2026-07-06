// server/src/employees/attendance/attendance.service.js
import prisma from "../../config/prisma.js";

function startOfDay(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function checkIn(employeeId, { ipAddress, device } = {}) {
  const date = startOfDay();
  const now = new Date();

  const [attendance] = await prisma.$transaction([
    prisma.attendance.upsert({
      where: { employeeId_date: { employeeId, date } },
      create: { employeeId, date, clockIn: now, status: "PRESENT" },
      update: { clockIn: now, status: "PRESENT" },
    }),
    prisma.attendanceLog.create({
      data: { employeeId, eventType: "CLOCK_IN", ipAddress, device },
    }),
  ]);

  return attendance;
}

export async function checkOut(employeeId, { ipAddress, device } = {}) {
  const date = startOfDay();
  const now = new Date();

  const existing = await prisma.attendance.findUnique({
    where: { employeeId_date: { employeeId, date } },
  });

  if (!existing || !existing.clockIn) {
    throw new Error("No clock-in record found for today");
  }

  const workingHours = (now - new Date(existing.clockIn)) / (1000 * 60 * 60);

  const [attendance] = await prisma.$transaction([
    prisma.attendance.update({
      where: { employeeId_date: { employeeId, date } },
      data: {
        clockOut: now,
        workingHours: Math.round(workingHours * 100) / 100,
        overtimeHours: workingHours > 9 ? Math.round((workingHours - 9) * 100) / 100 : 0,
      },
    }),
    prisma.attendanceLog.create({
      data: { employeeId, eventType: "CLOCK_OUT", ipAddress, device },
    }),
  ]);

  return attendance;
}

export async function recordBreak(employeeId, type, { ipAddress, device } = {}) {
  // type: "BREAK_START" | "BREAK_END"
  return prisma.attendanceLog.create({
    data: { employeeId, eventType: type, ipAddress, device },
  });
}

export async function listAttendance({ employeeId, from, to, status, page = 1, limit = 30 }) {
  const where = {
    ...(employeeId ? { employeeId } : {}),
    ...(status ? { status } : {}),
    ...(from || to
      ? {
          date: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  };

  const [data, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: { employee: { select: { fullName: true, employeeCode: true } } },
      orderBy: { date: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.attendance.count({ where }),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
}

export async function getEmployeeAttendanceLogs(employeeId, { from, to } = {}) {
  return prisma.attendanceLog.findMany({
    where: {
      employeeId,
      ...(from || to
        ? {
            timestamp: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { timestamp: "desc" },
  });
}

export async function markStatus(employeeId, date, status) {
  return prisma.attendance.upsert({
    where: { employeeId_date: { employeeId, date: startOfDay(date) } },
    create: { employeeId, date: startOfDay(date), status },
    update: { status },
  });
}