import { useState, useEffect } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { useAuthStore } from '../../../store/authStore';
import { Award, Plus, Edit2, Trash2, Save, X, Upload, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile, deleteFile, isCertificateFile } from '../../../lib/storage';

export default function CertificationsSection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState(data || []);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);
  const { addSectionItem, updateSectionItem, deleteSectionItem } = useResumeStore();
  const { user } = useAuthStore();
  
  // Sync local state with prop changes
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);
  
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
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const userFolder = user?.id || 'anonymous';
      const publicUrl = await uploadFile(file, 'certificate', userFolder);
      
      // Update the credential_url with the uploaded file URL
      setEditData({ ...editData, credential_url: publicUrl });
      toast.success('Certificate uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload certificate');
    } finally {
      setUploading(false);
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
                  
                  <div className="form-group">
                    <label>Certificate File/Image</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ flex: 1 }}
                      />
                      {uploading && <span style={{ fontSize: '0.85rem', color: '#3182ce' }}>Uploading...</span>}
                      {editData.credential_url && !uploading && (
                        <a 
                          href={editData.credential_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-icon"
                          title="View certificate"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    {editData.credential_url && isCertificateFile(editData.credential_url) && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f7fafc', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {editData.credential_url.endsWith('.pdf') ? (
                          <FileText size={16} color="#718096" />
                        ) : (
                          <ImageIcon size={16} color="#718096" />
                        )}
                        <span style={{ fontSize: '0.85rem', color: '#2d3748', flex: 1 }}>
                          Certificate uploaded
                        </span>
                        <button
                          type="button"
                          className="btn-icon btn-danger"
                          onClick={() => setEditData({ ...editData, credential_url: '' })}
                          title="Remove file"
                          style={{ padding: '0.25rem' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <small style={{ color: '#718096', fontSize: '0.85rem' }}>
                      Upload PDF or image (max 5MB) or paste URL above
                    </small>
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
                      {item.credential_url && isCertificateFile(item.credential_url) && (
                        <div style={{fontSize: '0.85rem', color: '#3182ce', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                          {item.credential_url.endsWith('.pdf') ? <FileText size={14} /> : <ImageIcon size={14} />}
                          <a href={item.credential_url} target="_blank" rel="noopener noreferrer">
                            View Certificate
                          </a>
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
            <Plus size={18} />Add Certification
          </button>
        </div>
      )}
    </div>
  );
}
