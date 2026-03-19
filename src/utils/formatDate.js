export function formatDate(dateString) {
  if (!dateString) return "Unknown";
  try {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
