// server/src/employees/shifts/shifts.service.js
import prisma from "../../config/prisma.js";

export async function listShifts() {
  return prisma.shift.findMany({
    include: { assignments: { select: { id: true, employeeId: true, date: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function createShift(payload) {
  return prisma.shift.create({ data: payload });
}

export async function updateShift(id, payload) {
  return prisma.shift.update({ where: { id }, data: payload });
}

export async function deleteShift(id) {
  return prisma.shift.delete({ where: { id } });
}

export async function assignShift(shiftId, { employeeId, date }) {
  const assignDate = new Date(date);
  assignDate.setHours(0, 0, 0, 0);

  return prisma.shiftAssignment.upsert({
    where: { employeeId_date: { employeeId, date: assignDate } },
    create: { employeeId, shiftId, date: assignDate },
    update: { shiftId },
  });
}

export async function listAssignments({ date, shiftId }) {
  const where = {
    ...(shiftId ? { shiftId } : {}),
    ...(date
      ? {
          date: (() => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
          })(),
        }
      : {}),
  };

  return prisma.shiftAssignment.findMany({
    where,
    include: {
      employee: { select: { fullName: true, employeeCode: true, designation: true } },
      shift: true,
    },
    orderBy: { date: "desc" },
  });
}