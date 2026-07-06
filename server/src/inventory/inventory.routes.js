// server\src\inventory\inventory.routes.js
// Mount this once in your main app, e.g.: app.use("/api/inventory", inventoryRoutes)
import { Router } from "express";
import unitsRoutes from "./routes/units.routes.js";
import ingredientCategoriesRoutes from "./routes/ingredientCategories.routes.js";
import suppliersRoutes from "./routes/suppliers.routes.js";
import ingredientsRoutes from "./routes/ingredients.routes.js";
import inventoryStockRoutes from "./routes/inventoryStock.routes.js";

const router = Router();

router.use("/units", unitsRoutes);
router.use("/ingredient-categories", ingredientCategoriesRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/ingredients", ingredientsRoutes);
router.use("/stock", inventoryStockRoutes);

export default router;