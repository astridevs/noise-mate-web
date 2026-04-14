'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  FileText, 
  ChevronRight, 
  Download, 
  ExternalLink,
  Plus,
  Clock,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchReports() {
      const { data } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setReports(data);
      setLoading(false);
    }
    fetchReports();
  }, []);

  return (
    <div className="reports-view">
      <div className="view-header">
        <div className="header-text">
          <h2>Evidence Reports</h2>
          <p>Manage your noise complaint cases and evidence packages.</p>
        </div>
        <Link href="/dashboard/reports/new" className="primary-btn">
          <Plus size={18} />
          <span>New Report Case</span>
        </Link>
      </div>

      <div className="reports-grid">
        {loading ? (
          <div className="loading">Loading reports...</div>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-badge">Professional</div>
              <div className="report-content">
                <div className="report-icon">
                  <FileText size={32} />
                </div>
                <div className="report-details">
                  <h3>{report.case_name || `${report.noise_type} @ ${report.source_address.split(',')[0]}`}</h3>
                  <div className="report-meta">
                    <span><Clock size={14} /> {new Date(report.created_at).toLocaleDateString()}</span>
                    <span><MapPin size={14} /> {report.source_address}</span>
                  </div>
                </div>
              </div>
              <div className="report-stats">
                <div className="stat">
                  <span className="stat-value">{report.noise_log_ids?.length || 0}</span>
                  <span className="stat-label">INCIDENTS</span>
                </div>
                <div className="divider" />
                <div className="stat">
                  <span className="stat-value">PDF</span>
                  <span className="stat-label">FORMAT</span>
                </div>
              </div>
              <div className="report-actions">
                <button className="action-btn secondary">
                  <Download size={18} />
                  <span>Download PDF</span>
                </button>
                <button className="action-btn primary">
                  <ExternalLink size={18} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FileText size={48} />
            </div>
            <h3>No Reports Yet</h3>
            <p>You haven't generated any evidence reports yet. Start the report wizard to create your first case.</p>
            <Link href="/dashboard/reports/new" className="primary-btn-outline">
              Start Report Wizard
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        .reports-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-text h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 0.25rem;
        }

        .header-text p {
          color: #64748B;
          font-size: 0.95rem;
        }

        .primary-btn {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .primary-btn:hover {
          background: #0f3a5f;
          transform: translateY(-2px);
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .report-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          padding: 1.5rem;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.2s;
        }

        .report-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          border-color: var(--primary);
        }

        .report-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: #F0FDF4;
          color: #16A34A;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .report-content {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .report-icon {
          width: 64px;
          height: 64px;
          background: #F1F5F9;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .report-details h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .report-meta {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .report-meta span {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .report-stats {
          display: flex;
          background: #F8FAFC;
          border-radius: 12px;
          padding: 1rem;
          justify-content: space-around;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0F172A;
        }

        .stat-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94A3B8;
        }

        .report-stats .divider {
          width: 1px;
          background: #E2E8F0;
        }

        .report-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .action-btn {
          padding: 0.6rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: var(--primary);
          color: white;
          border: none;
        }

        .action-btn.secondary {
          background: white;
          border: 1px solid #E2E8F0;
          color: #475569;
        }

        .action-btn:hover { opacity: 0.9; transform: scale(1.02); }

        .empty-state {
          grid-column: 1 / -1;
          background: white;
          padding: 4rem;
          border-radius: 24px;
          border: 2px dashed #E2E8F0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          color: #64748B;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: #F8FAFC;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: #CBD5E1;
        }

        .empty-state h3 { color: #1E293B; margin-bottom: 0.5rem; }
        .empty-state p { max-width: 400px; margin-bottom: 2rem; }

        .primary-btn-outline {
          background: transparent;
          border: 2px solid var(--primary);
          color: var(--primary);
          padding: 0.75rem 1.75rem;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
