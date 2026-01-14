import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import { Save, Eye, ArrowLeft, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PersonalInfoSection from './sections/PersonalInfoSection';
import SummarySection from './sections/SummarySection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import CertificationsSection from './sections/CertificationsSection';
import LanguagesSection from './sections/LanguagesSection';
import ReferencesSection from './sections/ReferencesSection';
import ResumePreview from '../preview/ResumePreview';
import './ResumeEditor.css';

export default function ResumeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, loading, fetchResume, updateResume, scheduleAutoSave } = useResumeStore();
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  
  useEffect(() => {
    if (id) {
      fetchResume(id);
    }
  }, [id, fetchResume]);
  
  const handleSave = async () => {
    try {
      await updateResume(id, {
        title: currentResume.title,
        summary: currentResume.summary,
      });
      toast.success('Resume saved successfully');
    } catch (error) {
      toast.error('Failed to save resume');
    }
  };
  
  const handleExport = () => {
    navigate(`/resume/${id}/export`);
  };
  
  const handleShare = () => {
    navigate(`/resume/${id}/share`);
  };
  
  if (loading || !currentResume) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading resume...</p>
      </div>
    );
  }
  
  return (
    <div className="resume-editor">
      <header className="editor-header">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{currentResume.title}</h1>
            <span className="last-saved">Last saved: {new Date(currentResume.updated_at).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye size={18} />
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
          <button className="btn btn-outline" onClick={handleShare}>
            <Share2 size={18} />
            Share
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={18} />
            Export
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={18} />
            Save
          </button>
        </div>
      </header>
      
      <div className="editor-container">
        <div className="editor-sidebar">
          <div className="editor-tabs">
            <button
              className={`tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button
              className={`tab ${activeTab === 'design' ? 'active' : ''}`}
              onClick={() => setActiveTab('design')}
            >
              Design
            </button>
          </div>
          
          {activeTab === 'content' ? (
            <div className="editor-sections">
              <PersonalInfoSection resumeId={id} data={currentResume.personalInfo} />
              <SummarySection resumeId={id} data={currentResume.summary} />
              <ExperienceSection resumeId={id} data={currentResume.experience} />
              <EducationSection resumeId={id} data={currentResume.education} />
              <SkillsSection resumeId={id} data={currentResume.skills} />
              <ProjectsSection resumeId={id} data={currentResume.projects} />
              <CertificationsSection resumeId={id} data={currentResume.certifications} />
              <LanguagesSection resumeId={id} data={currentResume.languages} />
              <ReferencesSection resumeId={id} data={currentResume.references} />
            </div>
          ) : (
            <div className="design-options">
              <div className="design-section">
                <h3>Template</h3>
                <div className="template-grid">
                  {['modern', 'classic', 'minimal', 'creative'].map((template) => (
                    <button
                      key={template}
                      className={`template-option ${currentResume.template_id === template ? 'active' : ''}`}
                      onClick={() => updateResume(id, { template_id: template })}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="design-section">
                <h3>Color Theme</h3>
                <div className="color-grid">
                  {['blue', 'green', 'purple', 'red', 'gray'].map((color) => (
                    <button
                      key={color}
                      className={`color-option ${currentResume.color_theme === color ? 'active' : ''}`}
                      style={{ background: getColorValue(color) }}
                      onClick={() => updateResume(id, { color_theme: color })}
                    />
                  ))}
                </div>
              </div>
              
              <div className="design-section">
                <h3>Font</h3>
                <select
                  value={currentResume.font_family || 'inter'}
                  onChange={(e) => updateResume(id, { font_family: e.target.value })}
                  className="font-select"
                >
                  <option value="inter">Inter</option>
                  <option value="roboto">Roboto</option>
                  <option value="openSans">Open Sans</option>
                  <option value="lato">Lato</option>
                  <option value="montserrat">Montserrat</option>
                </select>
              </div>
              
              <div className="design-section">
                <h3>Layout</h3>
                <div className="layout-options">
                  <button
                    className={`layout-option ${currentResume.layout === 'one-column' ? 'active' : ''}`}
                    onClick={() => updateResume(id, { layout: 'one-column' })}
                  >
                    One Column
                  </button>
                  <button
                    className={`layout-option ${currentResume.layout === 'two-column' ? 'active' : ''}`}
                    onClick={() => updateResume(id, { layout: 'two-column' })}
                  >
                    Two Column
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {showPreview && (
          <div className="editor-preview">
            <ResumePreview resume={currentResume} />
          </div>
        )}
      </div>
    </div>
  );
}

function getColorValue(color) {
  const colors = {
    blue: '#667eea',
    green: '#48bb78',
    purple: '#9f7aea',
    red: '#f56565',
    gray: '#4a5568',
  };
  return colors[color] || colors.blue;
}
