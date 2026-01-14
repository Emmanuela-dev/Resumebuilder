import { supabase } from './supabase';

/**
 * Generate resume content using AI
 * This uses Supabase Edge Functions to call AI APIs securely
 */
export const generateResumeWithAI = async (profileData) => {
  try {
    // Prepare the prompt for AI
    const prompt = buildPrompt(profileData);
    
    // Call Supabase Edge Function (or direct AI API)
    // For now, we'll use a mock implementation
    // You'll need to set up an actual AI service (OpenAI, Claude, etc.)
    
    const response = await callAIService(prompt);
    
    return response;
  } catch (error) {
    console.error('Error generating resume with AI:', error);
    throw error;
  }
};

/**
 * Build a structured prompt for the AI
 */
const buildPrompt = (profileData) => {
  const { 
    personalInfo, 
    education, 
    experience, 
    skills, 
    projects, 
    careerGoals 
  } = profileData;

  return `You are a professional resume writer. Create a compelling, ATS-friendly resume based on the following information:

PERSONAL INFORMATION:
${personalInfo.full_name ? `Name: ${personalInfo.full_name}` : ''}
${personalInfo.email ? `Email: ${personalInfo.email}` : ''}
${personalInfo.phone ? `Phone: ${personalInfo.phone}` : ''}
${personalInfo.location ? `Location: ${personalInfo.location}` : ''}

EDUCATION:
${education.map(edu => `
- ${edu.degree} in ${edu.field_of_study}
  ${edu.institution} (${edu.start_date} - ${edu.end_date || 'Present'})
  ${edu.gpa ? `GPA: ${edu.gpa}` : ''}
  ${edu.description || ''}
`).join('\n')}

WORK EXPERIENCE:
${experience.map(exp => `
- ${exp.position} at ${exp.company}
  ${exp.location || ''} (${exp.start_date} - ${exp.end_date || 'Present'})
  ${exp.description || ''}
  ${exp.achievements ? exp.achievements.join(', ') : ''}
`).join('\n')}

SKILLS:
${skills.map(skill => `${skill.name} (${skill.level || 'Proficient'})`).join(', ')}

PROJECTS:
${projects.map(proj => `
- ${proj.name}
  ${proj.description || ''}
  Technologies: ${proj.technologies ? proj.technologies.join(', ') : ''}
  ${proj.url || ''}
`).join('\n')}

CAREER GOALS:
${careerGoals || 'Not specified'}

Please generate:
1. A compelling professional summary (2-3 sentences)
2. Enhanced descriptions for each work experience (quantify achievements where possible)
3. Improved project descriptions
4. Formatted output as JSON with the following structure:
{
  "summary": "Professional summary text",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "description": "Enhanced description",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Enhanced description"
    }
  ]
}

Make the content professional, concise, and tailored for job applications. Use action verbs and quantify achievements when possible.`;
};

/**
 * Call AI Service - Raxcore AI Integration
 */
const callAIService = async (prompt) => {
  const RAXCORE_API_KEY = import.meta.env.VITE_RAXCORE_API_KEY;
  const RAXCORE_API_URL = import.meta.env.VITE_RAXCORE_API_URL || 'https://api.raxcore.com/v1/chat/completions';
  
  if (RAXCORE_API_KEY) {
    try {
      const response = await fetch(RAXCORE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RAXCORE_API_KEY}`
        },
        body: JSON.stringify({
          model: 'raxcore-ai',
          messages: [
            { 
              role: 'system', 
              content: 'You are a professional resume writer specializing in creating compelling, ATS-friendly resumes. Always respond with valid JSON format.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Raxcore API error:', errorText);
        throw new Error(`Raxcore API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle Raxcore response format
      let content;
      if (data.choices && data.choices[0]) {
        content = data.choices[0].message?.content || data.choices[0].text;
      } else if (data.content) {
        content = data.content;
      } else if (data.response) {
        content = data.response;
      } else {
        throw new Error('Unexpected response format from Raxcore API');
      }
      
      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON found, try to parse the entire content
      try {
        return JSON.parse(content);
      } catch {
        console.warn('Could not parse AI response as JSON, using mock data');
        return getMockAIResponse();
      }
    } catch (error) {
      console.error('Raxcore AI error:', error);
      // Fall back to mock data if API fails
      return getMockAIResponse();
    }
  }
  
  // No API key - use mock response
  console.log('No Raxcore API key found, using mock data');
  return getMockAIResponse();
};

/**
 * Mock AI response for development
 */
const getMockAIResponse = () => {
  return {
    summary: "Results-driven professional with proven expertise in software development and project management. Skilled in leveraging cutting-edge technologies to deliver high-impact solutions. Committed to continuous learning and driving innovation in fast-paced environments.",
    experience: [
      {
        enhanced: true,
        description: "Led cross-functional teams in developing and deploying scalable web applications, resulting in 40% improvement in system performance and 25% increase in user engagement."
      }
    ],
    projects: [
      {
        enhanced: true,
        description: "Architected and developed a full-stack application utilizing modern frameworks, serving 10,000+ active users with 99.9% uptime."
      }
    ]
  };
};

/**
 * Generate PDF from resume data
 */
export const generatePDF = async (resumeData, template = 'modern') => {
  // This will be implemented with jsPDF and html2canvas
  // For now, return a placeholder
  return null;
};

/**
 * Generate Word document from resume data
 */
export const generateWord = async (resumeData) => {
  // This will be implemented with docx library
  // For now, return a placeholder
  return null;
};
