import React, { useState } from "react";

export default function MatchInputPanel({ teams, onRegisterMatch }) {
  const [localId, setLocalId] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [localGoals, setLocalGoals] = useState(0);
  const [visitorGoals, setVisitorGoals] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localId || !visitorId) return alert("Selecciona ambos equipos");
    if (localId === visitorId) return alert("Un equipo no puede jugar contra sí mismo");
    onRegisterMatch(parseInt(localId), parseInt(localGoals), parseInt(visitorId), parseInt(visitorGoals));
    setLocalId(""); setVisitorId(""); setLocalGoals(0); setVisitorGoals(0);
  };

  return (
    <div className="match-panel glass-panel">
      <h2>Registrar Nuevo Partido</h2>
      <form className="match-form" onSubmit={handleSubmit}>
        <div className="team-select-group">
          <select value={localId} onChange={(e) => setLocalId(e.target.value)} required>
            <option value="">Equipo Local...</option>
            {[...teams].sort((a,b)=>a.name.localeCompare(b.name)).map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
          </select>
          <input type="number" min="0" className="score-input" value={localGoals} onChange={(e) => setLocalGoals(e.target.value)} required />
        </div>
        <div className="vs-badge">VS</div>
        <div className="team-select-group">
          <input type="number" min="0" className="score-input" value={visitorGoals} onChange={(e) => setVisitorGoals(e.target.value)} required />
          <select value={visitorId} onChange={(e) => setVisitorId(e.target.value)} required>
            <option value="">Equipo Visitante...</option>
            {[...teams].sort((a,b)=>a.name.localeCompare(b.name)).map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
          </select>
        </div>
        <button type="submit" className="submit-btn">Guardar Resultado</button>
      </form>
    </div>
  );
}