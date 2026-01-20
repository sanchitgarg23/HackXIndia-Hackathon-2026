"use client";
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Building2, Shield, Bell, Lock, Globe, Moon, Sun, Edit2, Camera, Save, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || 'Dr. Sarah Chen',
    email: user?.email || 'sarah.chen@hospital.com',
    role: user?.role || 'Senior Physician',
    department: user?.department || 'Emergency Medicine',
    hospital: 'General Hospital',
    licenseId: `MD-${user?.id || '2024-8472'}`
  });

  // Load profile photo from localStorage on mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        setProfilePhoto(photoData);
        // Save to localStorage
        localStorage.setItem('profilePhoto', photoData);
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('profilePhotoUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // Save form data to localStorage
    localStorage.setItem('profileData', JSON.stringify(formData));
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'Dr. Sarah Chen',
      email: user?.email || 'sarah.chen@hospital.com',
      role: user?.role || 'Senior Physician',
      department: user?.department || 'Emergency Medicine',
      hospital: 'General Hospital',
      licenseId: `MD-${user?.id || '2024-8472'}`
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-header-top">
          <div className="profile-header-content">
            <div className="profile-avatar-container">
              <div className="profile-avatar-large">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" />
                ) : (
                  user?.name?.charAt(0) || 'D'
                )}
              </div>
              <button 
                className="photo-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
                Change Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="profile-header-info">
              <h1>{formData.name}</h1>
              <p className="profile-role">{formData.role}</p>
              <p className="profile-department">
                <Building2 size={16} />
                {formData.department}
              </p>
            </div>
          </div>
          {!isEditing && activeTab === 'profile' && (
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">247</span>
            <span className="stat-label">Cases Reviewed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">98.5%</span>
            <span className="stat-label">Accuracy Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">4.2</span>
            <span className="stat-label">Avg Response Time</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          Profile Information
        </button>
        <button 
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={18} />
          Security & Privacy
        </button>
        <button 
          className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <Bell size={18} />
          Preferences
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-card">
              <div className="section-header">
                <h2>Personal Information</h2>
                {isEditing && (
                  <div className="edit-actions">
                    <button className="btn-cancel" onClick={handleCancel}>
                      <X size={16} />
                      Cancel
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
              
              {isEditing ? (
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="info-item">
                    <label>Medical License ID</label>
                    <input
                      type="text"
                      name="licenseId"
                      value={formData.licenseId}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="info-item">
                    <label>Specialization</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="info-item">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="info-item">
                    <label>Hospital/Organization</label>
                    <input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                      className="edit-input"
                    />
                  </div>
                </div>
              ) : (
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <div className="info-value">{formData.name}</div>
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <div className="info-value">{formData.email}</div>
                  </div>
                  <div className="info-item">
                    <label>Medical License ID</label>
                    <div className="info-value">{formData.licenseId}</div>
                  </div>
                  <div className="info-item">
                    <label>Specialization</label>
                    <div className="info-value">{formData.role}</div>
                  </div>
                  <div className="info-item">
                    <label>Department</label>
                    <div className="info-value">{formData.department}</div>
                  </div>
                  <div className="info-item">
                    <label>Hospital/Organization</label>
                    <div className="info-value">{formData.hospital}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="section-card">
              <h2>Professional Credentials</h2>
              <div className="credentials-list">
                <div className="credential-item">
                  <div className="credential-icon">
                    <Shield size={20} />
                  </div>
                  <div className="credential-info">
                    <h3>Board Certified - Emergency Medicine</h3>
                    <p>American Board of Emergency Medicine • Valid until 2027</p>
                  </div>
                  <span className="credential-badge verified">Verified</span>
                </div>
                <div className="credential-item">
                  <div className="credential-icon">
                    <Shield size={20} />
                  </div>
                  <div className="credential-info">
                    <h3>Medical License</h3>
                    <p>State Medical Board • Active</p>
                  </div>
                  <span className="credential-badge verified">Verified</span>
                </div>
                <div className="credential-item">
                  <div className="credential-icon">
                    <Shield size={20} />
                  </div>
                  <div className="credential-info">
                    <h3>HIPAA Compliance Training</h3>
                    <p>Completed 2024 • Annual renewal required</p>
                  </div>
                  <span className="credential-badge verified">Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="profile-section">
            <div className="section-card">
              <h2>Security Settings</h2>
              <div className="security-list">
                <div className="security-item">
                  <div className="security-info">
                    <h3>Password</h3>
                    <p>Last changed 45 days ago</p>
                  </div>
                  <button className="btn-secondary">Change Password</button>
                </div>
                <div className="security-item">
                  <div className="security-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
                <div className="security-item">
                  <div className="security-info">
                    <h3>Active Sessions</h3>
                    <p>Manage devices where you're currently logged in</p>
                  </div>
                  <button className="btn-secondary">View Sessions</button>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h2>Privacy Settings</h2>
              <div className="privacy-list">
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h3>Data Sharing</h3>
                    <p>Control how your data is used for platform improvements</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h3>Activity Tracking</h3>
                    <p>Allow system to track activity for analytics</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="profile-section">
            <div className="section-card">
              <h2>Notification Preferences</h2>
              <div className="preference-list">
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>High Priority Cases</h3>
                    <p>Receive alerts for urgent patient cases</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Case Updates</h3>
                    <p>Get notified when assigned cases are updated</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Email Notifications</h3>
                    <p>Receive email summaries of daily activity</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="section-card">
              <h2>Display Settings</h2>
              <div className="preference-list">
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Language</h3>
                    <p>Choose your preferred language</p>
                  </div>
                  <select className="preference-select">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Theme</h3>
                    <p>Select your preferred color scheme</p>
                  </div>
                  <div className="theme-options">
                    <button className="theme-btn active">
                      <Sun size={16} />
                      Light
                    </button>
                    <button className="theme-btn">
                      <Moon size={16} />
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-header {
          background: white;
          border-radius: 16px;
          padding: 40px;
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
        }

        .profile-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .profile-header-content {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .profile-avatar-large {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 36px;
          font-weight: 700;
          overflow: hidden;
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-avatar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .photo-upload-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .photo-upload-btn:hover {
          background: #F8FAFC;
          border-color: var(--primary);
          color: var(--primary);
        }

        .edit-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .edit-profile-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          margin: 0;
        }

        .edit-actions {
          display: flex;
          gap: 12px;
        }

        .btn-cancel,
        .btn-save {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: white;
          border: 1.5px solid var(--border-color);
          color: var(--text-secondary);
        }

        .btn-cancel:hover {
          background: #F8FAFC;
          border-color: #DC2626;
          color: #DC2626;
        }

        .btn-save {
          background: var(--primary);
          color: white;
          border: none;
        }

        .btn-save:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .edit-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
          color: var(--text-primary);
          background: white;
          transition: all 0.2s;
        }

        .edit-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .profile-header-info h1 {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .profile-role {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .profile-department {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          padding-top: 32px;
          border-top: 1px solid var(--border-color);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary);
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-muted);
        }

        .profile-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          background: white;
          padding: 8px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-button:hover {
          background: #F8FAFC;
          color: var(--text-primary);
        }

        .tab-button.active {
          background: var(--primary);
          color: white;
        }

        .profile-content {
          min-height: 400px;
        }

        .profile-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid var(--border-color);
        }

        .section-card h2 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .info-item label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .credentials-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .credential-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #F8FAFC;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .credential-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          border: 1px solid var(--border-color);
        }

        .credential-info {
          flex: 1;
        }

        .credential-info h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .credential-info p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .credential-badge {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        .credential-badge.verified {
          background: #DCFCE7;
          color: #166534;
        }

        .security-list,
        .privacy-list,
        .preference-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .security-item,
        .privacy-item,
        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #F8FAFC;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .security-info h3,
        .privacy-info h3,
        .preference-info h3 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .security-info p,
        .privacy-info p,
        .preference-info p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .btn-secondary {
          padding: 10px 20px;
          background: white;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #F8FAFC;
          border-color: var(--primary);
          color: var(--primary);
        }

        .toggle-switch {
          position: relative;
          width: 48px;
          height: 28px;
          cursor: pointer;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #CBD5E1;
          border-radius: 28px;
          transition: 0.3s;
        }

        .toggle-slider:before {
          content: "";
          position: absolute;
          height: 20px;
          width: 20px;
          left: 4px;
          bottom: 4px;
          background: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle-switch input:checked + .toggle-slider {
          background: var(--primary);
        }

        .toggle-switch input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .preference-select {
          padding: 10px 16px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          background: white;
          cursor: pointer;
        }

        .theme-options {
          display: flex;
          gap: 8px;
        }

        .theme-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border: 1.5px solid var(--border-color);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .theme-btn.active {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
        }

        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
          }

          .profile-stats {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .profile-tabs {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
