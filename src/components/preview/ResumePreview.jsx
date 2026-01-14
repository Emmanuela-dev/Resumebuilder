import './ResumePreview.css';

export default function ResumePreview({ resume }) {
  if (!resume) return null;
  
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, references } = resume;
  
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
        
        {/* 1. PROFESSIONAL SUMMARY */}
        {summary && (
          <section className="resume-section">
            <h2>PROFESSIONAL SUMMARY</h2>
            <p>{summary}</p>
          </section>
        )}
        
        {/* 2. CORE COMPETENCIES */}
        {skills && skills.length > 0 && (
          <section className="resume-section">
            <h2>CORE COMPETENCIES</h2>
            <div className="competencies-list">
              {skills.slice(0, 6).map((skill) => (
                <span key={skill.id} className="competency-tag">• {skill.name}</span>
              ))}
            </div>
          </section>
        )}
        
        {/* 3. PROJECT EXPERIENCE / WORK EXPERIENCE */}
        {(projects && projects.length > 0) || (experience && experience.length > 0) ? (
          <section className="resume-section">
            <h2>{resume.experience_type === 'project' ? 'PROJECT EXPERIENCE' : 'WORK EXPERIENCE'}</h2>
            
            {/* Show experience first if available */}
            {experience && experience.length > 0 && experience.map((exp) => (
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
            
            {/* Then show projects */}
            {projects && projects.length > 0 && projects.map((project) => (
              <div key={project.id} className="project-item">
                <h3>{project.name}</h3>
                {project.description && <p>{project.description}</p>}
                {project.technologies && <div className="tech-stack"><strong>Technologies:</strong> {project.technologies}</div>}
                {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>}
              </div>
            ))}
          </section>
        ) : null}
        
        {/* 4. EDUCATION */}
        {education && education.length > 0 && (
          <section className="resume-section">
            <h2>EDUCATION</h2>
            {education.map((edu) => (
              <div key={edu.id} className="education-item">
                <div className="item-header-row">
                  <h3>{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</h3>
                  <span className="date">
                    {edu.graduation_date && formatDate(edu.graduation_date)}
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
        
        {/* 5. TECHNICAL SKILLS */}
        {skills && skills.filter(s => s.category !== 'Soft Skills').length > 0 && (
          <section className="resume-section">
            <h2>TECHNICAL SKILLS</h2>
            <div className="skills-grid">
              {(() => {
                const technicalSkills = skills.filter(s => s.category !== 'Soft Skills');
                const groupedSkills = technicalSkills.reduce((acc, skill) => {
                  const category = skill.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill.name);
                  return acc;
                }, {});
                
                return Object.entries(groupedSkills).map(([category, skillNames]) => (
                  <div key={category} className="skill-category">
                    <strong>{category}:</strong> {skillNames.join(', ')}
                  </div>
                ));
              })()}
            </div>
          </section>
        )}
        
        {/* 6. SOFT SKILLS */}
        {skills && skills.filter(s => s.category === 'Soft Skills').length > 0 && (
          <section className="resume-section">
            <h2>SOFT SKILLS</h2>
            <div className="soft-skills-list">
              {skills.filter(s => s.category === 'Soft Skills').map((skill) => (
                <span key={skill.id} className="soft-skill-tag">• {skill.name}</span>
              ))}
            </div>
          </section>
        )}
        
        {/* 7. ACHIEVEMENTS & CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <section className="resume-section">
            <h2>ACHIEVEMENTS & CERTIFICATIONS</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="certification-item">
                <h3>{cert.name}</h3>
                <div>{cert.issuing_organization}</div>
                {cert.issue_date && <span className="date">Issued: {formatDate(cert.issue_date)}</span>}
              </div>
            ))}
          </section>
        )}
        
        {/* 8. REFEREES */}
        {references && references.length > 0 && (
          <section className="resume-section">
            <h2>REFEREES</h2>
            {references.map((ref) => (
              <div key={ref.id} className="reference-item">
                <h3>{ref.name}</h3>
                <div className="reference-details">
                  {ref.position && <div><strong>{ref.position}</strong></div>}
                  {ref.company && <div>{ref.company}</div>}
                  {ref.email && <div>Email: {ref.email}</div>}
                  {ref.phone && <div>Phone: {ref.phone}</div>}
                </div>
              </div>
            ))}
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
