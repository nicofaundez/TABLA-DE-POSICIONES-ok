import * as XLSX from "xlsx";

export const exportToExcel = (teams) => {
  const exportData = teams.map((team, index) => ({
    "Pos": index + 1,
    "Equipo": team.name,
    "Pts": team.pts,
    "PJ": team.pj,
    "G": team.g,
    "E": team.e,
    "P": team.p,
    "DG": team.dg
  }));
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Posiciones");
  XLSX.writeFile(wb, "Tabla_Posiciones.xlsx");
};