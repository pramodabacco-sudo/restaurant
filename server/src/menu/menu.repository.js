// server/src/menu/menu.repository.js
import prisma from "../config/prisma.js";

// ---------- Category ----------

export const findAllCategories = () =>
  prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: { subCategories: true },
  });

export const findCategoryById = (id) =>
  prisma.category.findUnique({
    where: { id },
    include: { subCategories: true },
  });

export const createCategory = (data) => prisma.category.create({ data });

export const updateCategory = (id, data) =>
  prisma.category.update({ where: { id }, data });

export const deleteCategory = (id) =>
  prisma.category.delete({ where: { id } });

// ---------- Menu Item ----------

export const findAllMenuItems = (filters = {}) => {
  const where = {};

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.subCategoryId) where.subCategoryId = filters.subCategoryId;
  if (filters.foodType) where.foodType = filters.foodType;
  if (filters.isAvailable !== undefined) where.isAvailable = filters.isAvailable;
  if (filters.kitchenSectionId) where.kitchenSectionId = filters.kitchenSectionId;
  if (filters.status) where.status = filters.status;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { sku: { contains: filters.search, mode: "insensitive" } },
      { barcode: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.menuItem.findMany({
    where,
    include: { category: true, subCategory: true, kitchenSection: true },
    orderBy: { createdAt: "desc" },
  });
};

export const findMenuItemById = (id) =>
  prisma.menuItem.findUnique({
    where: { id },
    include: { category: true, subCategory: true, kitchenSection: true },
  });

export const findMenuItemBySku = (sku) =>
  prisma.menuItem.findUnique({ where: { sku } });

export const createMenuItem = (data) => prisma.menuItem.create({ data });

export const updateMenuItem = (id, data) =>
  prisma.menuItem.update({ where: { id }, data });

export const softDeleteMenuItem = (id) =>
  prisma.menuItem.update({ where: { id }, data: { status: "DELETED" } });

export const hardDeleteMenuItem = (id) =>
  prisma.menuItem.delete({ where: { id } });