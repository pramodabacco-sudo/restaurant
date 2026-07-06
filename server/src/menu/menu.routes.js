// server/src/menu/menu.routes.js
import { Router } from "express";
import * as controller from "./menu.controller.js";
import upload from "../config/upload.js";

// NOTE: No auth/role middleware yet — added intentionally as a later step.
// When login exists, wrap the routes below like:
//   router.post("/menu", requireAuth, requireRole(["Admin","Manager"]), controller.createMenuItem);
// Read-only routes (GET) will allow Admin, Manager, Cashier, Kitchen Staff.
// Write routes (POST/PUT/DELETE) will allow Admin, Manager only.

const router = Router();

// ---------- Category ----------
router.get("/categories", controller.getCategories);
router.get("/categories/:id", controller.getCategoryById);
router.post("/categories", controller.createCategory);
router.put("/categories/:id", controller.updateCategory);
router.delete("/categories/:id", controller.deleteCategory);

// ---------- Menu Items ----------
router.get("/menu", controller.getMenuItems);
router.get("/menu/:id", controller.getMenuItemById);
router.post("/menu", controller.createMenuItem);
router.put("/menu/:id", controller.updateMenuItem);
router.delete("/menu/:id", controller.deleteMenuItem);

// ---------- Image Upload (used by both category & menu item forms) ----------
router.post("/upload", upload.single("image"), controller.uploadImage);

export default router;