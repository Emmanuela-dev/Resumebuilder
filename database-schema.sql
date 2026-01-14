-- Resume Builder Database Schema
-- Copy and paste this entire file into your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes table
CREATE TABLE resumes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_active BOOLEAN DEFAULT false,
  template_id TEXT DEFAULT 'modern',
  color_theme TEXT DEFAULT 'blue',
  font_family TEXT DEFAULT 'inter',
  layout TEXT DEFAULT 'two-column',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

-- Personal Information
CREATE TABLE personal_info (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education
CREATE TABLE education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  gpa TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience
CREATE TABLE experience (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  category TEXT,
  name TEXT NOT NULL,
  level TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  github_url TEXT,
  technologies TEXT[],
  start_date DATE,
  end_date DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications
CREATE TABLE certifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages
CREATE TABLE languages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL,
  proficiency TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- References
CREATE TABLE "references" (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  position TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  relationship TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Section Visibility
CREATE TABLE section_visibility (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL UNIQUE,
  show_summary BOOLEAN DEFAULT true,
  show_education BOOLEAN DEFAULT true,
  show_experience BOOLEAN DEFAULT true,
  show_skills BOOLEAN DEFAULT true,
  show_projects BOOLEAN DEFAULT true,
  show_certifications BOOLEAN DEFAULT true,
  show_languages BOOLEAN DEFAULT true,
  show_references BOOLEAN DEFAULT false,
  sections_order JSONB DEFAULT '["summary", "experience", "education", "skills", "projects", "certifications", "languages", "references"]'::jsonb
);

-- Resume Versions (for history)
CREATE TABLE resume_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public Shares
CREATE TABLE public_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics
CREATE TABLE resume_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  share_id UUID REFERENCES public_shares(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'download', 'link_click')),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File Uploads
CREATE TABLE file_uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_education_resume_id ON education(resume_id);
CREATE INDEX idx_experience_resume_id ON experience(resume_id);
CREATE INDEX idx_skills_resume_id ON skills(resume_id);
CREATE INDEX idx_projects_resume_id ON projects(resume_id);
CREATE INDEX idx_certifications_resume_id ON certifications(resume_id);
CREATE INDEX idx_languages_resume_id ON languages(resume_id);
CREATE INDEX idx_references_resume_id ON "references"(resume_id);
CREATE INDEX idx_analytics_resume_id ON resume_analytics(resume_id);
CREATE INDEX idx_public_shares_token ON public_shares(share_token);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Resumes
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Personal Info
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own personal info" ON personal_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = personal_info.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Education
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own education" ON education
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = education.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Experience
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own experience" ON experience
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = experience.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own skills" ON skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = skills.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = projects.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Certifications
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own certifications" ON certifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = certifications.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Languages
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own languages" ON languages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = languages.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- References
ALTER TABLE "references" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own references" ON "references"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = "references".resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Section Visibility
ALTER TABLE section_visibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own section visibility" ON section_visibility
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = section_visibility.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Resume Versions
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resume versions" ON resume_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = resume_versions.resume_id AND resumes.user_id = auth.uid()
    )
  );

-- Public Shares
ALTER TABLE public_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own shares" ON public_shares
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = public_shares.resume_id AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view public shares" ON public_shares
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Analytics
ALTER TABLE resume_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" ON resume_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM resumes WHERE resumes.id = resume_analytics.resume_id AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics" ON resume_analytics
  FOR INSERT WITH CHECK (true);

-- File Uploads
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own files" ON file_uploads
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DONE! Your database is now ready to use
-- =============================================
