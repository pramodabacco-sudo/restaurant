// server/src/employees/payroll/payroll.service.js
import prisma from "../../config/prisma.js";

export async function listPayroll({ employeeId, month, status, page = 1, limit = 20 }) {
  const where = {
    ...(employeeId ? { employeeId } : {}),
    ...(month ? { month } : {}),
    ...(status ? { status } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.payrollRecord.findMany({
      where,
      include: { employee: { select: { fullName: true, employeeCode: true } }, salaryExpense: true },
      orderBy: { month: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
    prisma.payrollRecord.count({ where }),
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
}

export async function generatePayroll(payload) {
  const { employeeId, month, basicSalary, allowances = 0, bonus = 0, overtimePay = 0, deductions = 0 } = payload;
  const netSalary = Number(basicSalary) + Number(allowances) + Number(bonus) + Number(overtimePay) - Number(deductions);

  return prisma.payrollRecord.upsert({
    where: { employeeId_month: { employeeId, month } },
    create: { employeeId, month, basicSalary, allowances, bonus, overtimePay, deductions, netSalary },
    update: { basicSalary, allowances, bonus, overtimePay, deductions, netSalary },
  });
}

// Marks a payroll record as paid and creates the linked accounting-side SalaryExpense row
export async function markAsPaid(id) {
  const payroll = await prisma.payrollRecord.findUnique({
    where: { id },
    include: { employee: true },
  });
  if (!payroll) throw new Error("Payroll record not found");
  if (payroll.salaryExpenseId) throw new Error("Payroll already marked as paid");

  const salaryExpense = await prisma.salaryExpense.create({
    data: {
      employeeName: payroll.employee.fullName,
      employeeId: payroll.employeeId,
      salaryMonth: new Date(`${payroll.month}-01`),
      baseSalary: payroll.basicSalary,
      bonus: payroll.bonus,
      incentives: 0,
      overtime: payroll.overtimePay,
      deductions: payroll.deductions,
      netSalary: payroll.netSalary,
      paymentStatus: "PAID",
      paymentDate: new Date(),
      store: payroll.employee.store,
    },
  });

  return prisma.payrollRecord.update({
    where: { id },
    data: { status: "PAID", salaryExpenseId: salaryExpense.id },
    include: { salaryExpense: true },
  });
}