import React from "react";

export default function StandingsTable({ teams }) {
  return (
    <div className="table-wrapper glass-panel">
      <table>
        <thead>
          <tr>
            <th>POS</th>
            <th>CLUB</th>
            <th>PTS</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>DG</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t, index) => (
            <tr key={t.id}>
              <td>
                <span className="pos-badge">{index + 1}</span>
              </td>
              <td>
                <div className="team-cell">
                  <img src={t.logo} alt={t.name} className="team-logo" onError={(e) => { e.target.style.display="none" }} />
                  {t.name}
                </div>
              </td>
              <td className="pts-col neon-text">{t.pts}</td>
              <td>{t.pj}</td>
              <td>{t.g}</td>
              <td>{t.e}</td>
              <td>{t.p}</td>
              <td>{t.dg > 0 ? "+" + t.dg : t.dg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}