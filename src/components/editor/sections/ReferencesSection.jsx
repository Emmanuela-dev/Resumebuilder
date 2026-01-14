import { useState, useEffect } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { Users, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReferencesSection({ resumeId, data }) {
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
  
  const handleAdd = async () => {
    const newItem = {
      name: 'Reference Name',
      position: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
      sort_order: items.length,
    };
    
    try {
      const added = await addSectionItem(resumeId, 'references', newItem);
      setItems([...items, added]);
      setEditingId(added.id);
      setEditData(added);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add reference');
    }
  };
  
  const handleSave = async () => {
    try {
      await updateSectionItem(resumeId, 'references', editingId, editData);
      setItems(items.map(item => item.id === editingId ? editData : item));
      setEditingId(null);
      toast.success('Reference updated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update reference');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Delete this reference?')) {
      try {
        await deleteSectionItem(resumeId, 'references', id);
        setItems(items.filter(item => item.id !== id));
        toast.success('Reference deleted');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete reference');
      }
    }
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3><Users size={18} />References</h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {items.map((item) => (
            <div key={item.id} className="section-item">
              {editingId === item.id ? (
                <>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        value={editData.position || ''}
                        onChange={(e) => setEditData({...editData, position: e.target.value})}
                        placeholder="Senior Manager"
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        value={editData.company || ''}
                        onChange={(e) => setEditData({...editData, company: e.target.value})}
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <input
                      type="text"
                      value={editData.relationship || ''}
                      onChange={(e) => setEditData({...editData, relationship: e.target.value})}
                      placeholder="Former Manager"
                    />
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
                      <div className="item-title">{item.name}</div>
                      {(item.position || item.company) && (
                        <div style={{fontSize: '0.85rem', color: '#718096'}}>
                          {[item.position, item.company].filter(Boolean).join(' at ')}
                        </div>
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
            <Plus size={18} />Add Reference
          </button>
        </div>
      )}
    </div>
  );
}
