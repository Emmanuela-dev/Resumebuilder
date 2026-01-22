import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Export resume as ATS-friendly PDF (text-based, not image)
 * @param {HTMLElement} element - The resume preview element to export
 * @param {Object} resumeData - The resume data object
 * @param {string} filename - Name of the PDF file
 */
export const exportToATSPDF = async (resumeData, filename = 'resume.pdf') => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    let yPosition = 40;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    const maxWidth = pageWidth - (margin * 2);

    // Helper function to add text with word wrapping
    const addText = (text, fontSize, fontStyle = 'normal', align = 'left', color = '#000000') => {
      if (!text) return;
      
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.setTextColor(color);
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      // Check if we need a new page
      if (yPosition + (lines.length * fontSize * 0.5) > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      lines.forEach(line => {
        const xPosition = align === 'center' ? pageWidth / 2 : margin;
        const alignType = align === 'center' ? 'center' : 'left';
        pdf.text(line, xPosition, yPosition, { align: alignType });
        yPosition += fontSize * 0.5;
      });
    };

    const addSpace = (space = 10) => {
      yPosition += space;
    };

    const addSection = (title) => {
      addSpace(15);
      pdf.setDrawColor(26, 145, 240);
      pdf.setLineWidth(2);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      addSpace(5);
      addText(title, 14, 'bold', 'left', '#1a91f0');
      addSpace(10);
    };

    // HEADER - Personal Information
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages, references } = resumeData;
    
    if (personalInfo) {
      addText(personalInfo.full_name || 'Your Name', 20, 'bold', 'center', '#1a91f0');
      addSpace(5);
      
      if (personalInfo.title) {
        addText(personalInfo.title, 12, 'normal', 'center', '#4a5568');
        addSpace(5);
      }
      
      if (personalInfo.location) {
        addText(personalInfo.location, 10, 'normal', 'center', '#4a5568');
        addSpace(5);
      }
      
      // Contact info on one line
      const contactParts = [];
      if (personalInfo.phone) contactParts.push(personalInfo.phone);
      if (personalInfo.email) contactParts.push(personalInfo.email);
      if (contactParts.length) {
        addText(contactParts.join(' | '), 10, 'normal', 'center', '#4a5568');
        addSpace(5);
      }
      
      // Links
      const linkParts = [];
      if (personalInfo.linkedin) linkParts.push(`LinkedIn: ${personalInfo.linkedin}`);
      if (personalInfo.website) linkParts.push(`Website: ${personalInfo.website}`);
      if (personalInfo.github) linkParts.push(`GitHub: ${personalInfo.github}`);
      if (linkParts.length) {
        addText(linkParts.join(' | '), 9, 'normal', 'center', '#1a91f0');
      }
    }

    // PROFESSIONAL SUMMARY
    if (summary) {
      addSection('PROFESSIONAL SUMMARY');
      addText(summary, 10, 'normal', 'left', '#2d3748');
    }

    // CORE COMPETENCIES
    if (skills && skills.length > 0) {
      addSection('CORE COMPETENCIES');
      const competencies = skills.slice(0, 12).map(s => s.name).join(' • ');
      addText(competencies, 10, 'normal', 'left', '#2d3748');
    }

    // WORK EXPERIENCE / PROJECT EXPERIENCE
    if ((experience && experience.length > 0) || (projects && projects.length > 0)) {
      const sectionTitle = resumeData.experience_type === 'project' ? 'PROJECT EXPERIENCE' : 'WORK EXPERIENCE';
      addSection(sectionTitle);

      // Add experience
      if (experience && experience.length > 0) {
        experience.forEach((exp, index) => {
          if (index > 0) addSpace(12);
          
          addText(exp.position, 11, 'bold', 'left', '#1a202c');
          addSpace(3);
          
          const companyLine = [exp.company, exp.location].filter(Boolean).join(', ');
          if (companyLine) {
            addText(companyLine, 10, 'normal', 'left', '#4a5568');
            addSpace(3);
          }
          
          const dateRange = `${formatDate(exp.start_date)} - ${exp.current ? 'Present' : formatDate(exp.end_date)}`;
          addText(dateRange, 9, 'italic', 'left', '#718096');
          addSpace(5);
          
          if (exp.description) {
            addText(`• ${exp.description}`, 10, 'normal', 'left', '#4a5568');
            addSpace(3);
          }
          
          if (exp.achievements && Array.isArray(exp.achievements)) {
            exp.achievements.forEach(achievement => {
              addText(`• ${achievement}`, 10, 'normal', 'left', '#4a5568');
              addSpace(3);
            });
          }
        });
      }

      // Add projects
      if (projects && projects.length > 0) {
        projects.forEach((project, index) => {
          if (index > 0 || (experience && experience.length > 0)) addSpace(12);
          
          addText(project.name, 11, 'bold', 'left', '#1a202c');
          addSpace(3);
          
          if (project.start_date) {
            const dateRange = `${formatDate(project.start_date)} - ${project.end_date ? formatDate(project.end_date) : 'Present'}`;
            addText(dateRange, 9, 'italic', 'left', '#718096');
            addSpace(5);
          }
          
          if (project.description) {
            addText(`• ${project.description}`, 10, 'normal', 'left', '#4a5568');
            addSpace(3);
          }
          
          if (project.technologies) {
            addText(`• Technologies: ${project.technologies}`, 10, 'normal', 'left', '#4a5568');
            addSpace(3);
          }
        });
      }
    }

    // EDUCATION
    if (education && education.length > 0) {
      addSection('EDUCATION');
      
      education.forEach((edu, index) => {
        if (index > 0) addSpace(10);
        
        const degreeText = [edu.degree, edu.field_of_study && `in ${edu.field_of_study}`].filter(Boolean).join(' ');
        addText(degreeText, 11, 'bold', 'left', '#1a202c');
        addSpace(3);
        
        const institutionLine = [edu.institution, edu.location].filter(Boolean).join(' - ');
        if (institutionLine) {
          addText(institutionLine, 10, 'normal', 'left', '#4a5568');
          addSpace(3);
        }
        
        const dateRange = `${formatYear(edu.start_date)} - ${edu.current ? 'Present' : formatYear(edu.graduation_date)}`;
        addText(dateRange, 9, 'normal', 'left', '#718096');
        
        if (edu.gpa) {
          addSpace(3);
          addText(`GPA: ${edu.gpa}`, 9, 'normal', 'left', '#4a5568');
        }
      });
    }

    // TECHNICAL SKILLS
    const technicalSkills = skills?.filter(s => s.category !== 'Soft Skills') || [];
    if (technicalSkills.length > 0) {
      addSection('TECHNICAL SKILLS');
      
      const groupedSkills = technicalSkills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill.name);
        return acc;
      }, {});
      
      Object.entries(groupedSkills).forEach(([category, skillNames]) => {
        addText(`${category}: ${skillNames.join(', ')}`, 10, 'normal', 'left', '#4a5568');
        addSpace(5);
      });
    }

    // SOFT SKILLS
    const softSkills = skills?.filter(s => s.category === 'Soft Skills') || [];
    if (softSkills.length > 0) {
      addSection('SOFT SKILLS');
      const softSkillsList = softSkills.map(s => s.name).join(' • ');
      addText(softSkillsList, 10, 'normal', 'left', '#4a5568');
    }

    // CERTIFICATIONS
    if (certifications && certifications.length > 0) {
      addSection('ACHIEVEMENTS & CERTIFICATIONS');
      
      certifications.forEach((cert, index) => {
        if (index > 0) addSpace(8);
        
        const certHeader = [
          cert.name,
          cert.issue_date && formatMonthYear(cert.issue_date),
          cert.issuing_organization
        ].filter(Boolean).join(' | ');
        
        addText(certHeader, 10, 'bold', 'left', '#2d3748');
        
        if (cert.description) {
          addSpace(3);
          addText(cert.description, 9, 'normal', 'left', '#4a5568');
        }
      });
    }

    // LANGUAGES
    if (languages && languages.length > 0) {
      addSection('LANGUAGES');
      const languageList = languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ');
      addText(languageList, 10, 'normal', 'left', '#4a5568');
    }

    // REFERENCES
    if (references && references.length > 0) {
      addSection('REFEREES');
      
      references.forEach((ref, index) => {
        if (index > 0) addSpace(10);
        
        addText(ref.name, 10, 'bold', 'left', '#2d3748');
        addSpace(3);
        if (ref.position) addText(ref.position, 9, 'normal', 'left', '#4a5568');
        if (ref.company) {
          addSpace(2);
          addText(ref.company, 9, 'normal', 'left', '#4a5568');
        }
        if (ref.phone) {
          addSpace(2);
          addText(`Tel: ${ref.phone}`, 9, 'normal', 'left', '#4a5568');
        }
        if (ref.email) {
          addSpace(2);
          addText(`Email: ${ref.email}`, 9, 'normal', 'left', '#4a5568');
        }
      });
    }

    pdf.save(filename);
    return { success: true };
  } catch (error) {
    console.error('ATS PDF export error:', error);
    throw new Error('Failed to export ATS-friendly PDF');
  }
};

