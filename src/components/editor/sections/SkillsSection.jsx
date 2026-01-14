import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { Award, Plus, Trash2 } from 'lucide-react';

export default function SkillsSection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [skills, setSkills] = useState(data || []);
  const [newSkill, setNewSkill] = useState('');
  const [category, setCategory] = useState('');
  const { addSectionItem, deleteSectionItem } = useResumeStore();
  
  const handleAdd = async () => {
    if (!newSkill.trim()) return;
    
    try {
      const added = await addSectionItem(resumeId, 'skills', {
        name: newSkill,
        category: category,
        sort_order: skills.length,
      });
      setSkills([...skills, added]);
      setNewSkill('');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteSectionItem(resumeId, 'skills', id);
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3><Award size={18} />Skills</h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          <div className="form-row">
            <div className="form-group">
              <label>Skill</label>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="JavaScript"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Programming"
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleAdd} style={{marginBottom: '1rem'}}>
            <Plus size={16} />Add Skill
          </button>
          
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
            {skills.map((skill) => (
              <div key={skill.id} style={{
                background: '#f0f4ff',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}>
                <span>{skill.name}</span>
                <button 
                  onClick={() => handleDelete(skill.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#e53e3e',
                    padding: 0,
                    display: 'flex'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
