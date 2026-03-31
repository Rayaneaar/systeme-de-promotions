import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatDate(value) {
  if (!value) return "Non renseigne";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
function formatDateTime(value) {
  if (!value) return "Non renseigne";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
function formatBytes(bytes) {
  if (!bytes) return "0 o";
  const units = ["o", "Ko", "Mo", "Go"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}
function extractErrorMessage(error) {
  const candidate = error;
  const apiMessage = candidate.response?.data?.message;
  if (apiMessage) return apiMessage;
  const apiErrors = candidate.response?.data?.errors;
  if (typeof apiErrors === "string") return apiErrors;
  if (apiErrors && typeof apiErrors === "object") {
    const first = Object.values(apiErrors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  return candidate.message || "Une erreur inattendue est survenue.";
}
async function downloadProtectedFile(url, token, fallbackName) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/octet-stream"
    }
  });
  if (!response.ok) {
    throw new Error("Le telechargement du document a echoue.");
  }
  const blob = await response.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fallbackName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}
export {
  cn,
  downloadProtectedFile,
  extractErrorMessage,
  formatBytes,
  formatDate,
  formatDateTime
};
