import './ResumePreview.css';

export default function ResumePreview({ resume }) {
  if (!resume) return null;
  
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages } = resume;
  
  return (
    <div className="preview-container" id="resume-preview">
      <div className={`resume-template ${resume.template_id} ${resume.layout}`} style={{
        fontFamily: resume.font_family || 'inter',
        '--primary-color': getColorValue(resume.color_theme)
      }}>
        {/* Header */}
        <header className="resume-header">
          <h1>{personalInfo?.full_name || 'Your Name'}</h1>
          <div className="contact-info">
            {personalInfo?.email && <span>{personalInfo.email}</span>}
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="links">
            {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">Website</a>}
            {personalInfo?.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {personalInfo?.github && <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
          </div>
        </header>
        
        {/* Summary */}
        {summary && (
          <section className="resume-section">
            <h2>Professional Summary</h2>
            <p>{summary}</p>
          </section>
        )}
        
        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="resume-section">
            <h2>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="experience-item">
                <div className="item-header-row">
                  <h3>{exp.position}</h3>
                  <span className="date">
                    {exp.start_date && formatDate(exp.start_date)} - {exp.current ? 'Present' : exp.end_date && formatDate(exp.end_date)}
                  </span>
                </div>
                <div className="company-info">
                  <strong>{exp.company}</strong>
                  {exp.location && <span> • {exp.location}</span>}
                </div>
                {exp.description && <p>{exp.description}</p>}
              </div>
            ))}
          </section>
        )}
        
        {/* Education */}
        {education && education.length > 0 && (
          <section className="resume-section">
            <h2>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="education-item">
                <div className="item-header-row">
                  <h3>{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</h3>
                  <span className="date">
                    {edu.start_date && formatDate(edu.start_date)} - {edu.current ? 'Present' : edu.end_date && formatDate(edu.end_date)}
                  </span>
                </div>
                <div className="institution-info">
                  <strong>{edu.institution}</strong>
                  {edu.gpa && <span> • GPA: {edu.gpa}</span>}
                </div>
                {edu.description && <p>{edu.description}</p>}
              </div>
            ))}
          </section>
        )}
        
        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="resume-section">
            <h2>Skills</h2>
            <div className="skills-list">
              {skills.map((skill) => (
                <span key={skill.id} className="skill-tag">{skill.name}</span>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="resume-section">
            <h2>Projects</h2>
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                <h3>{project.name}</h3>
                {project.description && <p>{project.description}</p>}
                {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>}
              </div>
            ))}
          </section>
        )}
        
        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="resume-section">
            <h2>Certifications</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="certification-item">
                <h3>{cert.name}</h3>
                <div>{cert.issuing_organization}</div>
                {cert.issue_date && <span className="date">Issued: {formatDate(cert.issue_date)}</span>}
              </div>
            ))}
          </section>
        )}
        
        {/* Languages */}
        {languages && languages.length > 0 && (
          <section className="resume-section">
            <h2>Languages</h2>
            <div className="languages-list">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <strong>{lang.language}</strong> - {lang.proficiency}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
