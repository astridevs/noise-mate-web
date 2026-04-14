'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  Activity, 
  MapPin, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    avgDb: 0,
    peakDb: 0,
    activeCases: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch stats
      const { data: logs } = await supabase
        .from('noise_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (logs) {
        const total = logs.length;
        const avg = total > 0 ? logs.reduce((acc: number, curr: any) => acc + curr.average_decibel, 0) / total : 0;
        const peak = total > 0 ? Math.max(...logs.map((l: any) => l.peak_decibel)) : 0;
        
        setStats({
          totalLogs: total,
          avgDb: Number(avg.toFixed(1)),
          peakDb: Number(peak.toFixed(1)),
          activeCases: 0 // Will implement with complaints
        });
        setRecentLogs(logs.slice(0, 5));
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading your data...</div>;

  return (
    <div className="dashboard-view">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon logs">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Logs</span>
            <span className="stat-value">{stats.totalLogs}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon avg">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Avg. Level</span>
            <span className="stat-value">{stats.avgDb} dB</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon peak">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Peak Level</span>
            <span className="stat-value text-red">{stats.peakDb} dB</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon map">
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Cases</span>
            <span className="stat-value">{stats.activeCases}</span>
          </div>
        </div>
      </div>

      <div className="sections-grid">
        {/* Recent Logs Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Recent Noise Logs</h2>
            <Link href="/dashboard/logs" className="view-all">View All</Link>
          </div>

          <div className="logs-list">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="log-notched-card">
                  <div className="log-main">
                    <div className="log-time">
                      <span className="day">{new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                      <span className="hour">{new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="log-details">
                      <div className="log-tag">{log.tag || 'Unlabeled Noise'}</div>
                      <div className="log-meta">
                        <MapPin size={12} />
                        <span>{log.location_name || 'No location data'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="log-db">
                    <span className="db-value">{log.average_decibel.toFixed(1)}</span>
                    <span className="db-label">dB</span>
                  </div>
                  <ChevronRight size={20} className="card-arrow" />
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No noise logs yet.</p>
                <button className="primary-btn-outline">
                  <Plus size={18} />
                  <span>Request Sync from App</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Reports & Exports Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Evidence Reports</h2>
            <Link href="/dashboard/reports" className="view-all">Manage Cases</Link>
          </div>

          <div className="reports-preview">
            <div className="report-promo-card">
              <h3>Professional Noise Reports</h3>
              <p>Generate professional documentation directly from your browser.</p>
              <button className="primary-btn">Start Report Wizard</button>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          border: 1px solid var(--border);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.logs { background: #E0F2FE; color: #0EA5E9; }
        .stat-icon.avg { background: #F0FDF4; color: #10B981; }
        .stat-icon.peak { background: #FEF2F2; color: #EF4444; }
        .stat-icon.map { background: #FAF5FF; color: #8B5CF6; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748B;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0F172A;
        }

        .text-red { color: #EF4444; }

        .sections-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2.5rem;
        }

        @media (max-width: 1024px) {
          .sections-grid { grid-template-columns: 1fr; }
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .view-all {
          font-size: 0.875rem;
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .log-notched-card {
          background: white;
          padding: 1.25rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid var(--border);
          transition: all 0.2s;
          cursor: pointer;
          position: relative;
        }

        .log-notched-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
          border-color: var(--primary);
        }

        .log-main {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .log-time {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
          border-right: 2px solid #F1F5F9;
          padding-right: 1.5rem;
        }

        .day {
          font-size: 0.75rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
        }

        .hour {
          font-size: 1rem;
          font-weight: 700;
          color: #0F172A;
        }

        .log-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .log-tag {
          font-weight: 700;
          color: #1E293B;
          font-size: 0.95rem;
        }

        .log-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #64748B;
          font-size: 0.75rem;
        }

        .log-db {
          display: flex;
          align-items: baseline;
          gap: 0.1rem;
          color: var(--primary);
          margin-left: auto;
          margin-right: 2.5rem;
        }

        .db-value {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .db-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .card-arrow { color: #CBD5E1; }

          background: linear-gradient(135deg, #164c78 0%, #0f3a5f 100%);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
        }

        .report-promo-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .report-promo-card p {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .primary-btn {
          background: white;
          color: var(--primary);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .primary-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem;
          background: white;
          border-radius: 20px;
          border: 2px dashed #E2E8F0;
          text-align: center;
          color: #64748B;
        }

        .primary-btn-outline {
          margin-top: 1rem;
          background: transparent;
          border: 1.5px solid var(--primary);
          color: var(--primary);
          padding: 0.6rem 1.2rem;
          border-radius: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: var(--primary);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
