// client/src/inventory/api/inventoryApi.js
//
// Routed through the shared apiClient (client/src/api/apiClient.js) instead
// of the plain axios instance in services/api.js — apiClient is what
// actually attaches the Bearer access token and silently refreshes it on a
// 401, which is required since every /api/inventory/* route is behind
// requireAuth + requireRole on the server. The old axios instance never
// attached a token at all, which is what caused the 401s.
//
// Every function here keeps the exact same name and return shape as before
// (resolves to the parsed JSON body, or throws an axios-shaped error with
// `.response.data.message` / `.response.status`), so none of the page
// components that call these functions need to change.
import { apiRequest } from "../../api/apiClient";

const base = "/inventory";

const buildQuery = (params) => {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "",
  );
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries).toString()}`;
};

// Throws an axios-shaped error on failure so existing `e?.response?.data?.message`
// handling in every page component keeps working unchanged.
const unwrap = ({ ok, status, data }) => {
  if (!ok) {
    const err = new Error(data?.message || `Request failed (${status})`);
    err.response = { status, data };
    throw err;
  }
  return data;
};

const get = (path, params) =>
  apiRequest(`${path}${buildQuery(params)}`).then(unwrap);
const post = (path, body) =>
  apiRequest(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).then(unwrap);
const put = (path, body) =>
  apiRequest(path, { method: "PUT", body: JSON.stringify(body) }).then(unwrap);
const patch = (path, body) =>
  apiRequest(path, {
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).then(unwrap);
const del = (path) => apiRequest(path, { method: "DELETE" }).then(unwrap);

// ── Units ──
export const getUnits = () => get(`${base}/units`);
export const createUnit = (data) => post(`${base}/units`, data);
export const updateUnit = (id, data) => put(`${base}/units/${id}`, data);
export const deleteUnit = (id) => del(`${base}/units/${id}`);

// ── Ingredient Categories ──
export const getCategories = () => get(`${base}/ingredient-categories`);
export const createCategory = (data) =>
  post(`${base}/ingredient-categories`, data);
export const updateCategory = (id, data) =>
  put(`${base}/ingredient-categories/${id}`, data);
export const deleteCategory = (id) =>
  del(`${base}/ingredient-categories/${id}`);

// ── Suppliers ──
export const getSuppliers = () => get(`${base}/suppliers`);
export const getSupplier = (id) => get(`${base}/suppliers/${id}`);
export const getSupplierHistory = (id) =>
  get(`${base}/suppliers/${id}/history`);
export const createSupplier = (data) => post(`${base}/suppliers`, data);
export const updateSupplier = (id, data) =>
  put(`${base}/suppliers/${id}`, data);
export const deleteSupplier = (id) => del(`${base}/suppliers/${id}`);

// ── Ingredients ──
export const getIngredients = (params) => get(`${base}/ingredients`, params);
export const getIngredient = (id) => get(`${base}/ingredients/${id}`);
export const createIngredient = (data) => post(`${base}/ingredients`, data);
export const updateIngredient = (id, data) =>
  put(`${base}/ingredients/${id}`, data);
export const deleteIngredient = (id) => del(`${base}/ingredients/${id}`);

// ── Stock (read-only) ──
export const getStock = () => get(`${base}/stock`);
export const getStockByIngredient = (id) => get(`${base}/stock/${id}`);
export const getDashboardSummary = () => get(`${base}/stock/dashboard`);

// ── Purchase Entries (goods receipt) ──
export const getPurchaseEntries = (params) =>
  get(`${base}/purchase-entries`, params);
export const createPurchaseEntry = (data) =>
  post(`${base}/purchase-entries`, data);

// ── Stock Movements (ledger) ──
export const getMovements = (params) => get(`${base}/movements`, params);

// ── Recipes ──
export const getRecipe = (menuItemId) => get(`${base}/recipes/${menuItemId}`);
export const setRecipe = (menuItemId, ingredients) =>
  put(`${base}/recipes/${menuItemId}`, { ingredients });
export const upsertRecipeIngredient = (menuItemId, ingredientId, quantity) =>
  post(`${base}/recipes/${menuItemId}`, { ingredientId, quantity });
export const removeRecipeIngredient = (menuItemId, ingredientId) =>
  del(`${base}/recipes/${menuItemId}/${ingredientId}`);

// ── Adjustments ──
export const getAdjustments = (params) => get(`${base}/adjustments`, params);
export const createAdjustment = (data) => post(`${base}/adjustments`, data);

// ── Wastage ──
export const getWastageRecords = (params) => get(`${base}/wastage`, params);
export const createWastageRecord = (data) => post(`${base}/wastage`, data);

// ── Alerts ──
export const getAlerts = (params) => get(`${base}/alerts`, params);
export const generateAlerts = () => post(`${base}/alerts/generate`);
export const resolveAlert = (id) => patch(`${base}/alerts/${id}/resolve`);

// ── Expiry Batches ──
export const getExpiryBatches = (params) =>
  get(`${base}/expiry-batches`, params);

// ── Menu items (for the Recipes screen — reuses the existing menu module) ──
// Menu's response shape isn't guaranteed to be a bare array the way
// Inventory's endpoints are (it may come wrapped as { success, data }). This
// normalizes whatever comes back to a plain array so callers never have to
// guess the envelope.
export const getMenuItems = () =>
  get(`/menu`).then((res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    if (Array.isArray(res?.menuItems)) return res.menuItems;
    return [];
  });
