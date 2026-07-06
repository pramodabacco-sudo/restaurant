import express from "express";
import cors from "cors";
import menuRoutes from "./menu/menu.routes.js";
import inventoryRoutes from"./inventory/inventory.routes.js"

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is live 🚀");
});

// Mounted with no auth for now — role guards get added here later
app.use("/api", menuRoutes);
app.use("/api/inventory", inventoryRoutes)

export default app;