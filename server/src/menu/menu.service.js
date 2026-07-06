// server/src/menu/menu.service.js
import * as repo from "./menu.repository.js";
import { uploadToR2, deleteFromR2 } from "../config/r2.js";

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ---------- Category ----------

export const listCategories = () => repo.findAllCategories();

export const getCategory = async (id) => {
  const category = await repo.findCategoryById(id);
  if (!category) throw new AppError("Category not found", 404);
  return category;
};

export const addCategory = (data) =>
  repo.createCategory({
    name: data.name.trim(),
    description: data.description ?? null,
    imageUrl: data.imageUrl ?? null,
    displayOrder: data.displayOrder ? Number(data.displayOrder) : 0,
    isEnabled: data.isEnabled ?? true,
  });

export const editCategory = async (id, data) => {
  await getCategory(id); // throws 404 if missing
  return repo.updateCategory(id, data);
};

export const removeCategory = async (id) => {
  await getCategory(id);
  return repo.deleteCategory(id);
};

// ---------- Menu Item ----------

export const listMenuItems = (filters) => repo.findAllMenuItems(filters);

export const getMenuItem = async (id) => {
  const item = await repo.findMenuItemById(id);
  if (!item) throw new AppError("Menu item not found", 404);
  return item;
};

export const addMenuItem = async (data) => {
  const category = await repo.findCategoryById(data.categoryId);
  if (!category) throw new AppError("Category does not exist", 400);

  const existingSku = await repo.findMenuItemBySku(data.sku);
  if (existingSku) throw new AppError("SKU already exists", 409);

  return repo.createMenuItem({
    name: data.name.trim(),
    shortName: data.shortName ?? null,
    sku: data.sku.trim(),
    barcode: data.barcode ?? null,
    categoryId: data.categoryId,
    subCategoryId: data.subCategoryId ?? null,
    foodType: data.foodType ?? "VEG",
    kitchenSectionId: data.kitchenSectionId ?? null,
    sellingPrice: Number(data.sellingPrice),
    costPrice: data.costPrice !== undefined ? Number(data.costPrice) : null,
    gstPercent: data.gstPercent !== undefined ? Number(data.gstPercent) : 0,
    serviceCharge: data.serviceCharge !== undefined ? Number(data.serviceCharge) : null,
    isAvailable: data.isAvailable ?? true,
    isSeasonal: data.isSeasonal ?? false,
    isHiddenFromPOS: data.isHiddenFromPOS ?? false,
    status: data.status ?? "ACTIVE",
    imageUrl: data.imageUrl ?? null,
    description: data.description ?? null,
    prepTimeMinutes: data.prepTimeMinutes ? Number(data.prepTimeMinutes) : null,
  });
};

export const editMenuItem = async (id, data) => {
  await getMenuItem(id); // throws 404 if missing

  if (data.categoryId) {
    const category = await repo.findCategoryById(data.categoryId);
    if (!category) throw new AppError("Category does not exist", 400);
  }

  if (data.sku) {
    const existing = await repo.findMenuItemBySku(data.sku);
    if (existing && existing.id !== id) {
      throw new AppError("SKU already exists", 409);
    }
  }

  return repo.updateMenuItem(id, data);
};

// Soft delete by default, matching the doc's "Deleted (Soft Delete)" status
export const removeMenuItem = async (id) => {
  await getMenuItem(id);
  return repo.softDeleteMenuItem(id);
};

export const uploadMenuItemImage = async (file, folder = "menu-items") => {
  if (!file) throw new AppError("No file uploaded", 400);
  const { url } = await uploadToR2(file.buffer, file.originalname, file.mimetype, folder);
  return url;
};

export { AppError };