/**
 * Export resume as PDF (image-based for visual accuracy)
 * @param {HTMLElement} element - The resume preview element to export
 * @param {string} filename - Name of the PDF file
 */
export const exportToPDF = async (element, filename = 'resume.pdf') => {
  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit A4
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);

    return { success: true };
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF');
  }
};

/**
 * Export resume as ATS-friendly DOCX
 * @param {Object} resumeData - The resume data object
 * @param {string} filename - Name of the DOCX file
 */
export const exportToATSDOCX = async (resumeData, filename = 'resume.docx') => {
  try {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages, references } = resumeData;
    
    const children = [];

    // Helper to create section heading
    const createSectionHeading = (text) => new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 },
      border: {
        bottom: {
          color: '1a91f0',
          space: 1,
          value: BorderStyle.SINGLE,
          size: 10
        }
      }
    });

    // HEADER - Personal Information
    if (personalInfo) {
      children.push(
        new Paragraph({
          text: personalInfo.full_name || 'Your Name',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        })
      );

      if (personalInfo.title) {
        children.push(
          new Paragraph({
            text: personalInfo.title,
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 }
          })
        );
      }

      const contactParts = [];
      if (personalInfo.phone) contactParts.push(personalInfo.phone);
      if (personalInfo.email) contactParts.push(personalInfo.email);
      if (personalInfo.location) contactParts.push(personalInfo.location);
      
      if (contactParts.length) {
        children.push(
          new Paragraph({
            text: contactParts.join(' | '),
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 }
          })
        );
      }

      const linkParts = [];
      if (personalInfo.linkedin) linkParts.push(`LinkedIn: ${personalInfo.linkedin}`);
      if (personalInfo.website) linkParts.push(`Website: ${personalInfo.website}`);
      if (personalInfo.github) linkParts.push(`GitHub: ${personalInfo.github}`);
      
      if (linkParts.length) {
        children.push(
          new Paragraph({
            text: linkParts.join(' | '),
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          })
        );
      }
    }

    // PROFESSIONAL SUMMARY
    if (summary) {
      children.push(createSectionHeading('PROFESSIONAL SUMMARY'));
      children.push(
        new Paragraph({
          text: summary,
          spacing: { after: 200 }
        })
      );
    }

    // CORE COMPETENCIES
    if (skills && skills.length > 0) {
      children.push(createSectionHeading('CORE COMPETENCIES'));
      const competencies = skills.slice(0, 12).map(s => s.name).join(' • ');
      children.push(
        new Paragraph({
          text: competencies,
          spacing: { after: 200 }
        })
      );
    }

    // WORK EXPERIENCE
    if ((experience && experience.length > 0) || (projects && projects.length > 0)) {
      const sectionTitle = resumeData.experience_type === 'project' ? 'PROJECT EXPERIENCE' : 'WORK EXPERIENCE';
      children.push(createSectionHeading(sectionTitle));

      if (experience && experience.length > 0) {
        experience.forEach(exp => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: exp.position, bold: true, size: 22 })
              ],
              spacing: { after: 50 }
            })
          );

          const companyLine = [exp.company, exp.location].filter(Boolean).join(', ');
          if (companyLine) {
            children.push(
              new Paragraph({
                text: companyLine,
                spacing: { after: 50 }
              })
            );
          }

          const dateRange = `${formatDate(exp.start_date)} - ${exp.current ? 'Present' : formatDate(exp.end_date)}`;
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: dateRange, italics: true, size: 18 })
              ],
              spacing: { after: 100 }
            })
          );

          if (exp.description) {
            children.push(
              new Paragraph({
                text: `• ${exp.description}`,
                spacing: { after: 50 }
              })
            );
          }

          if (exp.achievements && Array.isArray(exp.achievements)) {
            exp.achievements.forEach(achievement => {
              children.push(
                new Paragraph({
                  text: `• ${achievement}`,
                  spacing: { after: 50 }
                })
              );
            });
          }

          children.push(
            new Paragraph({
              text: '',
              spacing: { after: 150 }
            })
          );
        });
      }

      if (projects && projects.length > 0) {
        projects.forEach(project => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: project.name, bold: true, size: 22 })
              ],
              spacing: { after: 50 }
            })
          );

          if (project.start_date) {
            const dateRange = `${formatDate(project.start_date)} - ${project.end_date ? formatDate(project.end_date) : 'Present'}`;
            children.push(
              new Paragraph({
                children: [
                  new TextRun({ text: dateRange, italics: true, size: 18 })
                ],
                spacing: { after: 100 }
              })
            );
          }

          if (project.description) {
            children.push(
              new Paragraph({
                text: `• ${project.description}`,
                spacing: { after: 50 }
              })
            );
          }

          if (project.technologies) {
            children.push(
              new Paragraph({
                text: `• Technologies: ${project.technologies}`,
                spacing: { after: 150 }
              })
            );
          }
        });
      }
    }

    // EDUCATION
    if (education && education.length > 0) {
      children.push(createSectionHeading('EDUCATION'));

      education.forEach(edu => {
        const degreeText = [edu.degree, edu.field_of_study && `in ${edu.field_of_study}`].filter(Boolean).join(' ');
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: degreeText, bold: true, size: 22 })
            ],
            spacing: { after: 50 }
          })
        );

        const institutionLine = [edu.institution, edu.location].filter(Boolean).join(' - ');
        if (institutionLine) {
          children.push(
            new Paragraph({
              text: institutionLine,
              spacing: { after: 50 }
            })
          );
        }

        const dateRange = `${formatYear(edu.start_date)} - ${edu.current ? 'Present' : formatYear(edu.graduation_date)}`;
        children.push(
          new Paragraph({
            text: dateRange,
            spacing: { after: edu.gpa ? 50 : 150 }
          })
        );

        if (edu.gpa) {
          children.push(
            new Paragraph({
              text: `GPA: ${edu.gpa}`,
              spacing: { after: 150 }
            })
          );
        }
      });
    }

    // TECHNICAL SKILLS
    const technicalSkills = skills?.filter(s => s.category !== 'Soft Skills') || [];
    if (technicalSkills.length > 0) {
      children.push(createSectionHeading('TECHNICAL SKILLS'));

      const groupedSkills = technicalSkills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill.name);
        return acc;
      }, {});

      Object.entries(groupedSkills).forEach(([category, skillNames]) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${category}: `, bold: true }),
              new TextRun({ text: skillNames.join(', ') })
            ],
            spacing: { after: 100 }
          })
        );
      });
    }

    // SOFT SKILLS
    const softSkills = skills?.filter(s => s.category === 'Soft Skills') || [];
    if (softSkills.length > 0) {
      children.push(createSectionHeading('SOFT SKILLS'));
      const softSkillsList = softSkills.map(s => s.name).join(' • ');
      children.push(
        new Paragraph({
          text: softSkillsList,
          spacing: { after: 200 }
        })
      );
    }

    // CERTIFICATIONS
    if (certifications && certifications.length > 0) {
      children.push(createSectionHeading('ACHIEVEMENTS & CERTIFICATIONS'));

      certifications.forEach(cert => {
        const certHeader = [
          cert.name,
          cert.issue_date && formatMonthYear(cert.issue_date),
          cert.issuing_organization
        ].filter(Boolean).join(' | ');

        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: certHeader, bold: true })
            ],
            spacing: { after: cert.description ? 50 : 100 }
          })
        );

        if (cert.description) {
          children.push(
            new Paragraph({
              text: cert.description,
              spacing: { after: 100 }
            })
          );
        }
      });
    }

    // LANGUAGES
    if (languages && languages.length > 0) {
      children.push(createSectionHeading('LANGUAGES'));
      const languageList = languages.map(lang => `${lang.name} (${lang.proficiency})`).join(' • ');
      children.push(
        new Paragraph({
          text: languageList,
          spacing: { after: 200 }
        })
      );
    }

    // REFERENCES
    if (references && references.length > 0) {
      children.push(createSectionHeading('REFEREES'));

      references.forEach(ref => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: ref.name, bold: true })
            ],
            spacing: { after: 50 }
          })
        );

        if (ref.position) {
          children.push(
            new Paragraph({
              text: ref.position,
              spacing: { after: 30 }
            })
          );
        }

        if (ref.company) {
          children.push(
            new Paragraph({
              text: ref.company,
              spacing: { after: 30 }
            })
          );
        }

        if (ref.phone) {
          children.push(
            new Paragraph({
              text: `Tel: ${ref.phone}`,
              spacing: { after: 30 }
            })
          );
        }

        if (ref.email) {
          children.push(
            new Paragraph({
              text: `Email: ${ref.email}`,
              spacing: { after: 150 }
            })
          );
        }
      });
    }

    // Create document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: children
      }]
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);

    return { success: true };
  } catch (error) {
    console.error('DOCX export error:', error);
    throw new Error('Failed to export DOCX file');
  }
};

/**
 * Get export format label
 */
export const getExportFormatLabel = (format) => {
  const formats = {
    'ats-pdf': 'ATS-Friendly PDF (Recommended)',
    'ats-docx': 'ATS-Friendly DOCX',
    'pdf': 'Visual PDF',
  };
  return formats[format] || format;
};

// Helper functions
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
