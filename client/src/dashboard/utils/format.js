// ==============================================
// src/dashboard/utils/format.js
// ==============================================

export const formatCurrency = (value = 0) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const formatTimeAgo = (dateInput) => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

// Human-friendly labels for backend enum values (OrderStatus, PaymentStatus,
// PaymentMethod) so the UI doesn't have to show raw SCREAMING_CASE strings.
export const humanizeEnum = (value = "") =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
