import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';

export default function UpcomingMatches({ matches, teams }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="upcoming-matches-container glass-panel">
      <h2 className="neon-text" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>PRÓXIMA FECHA</h2>
      <div className="matches-grid">
        {matches.map(match => {
          const localTeam = teams.find(t => t.id === match.local_id);
          const visitorTeam = teams.find(t => t.id === match.visitor_id);
          
          if (!localTeam || !visitorTeam) return null;

          const dateObj = new Date(match.date + 'T' + match.time);
          const formattedDate = dateObj.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' });
          const formattedTime = match.time ? match.time.substring(0, 5) : '';

          return (
            <div key={match.id} className="match-card">
              <div className="match-teams">
                <div className="team-info local">
                  <img src={localTeam.logo} alt={localTeam.name} className="team-logo-large" onError={(e) => { e.target.style.display='none' }} />
                  <span className="team-name">{localTeam.name}</span>
                </div>
                
                <div className="match-vs">VS</div>
                
                <div className="team-info visitor">
                  <img src={visitorTeam.logo} alt={visitorTeam.name} className="team-logo-large" onError={(e) => { e.target.style.display='none' }} />
                  <span className="team-name">{visitorTeam.name}</span>
                </div>
              </div>
              
              <div className="match-details">
                <div className="detail-item"><Calendar size={14} /> <span style={{textTransform: 'capitalize'}}>{formattedDate}</span></div>
                <div className="detail-item"><Clock size={14} /> {formattedTime} hrs</div>
                {match.stadium && <div className="detail-item stadium-item"><MapPin size={14} /> {match.stadium}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}