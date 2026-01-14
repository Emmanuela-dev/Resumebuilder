import { useState } from 'react';
import { Sparkles, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { generateResumeWithAI } from '../../lib/aiService';
import { useResumeStore } from '../../store/resumeStore';
import toast from 'react-hot-toast';
import './AIResumeGenerator.css';

export default function AIResumeGenerator({ resumeId, onGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('');
  const { currentResume, updateResume, updateSectionItem, addSectionItem } = useResumeStore();

  const handleGenerate = async () => {
    if (!currentResume) {
      toast.error('Please fill in your profile information first');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Step 1: Validate data
      setStep('Validating your information...');
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user has minimal data
      if (!currentResume.experience || currentResume.experience.length === 0) {
        toast.error('Please add at least one work experience');
        setIsGenerating(false);
        return;
      }

      // Step 2: Send to AI
      setStep('Generating professional content...');
      setProgress(40);

      const profileData = {
        personalInfo: currentResume.personalInfo || {},
        education: currentResume.education || [],
        experience: currentResume.experience || [],
        skills: currentResume.skills || [],
        projects: currentResume.projects || [],
        careerGoals: currentResume.careerGoals || ''
      };

      const aiResponse = await generateResumeWithAI(profileData);
      
      // Step 3: Apply AI suggestions
      setStep('Enhancing your resume...');
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update summary
      if (aiResponse.summary) {
        await updateResume(resumeId, { summary: aiResponse.summary });
      }

      // Update experience descriptions
      if (aiResponse.experience && currentResume.experience) {
        for (let i = 0; i < Math.min(aiResponse.experience.length, currentResume.experience.length); i++) {
          const exp = currentResume.experience[i];
          const aiExp = aiResponse.experience[i];
          
          if (aiExp.description || aiExp.achievements) {
            await updateSectionItem(resumeId, 'experience', exp.id, {
              ...exp,
              description: aiExp.description || exp.description,
              achievements: aiExp.achievements || exp.achievements
            });
          }
        }
      }

      // Update project descriptions
      if (aiResponse.projects && currentResume.projects) {
        for (let i = 0; i < Math.min(aiResponse.projects.length, currentResume.projects.length); i++) {
          const proj = currentResume.projects[i];
          const aiProj = aiResponse.projects[i];
          
          if (aiProj.description) {
            await updateSectionItem(resumeId, 'projects', proj.id, {
              ...proj,
              description: aiProj.description
            });
          }
        }
      }

      // Step 4: Finalize
      setStep('Finalizing your resume...');
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success('🎉 AI-enhanced resume generated successfully!');
      
      if (onGenerated) {
        onGenerated();
      }

    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setStep('');
    }
  };

  return (
    <div className="ai-generator">
      <div className="ai-generator-header">
        <div className="ai-icon">
          <Sparkles size={24} />
        </div>
        <div className="ai-header-text">
          <h3>AI Resume Enhancement</h3>
          <p>Let AI transform your resume into a professional masterpiece</p>
        </div>
      </div>

      {isGenerating ? (
        <div className="ai-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-status">
            <Loader className="spinning" size={16} />
            <span>{step}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="ai-features">
            <div className="ai-feature">
              <CheckCircle size={18} color="#38a169" />
              <span>Professional summary generation</span>
            </div>
            <div className="ai-feature">
              <CheckCircle size={18} color="#38a169" />
              <span>Enhanced job descriptions with metrics</span>
            </div>
            <div className="ai-feature">
              <CheckCircle size={18} color="#38a169" />
              <span>ATS-optimized content</span>
            </div>
            <div className="ai-feature">
              <CheckCircle size={18} color="#38a169" />
              <span>Action-oriented achievements</span>
            </div>
          </div>

          <div className="ai-requirements">
            <AlertCircle size={16} color="#d69e2e" />
            <span>Make sure you've added your work experience and skills first</span>
          </div>

          <button 
            className="btn btn-primary btn-ai"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles size={18} />
            Generate with AI
          </button>
        </>
      )}
    </div>
  );
}
