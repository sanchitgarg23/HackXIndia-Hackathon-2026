"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
    { name: 'Patients', icon: <Users size={20} />, href: '/patients' },
    { name: 'Appointments', icon: <Calendar size={20} />, href: '/appointments' },
    { name: 'Settings', icon: <Settings size={20} />, href: '/settings' },
  ];

  // Load profile photo from localStorage
  useEffect(() => {
    const loadPhoto = () => {
      const savedPhoto = localStorage.getItem('profilePhoto');
      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }
    };

    // Load on mount
    loadPhoto();

    // Listen for storage changes (when photo is updated in another component)
    const handleStorageChange = (e) => {
      if (e.key === 'profilePhoto') {
        loadPhoto();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-window updates
    const handlePhotoUpdate = () => {
      loadPhoto();
    };
    
    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#2563EB"/>
            <path d="M12 7V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M7 12H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="brand-name">MedCore</span>
      </div>

      <div className="user-profile">
        <div className="profile-image">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: profilePhoto ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '16px',
            overflow: 'hidden'
          }}>
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              user?.name?.charAt(0) || 'D'
            )}
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name">{user?.name || 'Dr. Sarah Chen'}</div>
          <div className="profile-role">{user?.role || 'Senior Physician'}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href)) ||
            (item.href === '/patients' && pathname.startsWith('/patient/'));
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="nav-item" style={{ width: '100%' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
