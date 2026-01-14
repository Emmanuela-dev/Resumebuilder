import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { Award, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CertificationsSection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  
  const handleAdd = async () => {
    const newItem = {
      name: 'Certification Name',
      issuing_organization: '',
      issue_date: null,
      expiry_date: null,
      credential_id: '',
      credential_url: '',
      sort_order: items.length,
    };
    
    try {
      const added = await addSectionItem(resumeId, 'certifications', newItem);
      setItems([...items, added]);
      setEditingId(added.id);
      setEditData(added);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add certification');
    }
  };
  
  const handleSave = async () => {
    try {
      await updateSectionItem(resumeId, 'certifications', editingId, editData);
      setItems(items.map(item => item.id === editingId ? editData : item));
      setEditingId(null);
      toast.success('Certification updated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update certification');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Delete this certification?')) {
      try {
        await deleteSectionItem(resumeId, 'certifications', id);
        setItems(items.filter(item => item.id !== id));
        toast.success('Certification deleted');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete certification');
      }
    }
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3><Award size={18} />Certifications</h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {items.map((item) => (
            <div key={item.id} className="section-item">
              {editingId === item.id ? (
                <>
                  <div className="form-group">
                    <label>Certification Name *</label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="form-group">
                    <label>Issuing Organization</label>
                    <input
                      type="text"
                      value={editData.issuing_organization || ''}
                      onChange={(e) => setEditData({...editData, issuing_organization: e.target.value})}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Issue Date</label>
                      <input
                        type="date"
                        value={editData.issue_date || ''}
                        onChange={(e) => setEditData({...editData, issue_date: e.target.value || null})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="date"
                        value={editData.expiry_date || ''}
                        onChange={(e) => setEditData({...editData, expiry_date: e.target.value || null})}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Credential ID</label>
                      <input
                        type="text"
                        value={editData.credential_id || ''}
                        onChange={(e) => setEditData({...editData, credential_id: e.target.value})}
                        placeholder="ABC123XYZ"
                      />
                    </div>
                    <div className="form-group">
                      <label>Credential URL</label>
                      <input
                        type="url"
                        value={editData.credential_url || ''}
                        onChange={(e) => setEditData({...editData, credential_url: e.target.value})}
                        placeholder="https://..."
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
                      <div className="item-title">{item.name}</div>
                      {item.issuing_organization && (
                        <div style={{fontSize: '0.85rem', color: '#718096'}}>{item.issuing_organization}</div>
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
            <Plus size={18} />Add Certification
          </button>
        </div>
      )}
    </div>
  );
}
