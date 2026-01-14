import { useState } from 'react';
import { useResumeStore } from '../../../store/resumeStore';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PersonalInfoSection({ resumeId, data }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [formData, setFormData] = useState(data || {});
  const { updateSection, updateResume } = useResumeStore();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    
    // If changing experience_type, update the resume directly
    if (name === 'experience_type') {
      updateResume(resumeId, { experience_type: value });
    } else {
      // Auto-save personal info after 2 seconds (exclude experience_type)
      setTimeout(() => {
        const { experience_type, ...personalInfoData } = newData;
        updateSection(resumeId, 'personal_info', { ...personalInfoData, resume_id: resumeId });
      }, 2000);
    }
  };
  
  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          <User size={18} />
          Personal Information
        </h3>
        <span>{isExpanded ? '−' : '+'}</span>
      </div>
      
      {isExpanded && (
        <div className="section-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name || ''}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="New York, NY"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website || ''}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={formData.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="github">GitHub</label>
            <input
              id="github"
              name="github"
              type="url"
              value={formData.github || ''}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="experience_type">Experience Type</label>
            <select
              id="experience_type"
              name="experience_type"
              value={formData.experience_type || 'work'}
              onChange={handleChange}
              className="form-select"
            >
              <option value="work">Work Experience</option>
              <option value="project">Project Experience</option>
            </select>
            <small className="form-hint">Choose how to display your experience section on the resume</small>
          </div>
        </div>
      )}
    </div>
  );
}
