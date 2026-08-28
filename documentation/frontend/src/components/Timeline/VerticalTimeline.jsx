import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';

export const VerticalTimeline = ({ stages = [], onAdvanceStage = null }) => {
  if (!stages || stages.length === 0) return null;

  return (
    <div className="timeline-container">
      {stages.map((stage, idx) => {
        const isCompleted = stage.state === 'completed' || stage.isCompleted;
        const isCurrent = stage.state === 'current' || stage.isCurrent;
        const isUpcoming = stage.state === 'upcoming' || stage.isUpcoming;

        let statusClass = 'upcoming';
        if (isCompleted) statusClass = 'completed';
        else if (isCurrent) statusClass = 'current';

        return (
          <div key={stage.key || idx} className={`timeline-item ${statusClass}`}>
            <div className="timeline-marker">
              {isCompleted && <Check size={16} strokeWidth={3} />}
              {isCurrent && <Clock size={16} strokeWidth={2.5} />}
              {isUpcoming && <Circle size={10} fill="#CBD5E1" strokeWidth={0} />}
            </div>

            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-title">{stage.title}</span>
                {stage.date && <span className="timeline-date">{stage.date}</span>}
              </div>
              <p className="timeline-desc">{stage.description}</p>

              {isCurrent && onAdvanceStage && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--warning)', fontWeight: 600 }}>
                    ⚡ Active Processing Stage
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VerticalTimeline;
