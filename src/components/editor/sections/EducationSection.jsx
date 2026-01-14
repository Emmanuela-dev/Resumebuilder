import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { GraduationCap, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EducationSection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  
  const handleAdd = async () => {
    const newItem = {
      institution: 'University Name',  // Required field, can't be empty
      degree: '',
      field_of_study: '',
      start_date: null,  // Use null instead of empty string for dates
      end_date: null,
      current: false,
      gpa: '',
      description: '',
      sort_order: items.length,
    };
    
    try {
      const added = await addSectionItem(resumeId, 'education', newItem);
      setItems([...items, added]);
      setEditingId(added.id);
      setEditData(added);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add education item');
    }
  };
  
  const handleSave = async () => {
    try {
      await updateSectionItem(resumeId, 'education', editingId, editData);
      setItems(items.map(item => item.id === editingId ? editData : item));
      setEditingId(null);
      toast.success('Education updated');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Delete this education entry?')) {
      try {
        await deleteSectionItem(resumeId, 'education', id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3><GraduationCap size={18} />Education</h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {items.map((item) => (
            <div key={item.id} className="section-item">
              {editingId === item.id ? (
                <>
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={editData.institution || ''}
                      onChange={(e) => setEditData({...editData, institution: e.target.value})}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        type="text"
                        value={editData.degree || ''}
                        onChange={(e) => setEditData({...editData, degree: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Field of Study</label>
                      <input
                        type="text"
                        value={editData.field_of_study || ''}
                        onChange={(e) => setEditData({...editData, field_of_study: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        value={editData.start_date || ''}
                        onChange={(e) => setEditData({...editData, start_date: e.target.value || null})}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        value={editData.end_date || ''}
                        onChange={(e) => setEditData({...editData, end_date: e.target.value || null})}
                        disabled={editData.current}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={handleSave}><Save size={16} />Save</button>
                    <button className="btn btn-outline" onClick={() => setEditingId(null)}><X size={16} />Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="item-header">
                    <div>
                      <div className="item-title">{item.degree || 'Degree'}</div>
                      <div style={{fontSize: '0.85rem', color: '#718096'}}>{item.institution}</div>
                    </div>
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => {setEditingId(item.id); setEditData(item);}}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          
          <button className="btn-add" onClick={handleAdd}>
            <Plus size={18} />Add Education
          </button>
        </div>
      )}
    </div>
  );
}
