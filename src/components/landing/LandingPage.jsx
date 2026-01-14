import { Link } from 'react-router-dom';
import { CheckCircle, FileText, Sparkles, Zap, Users, TrendingUp } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <FileText size={28} />
            <span>ResumeBuilder</span>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="btn-ghost">Sign In</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Build Your <span className="highlight">Professional Resume</span> in Minutes
            </h1>
            <p className="hero-description">
              Join thousands of job seekers who've landed their dream jobs. Our AI-powered platform creates resumes that get you noticed.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-hero-primary">
                Create My Resume
              </Link>
              <Link to="/login" className="btn-hero-secondary">
                Upload Resume
              </Link>
            </div>
            <p className="hero-note">✓ No credit card required • Free templates • ATS-friendly</p>
          </div>
          <div className="hero-image">
            <div className="resume-mockup">
              <div className="mockup-header"></div>
              <div className="mockup-content">
                <div className="mockup-line"></div>
                <div className="mockup-line short"></div>
                <div className="mockup-line"></div>
                <div className="mockup-section">
                  <div className="mockup-title"></div>
                  <div className="mockup-line"></div>
                  <div className="mockup-line short"></div>
                </div>
                <div className="mockup-section">
                  <div className="mockup-title"></div>
                  <div className="mockup-line"></div>
                  <div className="mockup-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Resume Matters Section */}
      <section className="importance-section">
        <div className="section-container">
          <h2 className="section-title">Why Your Resume Matters</h2>
          <p className="section-subtitle">
            Your resume is often the first impression you make on potential employers. 
            Here's why having a professional, well-crafted resume is crucial:
          </p>
          
          <div className="importance-grid">
            <div className="importance-card">
              <div className="card-icon blue">
                <Zap size={28} />
              </div>
              <h3>First Impressions Count</h3>
              <p>
                Recruiters spend an average of 6 seconds reviewing a resume. 
                A professionally designed resume ensures you make those seconds count.
              </p>
            </div>

            <div className="importance-card">
              <div className="card-icon green">
                <TrendingUp size={28} />
              </div>
              <h3>Beat the ATS Systems</h3>
              <p>
                75% of resumes never reach human eyes due to Applicant Tracking Systems. 
                Our optimized format ensures your resume gets through.
              </p>
            </div>

            <div className="importance-card">
              <div className="card-icon purple">
                <Users size={28} />
              </div>
              <h3>Stand Out from Competition</h3>
              <p>
                On average, 250 resumes are submitted for every corporate job posting. 
                A polished resume helps you rise above the crowd.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-subtitle">
            Professional tools designed to help you create the perfect resume
          </p>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Sparkles size={24} />
              </div>
              <div className="feature-content">
                <h3>AI-Powered Content</h3>
                <p>Let AI enhance your resume with professional summaries and achievements</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <FileText size={24} />
              </div>
              <div className="feature-content">
                <h3>Multiple Templates</h3>
                <p>Choose from modern, classic, minimal, and creative designs</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <CheckCircle size={24} />
              </div>
              <div className="feature-content">
                <h3>ATS-Optimized</h3>
                <p>Ensure your resume passes Applicant Tracking Systems</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <div className="feature-content">
                <h3>Real-time Preview</h3>
                <p>See changes instantly as you build your resume</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <FileText size={24} />
              </div>
              <div className="feature-content">
                <h3>Export to PDF/Word</h3>
                <p>Download your resume in multiple formats</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <TrendingUp size={24} />
              </div>
              <div className="feature-content">
                <h3>Analytics Dashboard</h3>
                <p>Track views, downloads, and engagement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Land Your Dream Job?</h2>
          <p>Join thousands of professionals who've created winning resumes with ResumeBuilder</p>
          <Link to="/register" className="btn-cta">
            Create Your Resume Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <FileText size={24} />
              <span>ResumeBuilder</span>
            </div>
            <p className="footer-text">© 2026 ResumeBuilder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
