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
          {personalInfo?.title && <div className="job-title">{personalInfo.title}</div>}
          <div className="header-location">
            {personalInfo?.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="contact-info">
            {personalInfo?.phone && <span>{personalInfo.phone}</span>}
            {personalInfo?.email && <span>{personalInfo.email}</span>}
          </div>
          <div className="links">
            {personalInfo?.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
            {personalInfo?.website && <span>Website: {personalInfo.website}</span>}
            {personalInfo?.github && <span>GitHub: {personalInfo.github}</span>}
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
            <div className="competencies-grid">
              {skills.slice(0, 12).map((skill) => (
                <div key={skill.id} className="competency-item">• {skill.name}</div>
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
                    ({exp.start_date && formatDate(exp.start_date)} - {exp.current ? 'Present' : exp.end_date && formatDate(exp.end_date)})
                  </span>
                </div>
                <div className="achievements-header">Key Achievements & Contributions</div>
                {exp.description && <p className="achievement-item">• {exp.description}</p>}
                {exp.achievements && Array.isArray(exp.achievements) && exp.achievements.map((achievement, idx) => (
                  <p key={idx} className="achievement-item">• {achievement}</p>
                ))}
              </div>
            ))}
            
            {/* Then show projects */}
            {projects && projects.length > 0 && projects.map((project) => (
              <div key={project.id} className="project-item">
                <div className="item-header-row">
                  <h3>{project.name}</h3>
                  {project.start_date && (
                    <span className="date">
                      ({formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'Present'})
                    </span>
                  )}
                </div>
                <div className="achievements-header">Key Achievements & Contributions</div>
                {project.description && <p className="achievement-item">• {project.description}</p>}
                {project.technologies && <p className="achievement-item">• Technologies: {project.technologies}</p>}
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
                <h3>{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</h3>
                <div className="institution-info">
                  <strong>{edu.institution}</strong>
                  {edu.location && <span> – {edu.location}</span>}
                </div>
                <div className="education-date">
                  {edu.start_date && formatYear(edu.start_date)} – {edu.current ? 'Present' : edu.graduation_date ? formatYear(edu.graduation_date) : 'Present'}
                  {edu.current && edu.description && <span> ({edu.description})</span>}
                </div>
                {edu.gpa && <div>GPA: {edu.gpa}</div>}
              </div>
            ))}
          </section>
        )}
        
        {/* 5. TECHNICAL SKILLS */}
        {skills && skills.filter(s => s.category !== 'Soft Skills').length > 0 && (
          <section className="resume-section">
            <h2>TECHNICAL SKILLS</h2>
            <div className="skills-compact">
              {(() => {
                const technicalSkills = skills.filter(s => s.category !== 'Soft Skills');
                const groupedSkills = technicalSkills.reduce((acc, skill) => {
                  const category = skill.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill.name);
                  return acc;
                }, {});
                
                return Object.entries(groupedSkills).map(([category, skillNames]) => (
                  <div key={category} className="skill-line">
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
            <div className="soft-skills-compact">
              {skills.filter(s => s.category === 'Soft Skills').map((skill) => (
                <div key={skill.id} className="soft-skill-line">• {skill.name}</div>
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
                <div className="cert-header">
                  <strong>{cert.name}</strong>
                  {cert.issue_date && <span> : {formatMonthYear(cert.issue_date)}</span>}
                  {cert.issuing_organization && <span> | {cert.issuing_organization}</span>}
                </div>
                {cert.description && <p className="cert-description">{cert.description}</p>}
              </div>
            ))}
          </section>
        )}
        
        {/* 8. REFEREES */}
        {references && references.length > 0 && (
          <section className="resume-section">
            <h2>REFEREES</h2>
            <div className="referees-grid">
              {references.map((ref) => (
                <div key={ref.id} className="referee-item">
                  <div className="referee-name">{ref.name}</div>
                  {ref.position && <div>{ref.position}</div>}
                  {ref.company && <div>{ref.company}</div>}
                  {ref.phone && <div>Tel: {ref.phone}</div>}
                  {ref.email && <div>Email: {ref.email}</div>}
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

function formatYear(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

function formatMonthYear(dateString) {
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
