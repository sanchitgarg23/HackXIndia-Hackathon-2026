"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Shield, Moon } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <header className="auth-page-header">
        <div className="auth-brand-logo">
          <div className="brand-icon-box">
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <span className="brand-text">MedCore.</span>
        </div>
        <div className="system-status">
          <span className="status-dot"></span>
          <span className="status-text">SYSTEM SECURE</span>
        </div>
        <button className="theme-toggle">
          <Moon size={18} />
        </button>
      </header>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-icon">
            <Shield size={32} strokeWidth={2} />
          </div>

          <h1 className="auth-card-title">Welcome Back</h1>
          <p className="auth-card-subtitle">Access your clinical dashboard and case files</p>

          <form onSubmit={handleSubmit} className="auth-card-form">
            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">Work Email</label>
              <div className="input-container">
                <Mail size={18} className="input-prefix-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor.name@hospital.com"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <div className="field-header">
                <label htmlFor="password">Password</label>
                <Link href="#" className="reset-link">Reset password</Link>
              </div>
              <div className="input-container">
                <Lock size={18} className="input-prefix-icon" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Remember this device for 30 days</label>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in to Dashboard'}
              <Shield size={16} />
            </button>
          </form>

          <div className="auth-security-badge">
            <Lock size={14} />
            <span>256-BIT HIPAA COMPLIANT ENCRYPTION</span>
          </div>

          <div className="auth-card-footer">
            <span>New to the platform?</span>
            <Link href="/signup">Create your provider account</Link>
          </div>
        </div>

        <div className="auth-disclaimer">
          MEDCORE IS A PROFESSIONAL DECISION SUPPORT TOOL. <strong>NOT FOR EMERGENCY RESPONSE.</strong>
        </div>

        <div className="auth-links">
          <Link href="#">Security Policy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Technical Support</Link>
        </div>
      </main>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: #F5F7FA;
          display: flex;
          flex-direction: column;
        }

        .auth-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          background: white;
          border-bottom: 1px solid #E5E9F0;
        }

        .auth-brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon-box {
          width: 40px;
          height: 40px;
          background: #2563EB;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .brand-text {
          font-size: 20px;
          font-weight: 700;
          color: #1E293B;
        }

        .system-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-text {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          letter-spacing: 0.5px;
        }

        .theme-toggle {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #F8FAFC;
          border: 1px solid #E5E9F0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-toggle:hover {
          background: #EFF3F8;
          color: #1E293B;
        }

        .auth-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: white;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #E5E9F0;
        }

        .auth-card-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563EB;
          margin: 0 auto 32px;
        }

        .auth-card-title {
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          text-align: center;
          margin-bottom: 8px;
        }

        .auth-card-subtitle {
          font-size: 14px;
          color: #64748B;
          text-align: center;
          margin-bottom: 40px;
        }

        .auth-card-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .auth-error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #FEF2F2;
          border: 1px solid #FEE2E2;
          border-radius: 12px;
          color: #DC2626;
          font-size: 13px;
          font-weight: 500;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-field label {
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
        }

        .reset-link {
          font-size: 13px;
          font-weight: 600;
          color: #2563EB;
          text-decoration: none;
        }

        .reset-link:hover {
          text-decoration: underline;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-prefix-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #64748B;
          pointer-events: none;
          z-index: 10;
        }

        .input-container input {
          width: 100%;
          height: 48px;
          padding: 0 16px 0 46px;
          border: 1.5px solid #E5E9F0;
          border-radius: 12px;
          font-size: 14px;
          color: #1E293B;
          background: #F8FAFC;
          transition: all 0.2s;
        }

        .input-container input::placeholder {
          color: #94A3B8;
        }

        .input-container input:focus {
          outline: none;
          border-color: #2563EB;
          background: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          border: 1.5px solid #CBD5E1;
          border-radius: 4px;
          cursor: pointer;
        }

        .form-checkbox label {
          font-size: 13px;
          color: #475569;
          cursor: pointer;
        }

        .auth-submit {
          width: 100%;
          padding: 16px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .auth-submit:hover:not(:disabled) {
          background: #1D4ED8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .auth-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #F1F5F9;
          color: #10B981;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .auth-card-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #64748B;
        }

        .auth-card-footer a {
          color: #2563EB;
          font-weight: 600;
          text-decoration: none;
          margin-left: 4px;
        }

        .auth-card-footer a:hover {
          text-decoration: underline;
        }

        .auth-disclaimer {
          max-width: 600px;
          text-align: center;
          font-size: 11px;
          color: #64748B;
          margin-top: 32px;
          letter-spacing: 0.3px;
        }

        .auth-links {
          display: flex;
          gap: 24px;
          margin-top: 16px;
        }

        .auth-links a {
          font-size: 13px;
          color: #64748B;
          text-decoration: none;
        }

        .auth-links a:hover {
          color: #1E293B;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
