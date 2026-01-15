import { useState } from 'react';
import { Check, FileText } from 'lucide-react';
import './TemplateSelector.css';

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech and creative roles',
    preview: 'modern',
    popular: true
  },
  {
    id: 'classic',
    name: 'Classic Traditional',
    description: 'Timeless and professional layout for corporate positions',
    preview: 'classic',
    popular: false
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple and elegant design that highlights your content',
    preview: 'minimal',
    popular: true
  },
  {
    id: 'creative',
    name: 'Creative Bold',
    description: 'Stand out with a unique design for creative industries',
    preview: 'creative',
    popular: false
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior-level positions',
    preview: 'executive',
    popular: false
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for engineering and technical roles',
    preview: 'technical',
    popular: true
  }
];

export default function TemplateSelector({ selectedTemplate, onSelectTemplate, onContinue }) {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  return (
    <div className="template-selector">
      <div className="selector-header">
        <h2>Choose Your Resume Template</h2>
        <p>Select a professional template that matches your style and industry</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''} ${
              hoveredTemplate === template.id ? 'hovered' : ''
            }`}
            onClick={() => onSelectTemplate(template.id)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            {template.popular && (
              <div className="popular-badge">Popular</div>
            )}
            
            <div className="template-preview">
              <TemplatePreview templateId={template.preview} />
            </div>

            <div className="template-info">
              <div className="template-header">
                <h3>{template.name}</h3>
                {selectedTemplate === template.id && (
                  <div className="check-icon">
                    <Check size={18} />
                  </div>
                )}
              </div>
              <p>{template.description}</p>
            </div>

            <button
              className={`select-btn ${selectedTemplate === template.id ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTemplate(template.id);
              }}
            >
              {selectedTemplate === template.id ? 'Selected' : 'Select Template'}
            </button>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="selector-footer">
          <button className="btn-continue" onClick={onContinue}>
            Next: Choose Template
          </button>
        </div>
      )}
    </div>
  );
}

function TemplatePreview({ templateId }) {
  return (
    <div className={`template-preview-content ${templateId}`}>
      <div className="preview-header">
        <div className="preview-name"></div>
        <div className="preview-title"></div>
      </div>
      <div className="preview-body">
        <div className="preview-section">
          <div className="preview-section-title"></div>
          <div className="preview-line"></div>
          <div className="preview-line short"></div>
        </div>
        <div className="preview-section">
          <div className="preview-section-title"></div>
          <div className="preview-line"></div>
          <div className="preview-line"></div>
          <div className="preview-line short"></div>
        </div>
        <div className="preview-section">
          <div className="preview-section-title"></div>
          <div className="preview-line"></div>
          <div className="preview-line short"></div>
        </div>
      </div>
    </div>
  );
}
