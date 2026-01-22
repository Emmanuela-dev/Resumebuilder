import { Bot, Palette } from 'lucide-react';
import './ATSModeToggle.css';

export default function ATSModeToggle({ atsMode, onToggle, disabled = false }) {
  return (
    <div className="ats-mode-toggle-container">
      <div className={`ats-mode-toggle ${atsMode ? 'ats' : 'design'} ${disabled ? 'disabled' : ''}`}>
        <button
          className={`toggle-option ${!atsMode ? 'active' : ''}`}
          onClick={() => !disabled && onToggle(false)}
          disabled={disabled}
          title="Design Mode - Full creative control"
        >
          <Palette size={18} />
          <span>Design Mode</span>
        </button>
        
        <button
          className={`toggle-option ${atsMode ? 'active' : ''}`}
          onClick={() => !disabled && onToggle(true)}
          disabled={disabled}
          title="ATS Mode - Optimized for Applicant Tracking Systems"
        >
          <Bot size={18} />
          <span>ATS Mode</span>
        </button>
      </div>
      
      {atsMode && !disabled && (
        <div className="ats-mode-info">
          <Bot size={16} />
          <span>ATS Mode Active - Optimized for job applications</span>
        </div>
      )}
    </div>
  );
}
