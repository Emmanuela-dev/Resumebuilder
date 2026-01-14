import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Export resume as PDF
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
 * Export resume as Word document
 * @param {Object} resumeData - The resume data
 * @param {string} filename - Name of the Word file
 */
export const exportToWord = async (resumeData, filename = 'resume.docx') => {
  try {
    const { personalInfo, summary, experience, education, skills, projects, certifications, languages, references } = resumeData;

    const sections = [];

    // Header - Personal Info
    if (personalInfo) {
      sections.push(
        new Paragraph({
          text: personalInfo.full_name || 'Your Name',
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        })
      );

      const contactInfo = [];
      if (personalInfo.email) contactInfo.push(personalInfo.email);
      if (personalInfo.phone) contactInfo.push(personalInfo.phone);
      if (personalInfo.location) contactInfo.push(personalInfo.location);

      if (contactInfo.length > 0) {
        sections.push(
          new Paragraph({
            text: contactInfo.join(' | '),
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          })
        );
      }

      const links = [];
      if (personalInfo.linkedin) links.push(`LinkedIn: ${personalInfo.linkedin}`);
      if (personalInfo.website) links.push(`Website: ${personalInfo.website}`);
      if (personalInfo.github) links.push(`GitHub: ${personalInfo.github}`);

      if (links.length > 0) {
        sections.push(
          new Paragraph({
            text: links.join(' | '),
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          })
        );
      }
    }

    // Summary
    if (summary) {
      sections.push(
        new Paragraph({
          text: 'Professional Summary',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: summary,
          spacing: { after: 300 }
        })
      );
    }

    // Experience
    if (experience && experience.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Work Experience',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        })
      );

      experience.forEach((exp) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.position || '', bold: true, size: 24 }),
              new TextRun({ text: exp.company ? ` - ${exp.company}` : '', size: 24 })
            ],
            spacing: { after: 50 }
          })
        );

        if (exp.start_date || exp.end_date) {
          const startDate = exp.start_date ? new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
          const endDate = exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
          sections.push(
            new Paragraph({
              text: `${startDate} - ${endDate}`,
              italics: true,
              spacing: { after: 100 }
            })
          );
        }

        if (exp.description) {
          sections.push(
            new Paragraph({
              text: exp.description,
              spacing: { after: 100 }
            })
          );
        }

        if (exp.achievements) {
          const achievements = Array.isArray(exp.achievements) ? exp.achievements : [exp.achievements];
          achievements.forEach(achievement => {
            sections.push(
              new Paragraph({
                text: `• ${achievement}`,
                spacing: { after: 50 }
              })
            );
          });
        }

        sections.push(new Paragraph({ text: '', spacing: { after: 200 } }));
      });
    }

    // Education
    if (education && education.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Education',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        })
      );

      education.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree || '', bold: true, size: 24 }),
              new TextRun({ text: edu.institution ? ` - ${edu.institution}` : '', size: 24 })
            ],
            spacing: { after: 50 }
          })
        );

        if (edu.graduation_date) {
          sections.push(
            new Paragraph({
              text: new Date(edu.graduation_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              italics: true,
              spacing: { after: 100 }
            })
          );
        }

        if (edu.gpa) {
          sections.push(
            new Paragraph({
              text: `GPA: ${edu.gpa}`,
              spacing: { after: 200 }
            })
          );
        }
      });
    }

    // Skills
    if (skills && skills.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Skills',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        })
      );

      const skillsByCategory = {};
      skills.forEach(skill => {
        const category = skill.category || 'Other';
        if (!skillsByCategory[category]) {
          skillsByCategory[category] = [];
        }
        skillsByCategory[category].push(skill.name);
      });

      Object.entries(skillsByCategory).forEach(([category, skillNames]) => {
        sections.push(
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

    // Projects
    if (projects && projects.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Projects',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        })
      );

      projects.forEach((project) => {
        sections.push(
          new Paragraph({
            text: project.name || '',
            bold: true,
            size: 24,
            spacing: { after: 50 }
          })
        );

        if (project.description) {
          sections.push(
            new Paragraph({
              text: project.description,
              spacing: { after: 100 }
            })
          );
        }

        if (project.technologies) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Technologies: ', bold: true }),
                new TextRun({ text: project.technologies })
              ],
              spacing: { after: 200 }
            })
          );
        }
      });
    }

    // Certifications
    if (certifications && certifications.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Certifications',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        })
      );

      certifications.forEach((cert) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: cert.name || '', bold: true }),
              new TextRun({ text: cert.issuer ? ` - ${cert.issuer}` : '' })
            ],
            spacing: { after: 50 }
          })
        );

        if (cert.issue_date) {
          sections.push(
            new Paragraph({
              text: new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              spacing: { after: 200 }
            })
          );
        }
      });
    }

    // Languages
    if (languages && languages.length > 0) {
      sections.push(
        new Paragraph({
          text: 'Languages',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        })
      );

      languages.forEach((lang) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: lang.name || '', bold: true }),
              new TextRun({ text: lang.proficiency ? ` - ${lang.proficiency}` : '' })
            ],
            spacing: { after: 100 }
          })
        );
      });
    }

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);

    return { success: true };
  } catch (error) {
    console.error('Word export error:', error);
    throw new Error('Failed to export Word document');
  }
};

/**
 * Get export format label
 */
export const getExportFormatLabel = (format) => {
  const formats = {
    pdf: 'PDF Document',
    word: 'Word Document (.docx)'
  };
  return formats[format] || format;
};
