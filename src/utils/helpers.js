import { LEAGUES } from "../data/config";

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }) +
    " " +
    d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
  );
}

export function getLeagueName(code) {
  return LEAGUES.find((l) => l.id === code)?.name || code;
}
