'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Map as MapIcon, 
  FileText, 
  Settings, 
  LogOut, 
  PlusCircle,
  Bell,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Noise Mate" className="site-logo" />
          <span className="site-name">Noise Mate</span>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active">
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/logs" className="nav-item">
            <MapIcon size={20} />
            <span>Noise Logs</span>
          </Link>
          <Link href="/dashboard/reports" className="nav-item">
            <FileText size={20} />
            <span>Reports</span>
          </Link>
          <Link href="/dashboard/settings" className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link href="/Help" className="nav-item" style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>
            <FileText size={20} />
            <span>Help Center</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-search">
            <h1>Dashboard</h1>
          </div>
          <div className="header-actions">
            <button className="icon-btn">
              <PlusCircle size={20} />
            </button>
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <div className="avatar">
                <User size={20} />
              </div>
              <span className="user-email">{user?.email?.split('@')[0]}</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          {children}
        </div>
      </main>

      <style jsx global>{`
        :root {
          --sidebar-width: 260px;
          --primary: #164c78;
          --primary-light: rgba(22, 76, 120, 0.1);
          --bg-main: #F8FAFC;
          --border: #E2E8F0;
        }

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: var(--bg-main);
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: var(--sidebar-width);
          background: white;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .sidebar-header {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .site-logo {
          width: 32px;
          height: 32px;
          border-radius: 6px;
        }

        .site-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
        }

        .sidebar-nav {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #64748B;
          text-decoration: none;
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: var(--primary-light);
          color: var(--primary);
        }

        .nav-item.active {
          background: var(--primary);
          color: white;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--border);
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #EF4444;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 500;
          border-radius: 10px;
          transition: background 0.2s;
        }

        .logout-btn:hover {
          background: #FEF2F2;
        }

        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          display: flex;
          flex-direction: column;
        }

        .top-header {
          height: 70px;
          background: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .top-header h1 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1E293B;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .icon-btn {
          background: transparent;
          border: none;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .icon-btn:hover {
          color: var(--primary);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          border-left: 1px solid var(--border);
          cursor: pointer;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .user-profile:hover {
          background: #F1F5F9;
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 2px 8px rgba(21, 76, 121, 0.2);
        }

        .user-email {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1E293B;
          text-transform: capitalize;
        }

        .content-area {
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
