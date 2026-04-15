'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function ReportsLandingPage() {
  const [reportId, setReportId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId || !pin) {
      setError('Please enter both Report ID and PIN');
      return;
    }
    
    setLoading(true);
    // Navigate to the dynamic route
    router.push(`/reports/${reportId.toUpperCase()}?pin=${pin}`);
  };

  return (
    <div className="reports-portal">
      <div className="portal-container">
        <header className="portal-header">
          <div className="logo-section">
            <Image src="/logo.png" alt="Noise Mate" width={32} height={32} />
            <span className="brand">Noise Mate</span>
          </div>
          <div className="security-badge">
            <ShieldCheck size={14} />
            <span>SECURE ACCESS</span>
          </div>
        </header>

        <main className="portal-content">
          <div className="hero-section">
            <div className="icon-wrapper">
              <FileText size={40} />
            </div>
            <h1>Evidence Portal</h1>
            <p>Access your secure noise evidence records using the credentials from your report.</p>
          </div>

          <form className="access-form" onSubmit={handleAccess}>
            <div className="form-group">
              <label htmlFor="report-id">Report ID</label>
              <div className="input-wrapper">
                <FileText className="input-icon" size={18} />
                <input 
                  id="report-id"
                  type="text" 
                  placeholder="e.g. XYZ123" 
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pin">Security PIN</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  id="pin"
                  type="password" 
                  maxLength={6}
                  placeholder="6-digit pin" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="access-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Access Report'}
              <ArrowRight size={18} />
            </button>
          </form>

          <footer className="portal-footer">
            <p>Authorised access only. All sessions are encrypted and monitored for security purposes.</p>
            <div className="footer-links" style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem' }}>
              <a href="/help" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Help Center</a>
            </div>
          </footer>
        </main>
      </div>

      <style jsx>{`
        .reports-portal {
          --primary: #164c78;
          --primary-hover: #0f3a5f;
          --bg-portal: #F8FAFC;
          --card-bg: #FFFFFF;
          --card-border: #E2E8F0;
          --header-text: #0F172A;
          --body-text: #64748B;
          --input-bg: #F1F5F9;
          --input-border: #E2E8F0;
          --input-text: #1E293B;
          --shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);

          min-height: 100vh;
          background: var(--bg-portal);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          color: var(--header-text);
          font-family: 'Inter', -apple-system, sans-serif;
          transition: background 0.3s ease;
        }

        @media (prefers-color-scheme: dark) {
          .reports-portal {
            --bg-portal: #0F172A;
            --card-bg: #1E293B;
            --card-border: rgba(255, 255, 255, 0.05);
            --header-text: #F1F5F9;
            --body-text: #94A3B8;
            --input-bg: rgba(0, 0, 0, 0.2);
            --input-border: rgba(255, 255, 255, 0.1);
            --input-text: #FFFFFF;
            --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
        }

        .portal-container {
          width: 100%;
          max-width: 440px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 32px;
          padding: 2.5rem;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .portal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .brand {
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--primary);
          letter-spacing: -0.01em;
        }

        .security-badge {
          background: var(--primary-light, rgba(22, 76, 120, 0.1));
          color: var(--primary);
          padding: 0.4rem 0.75rem;
          border-radius: 100px;
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .icon-wrapper {
          width: 72px;
          height: 72px;
          background: var(--input-bg);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          color: var(--primary);
        }

        .hero-section h1 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: var(--header-text);
        }

        .hero-section p {
          color: var(--body-text);
          line-height: 1.6;
          font-size: 0.9rem;
        }

        .access-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--body-text);
          margin-left: 0.25rem;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1.1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--body-text);
          opacity: 0.7;
        }

        .input-wrapper input {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 14px;
          padding: 0.9rem 1rem 0.9rem 3.25rem;
          color: var(--input-text);
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(22, 76, 120, 0.1);
        }

        .access-btn {
          margin-top: 0.75rem;
          background: var(--primary);
          color: white;
          border: none;
          padding: 1.1rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .access-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }

        .access-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: #EF4444;
          font-size: 0.8rem;
          font-weight: 700;
          text-align: center;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.6rem;
          border-radius: 10px;
        }

        .portal-footer {
          margin-top: 2.5rem;
          text-align: center;
        }

        .portal-footer p {
          font-size: 0.7rem;
          color: var(--body-text);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
