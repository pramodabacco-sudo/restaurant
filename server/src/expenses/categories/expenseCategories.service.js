import prisma from "../../config/prisma.js";

export const getAllCategories = () =>
  prisma.expenseCategory.findMany({
    orderBy: { name: "asc" },
  });

export const getCategoryById = (id) =>
  prisma.expenseCategory.findUnique({ where: { id } });

export const createCategory = (data) =>
  prisma.expenseCategory.create({ data });

export const updateCategory = (id, data) =>
  prisma.expenseCategory.update({ where: { id }, data });

// Categories are disabled rather than hard-deleted when expenses already
// reference them, so historical expenses never lose their category.
export const deleteCategory = async (id) => {
  const inUse = await prisma.expense.count({ where: { categoryId: id } });
  if (inUse > 0) {
    return prisma.expenseCategory.update({
      where: { id },
      data: { isEnabled: false },
    });
  }
  return prisma.expenseCategory.delete({ where: { id } });
};