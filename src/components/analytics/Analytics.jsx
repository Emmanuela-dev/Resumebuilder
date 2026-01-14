import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/resumeStore';
import { ArrowLeft, Eye, Download, MousePointer, Calendar, TrendingUp, Globe, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './Analytics.css';

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume, fetchResume } = useResumeStore();
  const [analytics, setAnalytics] = useState({
    views: [],
    downloads: [],
    linkClicks: [],
    totalViews: 0,
    totalDownloads: 0,
    totalClicks: 0,
    uniqueVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, week, month

  useEffect(() => {
    if (id) {
      fetchResume(id);
      fetchAnalytics();
    }
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Build date filter based on time range
      let dateFilter = null;
      if (timeRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = weekAgo.toISOString();
      } else if (timeRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = monthAgo.toISOString();
      }

      // Fetch analytics data
      let query = supabase
        .from('resume_analytics')
        .select('*')
        .eq('resume_id', id)
        .order('created_at', { ascending: false });

      if (dateFilter) {
        query = query.gte('created_at', dateFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process analytics data
      const views = data.filter(a => a.event_type === 'view');
      const downloads = data.filter(a => a.event_type === 'download');
      const linkClicks = data.filter(a => a.event_type === 'link_click');
      
      // Calculate unique visitors (by IP)
      const uniqueIPs = new Set(data.map(a => a.ip_address).filter(Boolean));

      setAnalytics({
        views,
        downloads,
        linkClicks,
        totalViews: views.length,
        totalDownloads: downloads.length,
        totalClicks: linkClicks.length,
        uniqueVisitors: uniqueIPs.size,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnalytics();
    }
  }, [timeRange, id]);

  const getRecentActivity = () => {
    const allEvents = [
      ...analytics.views.map(v => ({ ...v, type: 'view', icon: Eye, color: '#3182ce' })),
      ...analytics.downloads.map(d => ({ ...d, type: 'download', icon: Download, color: '#38a169' })),
      ...analytics.linkClicks.map(c => ({ ...c, type: 'link_click', icon: MousePointer, color: '#d69e2e' })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return allEvents.slice(0, 10);
  };

  const getEventLabel = (type) => {
    switch(type) {
      case 'view': return 'Resume Viewed';
      case 'download': return 'Resume Downloaded';
      case 'link_click': return 'Link Clicked';
      default: return type;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate(`/resume/${id}/edit`)}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Resume Analytics</h1>
            <p className="subtitle">{currentResume?.title}</p>
          </div>
        </div>
        
        <div className="time-range-selector">
          <button 
            className={`range-btn ${timeRange === 'all' ? 'active' : ''}`}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
          <button 
            className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Last Month
          </button>
          <button 
            className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Last Week
          </button>
        </div>
      </header>

      <div className="analytics-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ebf8ff', color: '#3182ce' }}>
              <Eye size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{analytics.totalViews}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#f0fff4', color: '#38a169' }}>
              <Download size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{analytics.totalDownloads}</div>
              <div className="stat-label">Downloads</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fffaf0', color: '#d69e2e' }}>
              <MousePointer size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{analytics.totalClicks}</div>
              <div className="stat-label">Link Clicks</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#faf5ff', color: '#805ad5' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{analytics.uniqueVisitors}</div>
              <div className="stat-label">Unique Visitors</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <h2>Recent Activity</h2>
          
          {getRecentActivity().length === 0 ? (
            <div className="empty-state">
              <Globe size={48} color="#cbd5e0" />
              <p>No activity yet</p>
              <small>Share your resume to start tracking analytics</small>
            </div>
          ) : (
            <div className="activity-list">
              {getRecentActivity().map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={index} className="activity-item">
                    <div className="activity-icon" style={{ background: `${event.color}20`, color: event.color }}>
                      <Icon size={16} />
                    </div>
                    <div className="activity-details">
                      <div className="activity-title">{getEventLabel(event.type)}</div>
                      <div className="activity-meta">
                        <span className="activity-time">
                          <Calendar size={12} />
                          {formatDate(event.created_at)}
                        </span>
                        {event.ip_address && (
                          <span className="activity-location">
                            <MapPin size={12} />
                            {event.ip_address}
                          </span>
                        )}
                        {event.referrer && (
                          <span className="activity-referrer">
                            via {new URL(event.referrer).hostname}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="analytics-summary">
          <h3>Engagement Rate</h3>
          <div className="engagement-stats">
            <div className="engagement-item">
              <span className="engagement-label">Views to Downloads</span>
              <span className="engagement-value">
                {analytics.totalViews > 0 
                  ? `${Math.round((analytics.totalDownloads / analytics.totalViews) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
            <div className="engagement-item">
              <span className="engagement-label">Average per Visitor</span>
              <span className="engagement-value">
                {analytics.uniqueVisitors > 0
                  ? (analytics.totalViews / analytics.uniqueVisitors).toFixed(1)
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
