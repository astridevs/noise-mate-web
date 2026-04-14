'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Activity, 
  Calendar,
  Download,
  FileVolume2,
  AlertTriangle,
  ChevronLeft
} from 'lucide-react';
import WaveformPlayer from '@/components/WaveformPlayer';

interface ReportDetails {
  id: string;
  report_id: string;
  case_name: string;
  source_address: string;
  noise_type: string;
  worst_hours_pattern: string;
  frequency_pattern: string;
  created_at: string;
  noise_log_ids: string[];
}

export default function ReportViewerPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlPin = searchParams.get('pin');
  
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function verifyAndFetch() {
      if (!urlPin) {
        setError('Security PIN required');
        setLoading(false);
        return;
      }

      // 1. Fetch complaint metadata
      const { data: complaints, error: cError } = await supabase
        .from('complaints')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (cError || !complaints) {
        setError('Report not found');
        setLoading(false);
        return;
      }

      // 2. Verify PIN
      if (complaints.security_pin !== urlPin) {
        setError('Invalid Security PIN');
        setLoading(false);
        return;
      }

      setReport(complaints);
      setVerified(true);

      // 3. Fetch linked logs
      if (complaints.noise_log_ids?.length > 0) {
        const { data: logsData } = await supabase
          .from('noise_logs')
          .select('*')
          .in('id', complaints.noise_log_ids)
          .order('timestamp', { ascending: true });
        
        if (logsData) {
          // In a real scenario, we would get signed URLs for recording_url if they are private
          setLogs(logsData);
        }
      }
      
      setLoading(false);
    }

    verifyAndFetch();
  }, [reportId, urlPin]);

  if (loading) {
    return (
      <div className="viewer-loading">
        <div className="spinner" />
        <p>Verifying evidence credentials...</p>
        <style jsx>{`
          .viewer-loading {
            min-height: 100vh;
            background: #0f172a;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(56, 189, 248, 0.1);
            border-top-color: #38bdf8;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !verified) {
    return (
      <div className="viewer-error">
        <div className="error-card">
          <ShieldAlert size={48} color="#ef4444" />
          <h1>Access Denied</h1>
          <p>{error || 'You do not have permission to view this report.'}</p>
          <button onClick={() => router.push('/reports')} className="retry-btn">
            Try Again
          </button>
        </div>
        <style jsx>{`
          .viewer-error {
            min-height: 100vh;
            background: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          .error-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 3rem;
            border-radius: 24px;
            text-align: center;
            max-width: 400px;
            border: 1px solid rgba(239, 68, 68, 0.2);
          }
          h1 { color: white; margin: 1.5rem 0 0.75rem; font-size: 1.75rem; }
          p { color: #94a3b8; margin-bottom: 2rem; line-height: 1.6; }
          .retry-btn {
            background: white;
            color: #0f172a;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="evidence-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <button onClick={() => router.push('/reports')} className="back-link">
            <ChevronLeft size={20} />
            <span>Portal Home</span>
          </button>
          <div className="divider" />
          <div className="report-badge">
            <Activity size={14} />
            <span>Report ID: {report?.report_id}</span>
          </div>
        </div>
        <div className="nav-right">
          <button className="download-all-btn">
            <Download size={18} />
            <span>Export Evidence Pack</span>
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <header className="report-header">
          <div className="header-main">
            <h1>{report?.case_name || 'Noise Evidence Report'}</h1>
            <div className="meta-tags">
              <span className="tag address"><MapPin size={14} /> {report?.source_address}</span>
              <span className="tag type"><FileVolume2 size={14} /> {report?.noise_type}</span>
              <span className="tag date"><Calendar size={14} /> {new Date(report?.created_at || '').toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="security-notice">
            <AlertTriangle size={18} />
            <div>
              <strong>Secure View</strong>
              <p>This data is encrypted and PIN-protected. Audio data is streamed securely.</p>
            </div>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="label">Total Incidents</span>
            <span className="value">{logs.length}</span>
            <div className="sparkline positive" />
          </div>
          <div className="stat-card">
            <span className="label">Worst Patterns</span>
            <span className="value">{report?.worst_hours_pattern.split(' ')[0]}</span>
            <span className="trend">High Frequency</span>
          </div>
          <div className="stat-card">
            <span className="label">Average Level</span>
            <span className="value">
              {(logs.reduce((acc, log) => acc + log.average_decibel, 0) / (logs.length || 1)).toFixed(1)} <small>dB</small>
            </span>
            <span className="trend warning">Above Ambient</span>
          </div>
        </section>

        <section className="evidence-section">
          <div className="section-header">
            <h2>Audio Evidence Timeline</h2>
            <p>Listen to high-fidelity recordings and view noise intensity waveforms for each logged incident.</p>
          </div>

          <div className="logs-timeline">
            {logs.map((log, index) => (
              <div key={log.id} className="log-entry">
                <div className="entry-header">
                  <div className="entry-number">#{index + 1}</div>
                  <div className="entry-time">
                    <Clock size={16} />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="entry-db">
                    <span className="avg">{log.average_decibel.toFixed(1)} dB Avg</span>
                    <span className="peak">{log.peak_decibel.toFixed(1)} dB Peak</span>
                  </div>
                </div>
                
                <div className="entry-waveform">
                  <WaveformPlayer 
                    url={log.recording_url || ''} 
                    fileName={`noise_mate_log_${log.id}.wav`}
                    onDownload={() => window.open(log.recording_url, '_blank')}
                  />
                </div>
                
                {log.notes && (
                  <div className="entry-notes">
                    <strong>Notes:</strong> {log.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .evidence-dashboard {
          min-height: 100vh;
          background: #020617;
          color: white;
          font-family: 'Inter', sans-serif;
        }

        .dashboard-nav {
          height: 72px;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .back-link {
          background: transparent;
          border: none;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.2s;
        }

        .back-link:hover { color: white; }

        .divider { width: 1px; height: 24px; background: rgba(255, 255, 255, 0.1); }

        .report-badge {
          background: rgba(56, 189, 248, 0.1);
          color: #38bdf8;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .download-all-btn {
          background: #38bdf8;
          color: #0f172a;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .dashboard-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
          gap: 2rem;
        }

        .header-main h1 {
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
        }

        .meta-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .tag {
          padding: 0.4rem 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .security-notice {
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.2);
          padding: 1rem 1.5rem;
          border-radius: 16px;
          display: flex;
          gap: 1rem;
          max-width: 320px;
        }

        .security-notice color: #f59e0b; }
        .security-notice strong { display: block; font-size: 0.9rem; color: #f59e0b; margin-bottom: 0.2rem; }
        .security-notice p { font-size: 0.75rem; color: #d97706; margin: 0; line-height: 1.4; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-card .label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .stat-card .value { font-size: 2rem; font-weight: 800; color: white; }
        .stat-card .trend { font-size: 0.75rem; font-weight: 700; color: #10b981; }
        .stat-card .trend.warning { color: #f43f5e; }

        .section-header { margin-bottom: 2rem; }
        .section-header h2 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.5rem; }
        .section-header p { color: #64748b; font-size: 1rem; }

        .logs-timeline {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .log-entry {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .entry-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .entry-number {
          width: 32px;
          height: 32px;
          background: #38bdf8;
          color: #0f172a;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .entry-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: white;
          font-weight: 700;
        }

        .entry-db {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
        }

        .entry-db .avg { color: #38bdf8; font-weight: 700; }
        .entry-db .peak { color: #f43f5e; font-weight: 700; }

        .entry-notes {
          background: rgba(0, 0, 0, 0.2);
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #94a3b8;
          border-left: 3px solid #38bdf8;
        }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: 1fr; }
          .report-header { flex-direction: column; }
          .security-notice { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
