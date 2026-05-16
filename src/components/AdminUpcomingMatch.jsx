import React, { useState } from 'react';
import { CalendarPlus, Trash2 } from 'lucide-react';

export default function AdminUpcomingMatch({ teams, upcomingMatches, onAddMatch, onDeleteMatch }) {
  const [localId, setLocalId] = useState('');
  const [visitorId, setVisitorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [stadium, setStadium] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localId === visitorId) {
      alert("Un equipo no puede jugar contra sí mismo.");
      return;
    }
    onAddMatch({
      local_id: localId,
      visitor_id: visitorId,
      date,
      time,
      stadium
    });
    // Reset form
    setLocalId('');
    setVisitorId('');
    setDate('');
    setTime('');
    setStadium('');
  };

  return (
    <div className="admin-panel glass-panel" style={{ marginTop: "2rem" }}>
      <h3 className="neon-text" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <CalendarPlus size={24} /> Programar Partido (Próxima Fecha)
      </h3>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Equipo Local</label>
          <select value={localId} onChange={(e) => setLocalId(e.target.value)} required>
            <option value="">Selecciona equipo</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        
        <div className="form-group" style={{display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
          <span style={{fontWeight: "bold", paddingBottom: "10px"}}>VS</span>
        </div>

        <div className="form-group">
          <label>Equipo Visitante</label>
          <select value={visitorId} onChange={(e) => setVisitorId(e.target.value)} required>
            <option value="">Selecciona equpo</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Hora</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Estadio (Opcional)</label>
          <input type="text" placeholder="Ej)`Estadio Nacional" value={stadium} onChange={(e) => setStadium(e.target.value)} />
        </div>

        <button type="submit" className="submit-btn" style={{ gridColumn: "1 / -1" }}>Agregar Partido</button>
      </form>

      {upcomingMatches && upcomingMatches.length > 0 && (
        <div className="manage-matches" style={{ marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
          <h4 style={{ color: "var(--neon-green)", marginBottom: "1rem" }}>Partidos Programados</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {upcomingMatches.map(match => {
              const local = teams.find(t => t.id === match.local_id);
              const visitor = teams.find(t => t.id === match.visitor_id);
              if (!local || !visitor) return null;
              return (
                <li key={match.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.3)", padding: "0.5rem 1rem", borderRadius: "5px", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{fontWeight: "bold"}}>{local.name} vs {visitor.name}</span>
                    <span style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>
                      {match.date} {match.time ? match.time.substring(0, 5) : ''} {match.stadium ? ` - REPLACE1`.replace('REPLACE1', match.stadium) : ''}
                    </span>
                  </div>
                  <button onClick={() => onDeleteMatch(match.id)} style={{ background: "transparent", border: "none", color: "#ff4444", cursor: "pointer", padding: "5px" }} title="Eliminar partido">
                    <Trash2 size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
