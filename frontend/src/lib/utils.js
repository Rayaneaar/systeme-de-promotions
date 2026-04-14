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
function formatServiceDuration(value, now = new Date()) {
  if (!value) return "0 mois";
  const startDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(startDate.getTime())) return "0 mois";
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  if (endDate.getDate() < startDate.getDate()) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return "0 mois";
  const parts = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "an" : "ans"}`);
  }
  if (months > 0 || years === 0) {
    parts.push(`${months} mois`);
  }
  return parts.join(" ");
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
function formatCountdown(value, now = new Date()) {
  if (!value) return "Date a confirmer";
  const target = new Date(`${value}T00:00:00`);
  if (Number.isNaN(target.getTime())) return "Date a confirmer";
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Disponible maintenant";
  if (diffDays === 1) return "Dans 1 jour";
  if (diffDays < 30) return `Dans ${diffDays} jours`;
  const months = Math.floor(diffDays / 30);
  if (months < 12) {
    return `Dans ${months} mois`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (!remainingMonths) {
    return `Dans ${years} ${years === 1 ? "an" : "ans"}`;
  }
  return `Dans ${years} ${years === 1 ? "an" : "ans"} et ${remainingMonths} mois`;
}
function formatReferenceNumber(value) {
  if (!value) return "Non defini";
  return `Ref. ${value}`;
}
function extractErrorMessage(error) {
  const candidate = error;
  if (candidate.code === "ERR_NETWORK" || !candidate.response) {
    return "Impossible de joindre le serveur API. Verifiez que Laravel est lance et que l'URL API du frontend est correcte.";
  }
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
async function createProtectedObjectUrl(url, token) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "*/*"
    }
  });
  if (!response.ok) {
    throw new Error("Impossible d'ouvrir le document.");
  }
  const blob = await response.blob();
  return window.URL.createObjectURL(blob);
}
async function downloadProtectedFile(url, token, fallbackName) {
  const objectUrl = await createProtectedObjectUrl(url, token);
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
  createProtectedObjectUrl,
  formatCountdown,
  downloadProtectedFile,
  extractErrorMessage,
  formatBytes,
  formatDate,
  formatDateTime,
  formatReferenceNumber,
  formatServiceDuration
};
