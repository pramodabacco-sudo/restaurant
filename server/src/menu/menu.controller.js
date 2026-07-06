// server/src/menu/menu.controller.js
import * as service from "./menu.service.js";
import { validateCategoryInput, validateMenuItemInput } from "./menu.validation.js";

const handleError = (res, err) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || "Something went wrong" });
};

// ---------- Category ----------

export const getCategories = async (req, res) => {
  try {
    const categories = await service.listCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    handleError(res, err);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await service.getCategory(req.params.id);
    res.json({ success: true, data: category });
  } catch (err) {
    handleError(res, err);
  }
};

export const createCategory = async (req, res) => {
  try {
    const errors = validateCategoryInput(req.body);
    if (errors.length) return res.status(400).json({ success: false, errors });

    const category = await service.addCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const errors = validateCategoryInput(req.body, { isUpdate: true });
    if (errors.length) return res.status(400).json({ success: false, errors });

    const category = await service.editCategory(req.params.id, req.body);
    res.json({ success: true, data: category });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await service.removeCategory(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    handleError(res, err);
  }
};

// ---------- Menu Item ----------

export const getMenuItems = async (req, res) => {
  try {
    const items = await service.listMenuItems(req.query);
    res.json({ success: true, data: items });
  } catch (err) {
    handleError(res, err);
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const item = await service.getMenuItem(req.params.id);
    res.json({ success: true, data: item });
  } catch (err) {
    handleError(res, err);
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const errors = validateMenuItemInput(req.body);
    if (errors.length) return res.status(400).json({ success: false, errors });

    const item = await service.addMenuItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const errors = validateMenuItemInput(req.body, { isUpdate: true });
    if (errors.length) return res.status(400).json({ success: false, errors });

    const item = await service.editMenuItem(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    await service.removeMenuItem(req.params.id);
    res.json({ success: true, message: "Menu item deleted" });
  } catch (err) {
    handleError(res, err);
  }
};

// ---------- Image Upload ----------

export const uploadImage = async (req, res) => {
  try {
    const url = await service.uploadMenuItemImage(req.file, req.body.folder);
    res.json({ success: true, data: { url } });
  } catch (err) {
    handleError(res, err);
  }
};