import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useResumeStore } from '../../store/resumeStore';
import { FileText, Plus, Edit, Trash2, Copy, Eye, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import TemplateSelector from '../templates/TemplateSelector';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const { resumes, loading, fetchResumes, createResume, deleteResume, duplicateResume } = useResumeStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);
  
  const handleCreateResume = async (e) => {
    e.preventDefault();
    
    if (!newResumeTitle.trim()) {
      toast.error('Please enter a resume title');
      return;
    setShowCreateModal(false);
    setShowTemplateSelector(true);
  };

  const handleTemplateSelected = async () => {
    try {
      const resume = await createResume(newResumeTitle, selectedTemplate);
      setShowTemplateSelector(false);
      setNewResumeTitle('');
      setSelectedTemplate('modern');
      navigate(`/resume/${resume.id}/edit`);
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
    }
  };

  const handleCancelTemplateSelection = () => {
    setShowTemplateSelector(false);
    setShowCreateModal(true); catch (error) {
      console.error('Error creating resume:', error);
    }
  };
  
  const handleDeleteResume = async (resumeId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteResume(resumeId);
    }
  };
  
  const handleDuplicate = async (resumeId) => {
    try {
      const newResume = await duplicateResume(resumeId);
      navigate(`/resume/${newResume.id}/edit`);
    } catch (error) {
      console.error('Error duplicating resume:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Resume Builder</h1>
          <div className="header-actions">
            <span className="user-info">
              {profile?.full_name || user?.email}
            </span>
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-header-section">
            <div>
              <h2>My Resumes</h2>
              <p className="text-muted">Create and manage your professional resumes</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              New Resume
            </button>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="empty-state">
              <FileText size={64} />
              <h3>No resumes yet</h3>
              <p>Create your first resume to get started</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={20} />
                Create Resume
              </button>
            </div>
          ) : (
            <div className="resumes-grid">
              {resumes.map((resume) => (
                <div key={resume.id} className="resume-card">
                  <div className="resume-card-header">
                    <div className="resume-icon">
                      <FileText size={24} />
                    </div>
                    <div className="resume-status">
                      <span className={`status-badge ${resume.status}`}>
                        {resume.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="resume-card-body">
                    <h3>{resume.title}</h3>
                    <p className="resume-summary">
                      {resume.summary || 'No summary added yet'}
                    </p>
                    <div className="resume-meta">
                      <span>Updated {new Date(resume.updated_at).toLocaleDateString()}</span>
                      <span>Template: {resume.template_id}</span>
                    </div>
                  </div>
                  
                  <div className="resume-card-actions">
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/resume/${resume.id}/edit`)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/resume/${resume.id}/preview`)}
                      title="Preview"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDuplicate(resume.id)}
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/resume/${resume.id}/analytics`)}
                      title="Analytics"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      className="btn-icon btn-danger"
                      onClick={() => handleDeleteResume(resume.id, resume.title)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Resume</h2>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateResume}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="resumeTitle">Resume Title</label>
                  <input
                    id="resumeTitle"
                    type="text"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    placeholder="e.g., Software Engineer Resume"
                    autoFocus
                  />
                </Next: Choose Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTemplateSelector && (
        <div className="modal-overlay full-screen" onClick={handleCancelTemplateSelection}>
          <div className="modal template-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Choose a Template</h2>
              <button 
                className="modal-close"
                onClick={handleCancelTemplateSelection}
              >
                ×
              </button>
            </div>
            <div className="modal-body no-padding">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                onContinue={handleTemplateSelected}
              />
            </div className="modal-footer">
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Resume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
