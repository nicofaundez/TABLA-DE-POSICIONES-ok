import React, { useState, useEffect } from "react";
import { Download, Undo2, Lock, Unlock } from "lucide-react";
import StandingsTable from "./components/StandingsTable";
import MatchInputPanel from "./components/MatchInputPanel";
import { exportToExcel } from "./utils/excelExport";
import { supabase } from "./supabaseClient";
import "./App.css";

const ADMIN_PIN = "1234";

function App() {
  const [teams, setTeams] = useState([]);
  const [history, setHistory] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
    const subscription = supabase
      .channel("schema-db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, () => fetchTeams())
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("teams").select("*");
    if (!error && data && data.length > 0) {
      setTeams(data.sort((a, b) => b.pts !== a.pts ? b.pts - a.pts : b.dg - a.dg));
    }
    setLoading(false);
  };

  const handleAdminLogin = () => {
    if (isAdmin) { setIsAdmin(false); } 
    else { const pin = prompt("Ingresa el PIN:"); if (pin === ADMIN_PIN) setIsAdmin(true); else if (pin) alert("PIN Incorrecto"); }
  };

  const handleRegisterMatch = async (localId, localGoals, visitorId, visitorGoals) => {
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(teams))]);
    let newTeams = teams.map(t => ({ ...t }));
    const local = newTeams.find(t => t.id === localId);
    const visitor = newTeams.find(t => t.id === visitorId);
    local.pj += 1; visitor.pj += 1;
    local.dg += (localGoals - visitorGoals); visitor.dg += (visitorGoals - localGoals);
    if (localGoals > visitorGoals) { local.pts += 3; local.g += 1; visitor.p += 1; }
    else if (visitorGoals > localGoals) { visitor.pts += 3; visitor.g += 1; local.p += 1; }
    else { local.pts += 1; visitor.pts += 1; local.e += 1; visitor.e += 1; }
    await supabase.from("teams").update(local).eq("id", local.id);
    await supabase.from("teams").update(visitor).eq("id", visitor.id);
  };

  const handleUndo = async () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const previousState = newHistory.pop();
    for (let team of previousState) { await supabase.from("teams").update(team).eq("id", team.id); }
    setHistory(newHistory);
  };

  return (
    <div className="app-container">
      <header style={{ position: "relative" }}>
        <button onClick={handleAdminLogin} style={{ position: "absolute", right: 0, top: 0, background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
          {isAdmin ? <Unlock size={24} color="var(--neon-green)" /> : <Lock size={24} />}
        </button>
        <h1 className="neon-text">TABLA DE POSICIONES</h1>
        <p style={{color: "var(--text-muted)", fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "2px"}}>Liga de Ascenso 2026</p>
      </header>
      <main>
        {loading && teams.length === 0 ? <div style={{ textAlign: "center", padding: "2rem" }}>Conectando a la base de datos...</div> : <StandingsTable teams={teams} />}
        <div style={{ display: "flex", justifyItems: "center", justifyContent: "flex-end", marginTop: "1rem", gap: "1rem", flexWrap: "wrap" }}>
          {isAdmin && history.length > 0 && <button className="export-btn" style={{backgroundColor: "#ff4444", color: "white", boxShadow: "0 0 15px rgba(255, 68, 68, 0.3)"}} onClick={handleUndo}><Undo2 size={20} /> Deshacer</button>}
          <button className="export-btn" onClick={() => exportToExcel(teams)}><Download size={20} /> Exportar</button>
        </div>
        {isAdmin && <MatchInputPanel teams={teams} onRegisterMatch={handleRegisterMatch} />}
      </main>
    </div>
  );
}

export default App;