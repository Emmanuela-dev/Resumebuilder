import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: null,
  loading: false,
  autoSaveTimer: null,
  
  // Fetch all resumes for the current user
  fetchResumes: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      set({ resumes: data });
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      set({ loading: false });
    }
  },
  
  // Fetch a single resume with all sections
  fetchResume: async (resumeId) => {
    set({ loading: true });
    try {
      const { data: resume, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId)
        .single();
      
      if (resumeError) throw resumeError;
      
      // Fetch all sections
      const [
        { data: personalInfo },
        { data: education },
        { data: experience },
        { data: skills },
        { data: projects },
        { data: certifications },
        { data: languages },
        { data: references },
        { data: sectionVisibility },
      ] = await Promise.all([
        supabase.from('personal_info').select('*').eq('resume_id', resumeId).single(),
        supabase.from('education').select('*').eq('resume_id', resumeId).order('sort_order'),
        supabase.from('experience').select('*').eq('resume_id', resumeId).order('sort_order'),
        supabase.from('skills').select('*').eq('resume_id', resumeId).order('sort_order'),
        supabase.from('projects').select('*').eq('resume_id', resumeId).order('sort_order'),
        supabase.from('certifications').select('*').eq('resume_id', resumeId).order('sort_order'),
        supabase.from('languages').select('*').eq('resume_id', resumeId).order('sort_order'),
        supabase.from('references').select('*').eq('resume_id', resumeId).order('sort_order'),
        supabase.from('section_visibility').select('*').eq('resume_id', resumeId).single(),
      ]);
      
      const fullResume = {
        ...resume,
        personalInfo: personalInfo || {},
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        projects: projects || [],
        certifications: certifications || [],
        languages: languages || [],
        references: references || [],
        sectionVisibility: sectionVisibility || {},
      };
      
      set({ currentResume: fullResume });
      return fullResume;
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
    } finally {
      set({ loading: false });
    }
  },
  
  // Create new resume
  createResume: async (title, templateId = 'modern') => {
    try {
      // Get current user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      const { data, error } = await supabase
        .from('resumes')
        .insert([{ 
          title, 
          summary: '',
          template_id: templateId,
          user_id: user.id  // Add user_id to pass RLS policy
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Resume insert error:', error);
        throw error;
      }
      
      // Initialize section visibility
      const { error: visibilityError } = await supabase
        .from('section_visibility')
        .insert([{ resume_id: data.id }]);
      
      if (visibilityError) {
        console.error('Section visibility error:', visibilityError);
      }
      
      // Initialize personal info
      const { error: personalInfoError } = await supabase
        .from('personal_info')
        .insert([{ resume_id: data.id }]);
      
      if (personalInfoError) {
        console.error('Personal info error:', personalInfoError);
      }
      
      await get().fetchResumes();
      toast.success('Resume created successfully');
      return data;
    } catch (error) {
      console.error('Error creating resume:', error);
      const errorMessage = error?.message || 'Failed to create resume';
      toast.error(errorMessage);
      throw error;
    }
  },
  
  // Update resume
  updateResume: async (resumeId, updates) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update(updates)
        .eq('id', resumeId);
      
      if (error) throw error;
      
      await get().fetchResumes();
      
      if (get().currentResume?.id === resumeId) {
        await get().fetchResume(resumeId);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error('Failed to update resume');
      throw error;
    }
  },
  
  // Delete resume
  deleteResume: async (resumeId) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);
      
      if (error) throw error;
      
      await get().fetchResumes();
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
      throw error;
    }
  },
  
  // Duplicate resume
  duplicateResume: async (resumeId) => {
    try {
      const original = await get().fetchResume(resumeId);
      
      // Create new resume
      const { data: newResume, error: resumeError } = await supabase
        .from('resumes')
        .insert([{
          title: `${original.title} (Copy)`,
          summary: original.summary,
          template_id: original.template_id,
          color_theme: original.color_theme,
          font_family: original.font_family,
          layout: original.layout,
        }])
        .select()
        .single();
      
      if (resumeError) throw resumeError;
      
      // Copy all sections
      const copyPromises = [];
      
      if (original.personalInfo?.id) {
        const { id, resume_id, created_at, updated_at, ...personalData } = original.personalInfo;
        copyPromises.push(
          supabase.from('personal_info').insert([{ ...personalData, resume_id: newResume.id }])
        );
      }
      
      if (original.education.length > 0) {
        const educationData = original.education.map(({ id, resume_id, created_at, updated_at, ...rest }) => ({
          ...rest,
          resume_id: newResume.id,
        }));
        copyPromises.push(supabase.from('education').insert(educationData));
      }
      
      if (original.experience.length > 0) {
        const experienceData = original.experience.map(({ id, resume_id, created_at, updated_at, ...rest }) => ({
          ...rest,
          resume_id: newResume.id,
        }));
        copyPromises.push(supabase.from('experience').insert(experienceData));
      }
      
      if (original.skills.length > 0) {
        const skillsData = original.skills.map(({ id, resume_id, created_at, ...rest }) => ({
          ...rest,
          resume_id: newResume.id,
        }));
        copyPromises.push(supabase.from('skills').insert(skillsData));
      }
      
      if (original.projects.length > 0) {
        const projectsData = original.projects.map(({ id, resume_id, created_at, updated_at, ...rest }) => ({
          ...rest,
          resume_id: newResume.id,
        }));
        copyPromises.push(supabase.from('projects').insert(projectsData));
      }
      
      if (original.certifications.length > 0) {
        const certificationsData = original.certifications.map(({ id, resume_id, created_at, ...rest }) => ({
          ...rest,
          resume_id: newResume.id,
        }));
        copyPromises.push(supabase.from('certifications').insert(certificationsData));
      }
      
      if (original.languages.length > 0) {
        const languagesData = original.languages.map(({ id, resume_id, created_at, ...rest }) => ({
          ...rest,
          resume_id: newResume.id,
        }));
        copyPromises.push(supabase.from('languages').insert(languagesData));
      }
      
      if (original.references.length > 0) {
        const referencesData = original.references.map(({ id, resume_id, created_at, ...rest }) => ({
          ...rest,
          resume_id: newResume.id,
        }));
        copyPromises.push(supabase.from('references').insert(referencesData));
      }
      
      if (original.sectionVisibility?.id) {
        const { id, resume_id, ...visibilityData } = original.sectionVisibility;
        copyPromises.push(
          supabase.from('section_visibility').insert([{ ...visibilityData, resume_id: newResume.id }])
        );
      }
      
      await Promise.all(copyPromises);
      await get().fetchResumes();
      toast.success('Resume duplicated successfully');
      return newResume;
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast.error('Failed to duplicate resume');
      throw error;
    }
  },
  
  // Auto-save functionality
  scheduleAutoSave: (resumeId, updates) => {
    const { autoSaveTimer } = get();
    
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    const timer = setTimeout(async () => {
      try {
        await get().updateResume(resumeId, updates);
        toast.success('Changes saved', { duration: 1000 });
      } catch (error) {
        toast.error('Auto-save failed');
      }
    }, 5000);
    
    set({ autoSaveTimer: timer });
  },
  
  // Update section
  updateSection: async (resumeId, sectionName, sectionData) => {
    try {
      const { error } = await supabase
        .from(sectionName)
        .upsert(sectionData);
      
      if (error) throw error;
      
      if (get().currentResume?.id === resumeId) {
        await get().fetchResume(resumeId);
      }
    } catch (error) {
      console.error(`Error updating ${sectionName}:`, error);
      toast.error(`Failed to update ${sectionName}`);
      throw error;
    }
  },
  
  // Add section item
  addSectionItem: async (resumeId, sectionName, item) => {
    try {
      console.log(`Adding ${sectionName} item:`, { resumeId, item });
      
      const { data, error } = await supabase
        .from(sectionName)
        .insert([{ ...item, resume_id: resumeId }])
        .select()
        .single();
      
      if (error) {
        console.error(`Supabase error for ${sectionName}:`, error);
        throw error;
      }
      
      if (get().currentResume?.id === resumeId) {
        await get().fetchResume(resumeId);
      }
      
      return data;
    } catch (error) {
      console.error(`Error adding ${sectionName} item:`, error);
      toast.error(`Failed to add ${sectionName} item: ${error.message}`);
      throw error;
    }
  },
  
  // Update section item
  updateSectionItem: async (resumeId, sectionName, itemId, updates) => {
    try {
      const { error } = await supabase
        .from(sectionName)
        .update(updates)
        .eq('id', itemId);
      
      if (error) throw error;
      
      if (get().currentResume?.id === resumeId) {
        await get().fetchResume(resumeId);
      }
    } catch (error) {
      console.error(`Error updating ${sectionName} item:`, error);
      toast.error(`Failed to update ${sectionName} item`);
      throw error;
    }
  },
  
  // Delete section item
  deleteSectionItem: async (resumeId, sectionName, itemId) => {
    try {
      const { error } = await supabase
        .from(sectionName)
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      
      if (get().currentResume?.id === resumeId) {
        await get().fetchResume(resumeId);
      }
      
      toast.success('Item deleted');
    } catch (error) {
      console.error(`Error deleting ${sectionName} item:`, error);
      toast.error(`Failed to delete ${sectionName} item`);
      throw error;
    }
  },
}));
