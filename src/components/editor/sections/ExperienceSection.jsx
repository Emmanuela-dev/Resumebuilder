import { useState, useEffect } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { Briefcase, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExperienceSection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [experiences, setExperiences] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  
  
  const handleAdd = async () => {
    const newExperience = {
      company: 'Company Name',
      position: 'Position',
      location: '',
      start_date: null,
      end_date: null,
      current: false,
      description: '',
      achievements: [],
      sort_order: experiences.length,
    };
    
    try {
      const added = await addSectionItem(resumeId, 'experience', newExperience);
      setExperiences([...experiences, added]);
      setEditingId(added.id);
      setEditData(added);
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Failed to add experience');
    }
  };
  
  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setEditData({ ...exp });
  };
  
  const handleSave = async () => {
    try {
      await updateSectionItem(resumeId, 'experience', editingId, editData);
      setExperiences(experiences.map(exp => exp.id === editingId ? editData : exp));
      setEditingId(null);
      toast.success('Experience updated');
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };
  
  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteSectionItem(resumeId, 'experience', id);
        setExperiences(experiences.filter(exp => exp.id !== id));
        toast.success('Experience deleted');
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };
  
  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <Briefcase size={18} />
          Work Experience
        </h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {experiences.map((exp) => (
            <div key={exp.id} className="section-item">
              {editingId === exp.id ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        value={editData.position || ''}
                        onChange={(e) => handleChange('position', e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        value={editData.company || ''}
                        onChange={(e) => handleChange('company', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={editData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={editData.start_date || ''}
                        onChange={(e) => handleChange('start_date', e.target.value || null)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={editData.end_date || ''}
                        onChange={(e) => handleChange('end_date', e.target.value || null)}
                        disabled={editData.current}
                      />
                    </div>
                  </div>
                  
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={editData.current || false}
                      onChange={(e) => handleChange('current', e.target.checked)}
                    />
                    <label htmlFor={`current-${exp.id}`}>I currently work here</label>
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Describe your role and responsibilities..."
                      rows={4}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button className="btn btn-primary" onClick={handleSave}>
                      <Save size={16} />
                      Save
                    </button>
                    <button className="btn btn-outline" onClick={handleCancel}>
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="item-header">
                    <div>
                      <div className="item-title">{exp.position || 'Untitled Position'}</div>
                      <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
                        {exp.start_date && new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.current ? 'Present' : exp.end_date && new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => handleEdit(exp)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(exp.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p style={{ fontSize: '0.85rem', color: '#4a5568', marginTop: '0.5rem' }}>
                      {exp.description}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
          
          <button className="btn-add" onClick={handleAdd}>
            <Plus size={18} />
            Add Experience
          </button>
        </div>
      )}
    </div>
  );
}
