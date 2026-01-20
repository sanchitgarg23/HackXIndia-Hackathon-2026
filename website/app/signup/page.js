"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Mail, AlertCircle, Shield, User, Building2, Lock } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.department
    );
    
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-page">
      <header className="auth-page-header">
        <div className="auth-brand-logo">
          <div className="brand-icon-box">
            <Shield size={20} strokeWidth={2.5} />
          </div>
          <span className="brand-text">MedCore</span>
        </div>
        <Link href="#" className="support-link">
          <Shield size={16} />
          Support
        </Link>
      </header>

      <main className="auth-main">
        <div className="auth-card signup-card">
          <div className="signup-badge">ENTERPRISE ENROLLMENT</div>

          <h1 className="auth-card-title">Create Clinical Account</h1>
          <p className="auth-card-subtitle">Register your professional credentials for secure platform access.</p>

          <form onSubmit={handleSubmit} className="auth-card-form">
            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="name">Full Name</label>
                <div className="input-container">
                  <User size={18} className="input-prefix-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Julian Reed"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="email">Work Email</label>
                <div className="input-container">
                  <Mail size={18} className="input-prefix-icon" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="reed@medical.org"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="role">Clinical Role</label>
              <div className="input-container">
                <Shield size={18} className="input-prefix-icon" />
                <select
                  id="role"
                  name="role"
                  className="select-input"
                  onChange={handleChange}
                >
                  <option value="">Select your professional role</option>
                  <option value="physician">Physician</option>
                  <option value="surgeon">Surgeon</option>
                  <option value="nurse">Registered Nurse</option>
                  <option value="specialist">Specialist</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="department">Organization / Hospital</label>
              <div className="input-container">
                <Building2 size={18} className="input-prefix-icon" />
                <input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Search or enter hospital name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <Lock size={18} className="input-prefix-icon" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">Confirm</label>
                <div className="input-container">
                  <Lock size={18} className="input-prefix-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="password-strength">
              <div className="strength-bars">
                <div className={`strength-bar ${strength >= 1 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${strength >= 2 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${strength >= 3 ? 'active' : ''}`}></div>
              </div>
              <span className="strength-label">SECURE CREDENTIALS</span>
              <span className="strength-requirement">8+ chars required</span>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Finalize Registration'}
              <span>→</span>
            </button>
          </form>

          <div className="auth-card-footer">
            <span>Already have an account?</span>
            <Link href="/login">Sign in</Link>
          </div>
        </div>

        <div className="auth-disclaimer">
          <strong>CLINICAL PROTOCOL:</strong> MedCore is a professional diagnostic resolution tool.
          Registration constitutes agreement to our Terms & Privacy. Identity verification via
          medical registry is required.
        </div>

        <div className="auth-footer-text">
          © 2024 MEDCORE SYSTEMS • ENCRYPTED CLINICAL DATA INFRASTRUCTURE
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

        .support-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #2563EB;
          text-decoration: none;
        }

        .support-link:hover {
          text-decoration: underline;
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
          max-width: 540px;
          background: white;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #E5E9F0;
        }

        .signup-badge {
          display: inline-block;
          padding: 6px 12px;
          background: #EFF6FF;
          color: #2563EB;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-radius: 6px;
          margin-bottom: 24px;
        }

        .auth-card-title {
          font-size: 28px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 8px;
        }

        .auth-card-subtitle {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 40px;
        }

        .auth-card-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          font-size: 13px;
          font-weight: 600;
          color: #1E293B;
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
          z-index: 10;
          pointer-events: none;
        }

        .input-container input,
        .select-input {
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

        .select-input {
          appearance: none;
          cursor: pointer;
        }

        .input-container input::placeholder {
          color: #94A3B8;
        }

        .input-container input:focus,
        .select-input:focus {
          outline: none;
          border-color: #2563EB;
          background: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
        }

        .strength-bars {
          display: flex;
          gap: 6px;
          flex: 1;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          background: #E5E9F0;
          border-radius: 2px;
          transition: all 0.3s;
        }

        .strength-bar.active {
          background: #10B981;
        }

        .strength-label {
          font-size: 11px;
          font-weight: 700;
          color: #10B981;
          letter-spacing: 0.5px;
        }

        .strength-requirement {
          font-size: 11px;
          color: #94A3B8;
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

        .auth-card-footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #F1F5F9;
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
          max-width: 640px;
          text-align: center;
          font-size: 11px;
          color: #64748B;
          margin-top: 32px;
          line-height: 1.6;
          letter-spacing: 0.2px;
        }

        .auth-footer-text {
          font-size: 11px;
          color: #94A3B8;
          margin-top: 16px;
          letter-spacing: 0.5px;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
