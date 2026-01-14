import { useState, useEffect } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { Globe, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LanguagesSection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  
  // Sync local state with prop changes
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);
  
  const proficiencyLevels = [
    'Native',
    'Fluent',
    'Advanced',
    'Intermediate',
    'Basic'
  ];
  
  const handleAdd = async () => {
    const newItem = {
      language: 'Language',
      proficiency: 'Intermediate',
      sort_order: items.length,
    };
    
    try {
      const added = await addSectionItem(resumeId, 'languages', newItem);
      setItems([...items, added]);
      setEditingId(added.id);
      setEditData(added);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add language');
    }
  };
  
  const handleSave = async () => {
    try {
      await updateSectionItem(resumeId, 'languages', editingId, editData);
      setItems(items.map(item => item.id === editingId ? editData : item));
      setEditingId(null);
      toast.success('Language updated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update language');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Delete this language?')) {
      try {
        await deleteSectionItem(resumeId, 'languages', id);
        setItems(items.filter(item => item.id !== id));
        toast.success('Language deleted');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete language');
      }
    }
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3><Globe size={18} />Languages</h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {items.map((item) => (
            <div key={item.id} className="section-item">
              {editingId === item.id ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Language *</label>
                      <input
                        type="text"
                        value={editData.language || ''}
                        onChange={(e) => setEditData({...editData, language: e.target.value})}
                        placeholder="English"
                      />
                    </div>
                    <div className="form-group">
                      <label>Proficiency</label>
                      <select
                        value={editData.proficiency || ''}
                        onChange={(e) => setEditData({...editData, proficiency: e.target.value})}
                      >
                        <option value="">Select level</option>
                        {proficiencyLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
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
                      <div className="item-title">{item.language}</div>
                      {item.proficiency && (
                        <div style={{fontSize: '0.85rem', color: '#718096'}}>{item.proficiency}</div>
                      )}
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
            <Plus size={18} />Add Language
          </button>
        </div>
      )}
    </div>
  );
}
