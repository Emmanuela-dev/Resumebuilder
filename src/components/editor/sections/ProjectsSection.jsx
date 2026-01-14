import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { Code, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProjectsSection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  
  const handleAdd = async () => {
    const newItem = {
      name: 'Project Name',
      description: '',
      url: '',
      github_url: '',
      technologies: [],
      start_date: null,
      end_date: null,
      sort_order: items.length,
    };
    
    try {
      const added = await addSectionItem(resumeId, 'projects', newItem);
      setItems([...items, added]);
      setEditingId(added.id);
      setEditData(added);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add project');
    }
  };
  
  const handleSave = async () => {
    try {
      const dataToSave = {
        ...editData,
        technologies: typeof editData.technologies === 'string' 
          ? editData.technologies.split(',').map(t => t.trim()).filter(t => t)
          : editData.technologies || []
      };
      
      await updateSectionItem(resumeId, 'projects', editingId, dataToSave);
      setItems(items.map(item => item.id === editingId ? dataToSave : item));
      setEditingId(null);
      toast.success('Project updated');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update project');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await deleteSectionItem(resumeId, 'projects', id);
        setItems(items.filter(item => item.id !== id));
        toast.success('Project deleted');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to delete project');
      }
    }
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3><Code size={18} />Projects</h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          {items.map((item) => (
            <div key={item.id} className="section-item">
              {editingId === item.id ? (
                <>
                  <div className="form-group">
                    <label>Project Name *</label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      placeholder="My Awesome Project"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editData.description || ''}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      rows="3"
                      placeholder="Brief description of the project..."
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Project URL</label>
                      <input
                        type="url"
                        value={editData.url || ''}
                        onChange={(e) => setEditData({...editData, url: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>GitHub URL</label>
                      <input
                        type="url"
                        value={editData.github_url || ''}
                        onChange={(e) => setEditData({...editData, github_url: e.target.value})}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Technologies (comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editData.technologies) ? editData.technologies.join(', ') : editData.technologies || ''}
                      onChange={(e) => setEditData({...editData, technologies: e.target.value})}
                      placeholder="React, Node.js, PostgreSQL"
                    />
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
                      {item.technologies && item.technologies.length > 0 && (
                        <div style={{fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem'}}>
                          {Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}
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
            <Plus size={18} />Add Project
          </button>
        </div>
      )}
    </div>
  );
}
