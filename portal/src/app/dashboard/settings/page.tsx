'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Smartphone,
  ChevronRight,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  return (
    <div className="settings-view">
      <div className="view-header">
        <h2>Settings</h2>
        <p>Manage your account, preferences, and data synchronization.</p>
      </div>

      <div className="settings-grid">
        <section className="settings-section">
          <h3>Account Profile</h3>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-icon">
                <User size={20} />
              </div>
              <div className="setting-info">
                <label>Email Address</label>
                <span>{user?.email}</span>
              </div>
              <button className="text-btn">Change</button>
            </div>
            
            <div className="setting-item">
              <div className="setting-icon">
                <Lock size={20} />
              </div>
              <div className="setting-info">
                <label>Password</label>
                <span>••••••••••••</span>
              </div>
              <button className="text-btn">Update</button>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h3>App Synchronization</h3>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-icon sync">
                <Smartphone size={20} />
              </div>
              <div className="setting-info">
                <label>Mobile App Status</label>
                <div className="status-indicator">
                  <div className="dot active" />
                  <span>Connected</span>
                </div>
              </div>
              <div className="sync-chip">Synced 2m ago</div>
            </div>

            <div className="setting-item">
              <div className="setting-icon db">
                <Database size={20} />
              </div>
              <div className="setting-info">
                <label>Cloud Storage Usage</label>
                <div className="progress-mini">
                  <div className="progress-bar" style={{ width: '12%' }} />
                </div>
                <span className="info-text">1.2 GB of 10 GB used</span>
              </div>
              <ChevronRight size={20} className="arrow" />
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h3>Preferences</h3>
          <div className="settings-card">
            <div className="setting-item toggle">
              <div className="setting-info">
                <label>Email Notifications</label>
                <p>Receive weekly summary reports via email.</p>
              </div>
              <div className="toggle-switch active">
                <div className="toggle-handle" />
              </div>
            </div>

            <div className="setting-item toggle">
              <div className="setting-info">
                <label>Dark Mode</label>
                <p>Synchronize portal appearance with your system.</p>
              </div>
              <div className="toggle-switch">
                <div className="toggle-handle" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .settings-view {
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .view-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0F172A;
        }

        .view-header p {
          color: #64748B;
          font-size: 0.95rem;
        }

        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .settings-section h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .settings-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        .setting-item {
          display: flex;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #F1F5F9;
          gap: 1.5rem;
        }

        .setting-item:last-child { border-bottom: none; }

        .setting-icon {
          width: 44px;
          height: 44px;
          background: #F1F5F9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
        }

        .setting-icon.sync { background: #F0FDF4; color: #10B981; }
        .setting-icon.db { background: #EFF6FF; color: #3B82F6; }

        .setting-info { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
        .setting-info label { font-size: 0.9rem; font-weight: 700; color: #1E293B; }
        .setting-info span { color: #64748B; font-size: 0.95rem; }
        .setting-info p { font-size: 0.85rem; color: #64748B; margin: 0; }

        .text-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .status-indicator { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 600; color: #10B981; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.active { background: #10B981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }

        .sync-chip {
          background: #F1F5F9;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748B;
        }

        .progress-mini {
          width: 200px;
          height: 6px;
          background: #F1F5F9;
          border-radius: 10px;
          overflow: hidden;
          margin: 0.25rem 0;
        }

        .progress-bar { height: 100%; background: #3B82F6; }
        .info-text { font-size: 0.75rem !important; color: #94A3B8 !important; }

        .arrow { color: #CBD5E1; }

        .toggle-switch {
          width: 44px;
          height: 24px;
          background: #E2E8F0;
          border-radius: 20px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-switch.active { background: #10B981; }
        .toggle-handle {
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: all 0.2s;
        }

        .toggle-switch.active .toggle-handle { transform: translateX(20px); }
      `}</style>
    </div>
  );
}
