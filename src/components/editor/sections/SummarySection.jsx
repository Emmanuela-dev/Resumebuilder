import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { FileText } from 'lucide-react';

export default function SummarySection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [summary, setSummary] = useState(data || '');
  const { updateResume } = useResumeStore();
  const [saveTimer, setSaveTimer] = useState(null);
  
  const handleChange = (e) => {
    const value = e.target.value;
    setSummary(value);
    
    // Clear existing timer
    if (saveTimer) clearTimeout(saveTimer);
    
    // Set new timer for auto-save
    const timer = setTimeout(() => {
      updateResume(resumeId, { summary: value });
    }, 2000);
    
    setSaveTimer(timer);
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <FileText size={18} />
          Professional Summary
        </h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          <div className="form-group">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              value={summary}
              onChange={handleChange}
              placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
              rows={6}
            />
            <small style={{ color: '#718096', fontSize: '0.8rem' }}>
              {summary.length} characters
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
