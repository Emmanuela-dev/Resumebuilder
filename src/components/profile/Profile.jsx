import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, User, Mail, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, signOut } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };
  
  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="header-content">
          <button className="btn-icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Profile Settings</h1>
        </div>
      </header>
      
      <main className="profile-main">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-placeholder">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" />
                ) : (
                  <User size={48} />
                )}
              </div>
              <button className="btn btn-outline">
                <Camera size={18} />
                Change Photo
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="full_name">
                  <User size={18} />
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ background: '#f7fafc', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#718096', fontSize: '0.85rem' }}>
                  Email cannot be changed
                </small>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="profile-card danger-zone">
            <h3>Account Actions</h3>
            <p>Manage your account settings</p>
            <button 
              className="btn btn-outline"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
