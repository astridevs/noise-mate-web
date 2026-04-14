'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo.png" alt="Noise Mate" className="login-logo" />
          <h1>Welcome Back</h1>
          <p>Login to access your noise logs and reports</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="magic-link-btn"
            onClick={handleMagicLink}
            disabled={loading || !email}
          >
            Send Magic Link
          </button>
        </form>

        <style jsx>{`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #F5F6FA;
            padding: 2rem;
          }

          .login-card {
            background: white;
            padding: 2.5rem;
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            width: 100%;
            max-width: 450px;
            position: relative;
            overflow: hidden;
          }

          .login-card::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, transparent 50%, #154c79 50%);
            clip-path: polygon(100% 0, 100% 100%, 0 0);
          }

          .login-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .login-logo {
            width: 80px;
            height: 80px;
            margin-bottom: 1.5rem;
            border-radius: 16px;
          }

          h1 {
            color: #0F172A;
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
          }

          p {
            color: #64748B;
            font-size: 0.95rem;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          label {
            font-size: 0.875rem;
            font-weight: 600;
            color: #475569;
          }

          input {
            padding: 0.75rem 1rem;
            border: 1.5px solid #E2E8F0;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.2s;
          }

          input:focus {
            outline: none;
            border-color: #154c79;
            box-shadow: 0 0 0 3px rgba(21, 76, 121, 0.1);
          }

          .login-btn {
            background: #154c79;
            color: white;
            padding: 0.75rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
          }

          .login-btn:hover {
            background: #0f3a5f;
          }

          .login-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .divider {
            display: flex;
            align-items: center;
            text-align: center;
            color: #94A3B8;
            font-size: 0.875rem;
          }

          .divider::before,
          .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid #E2E8F0;
          }

          .divider span {
            padding: 0 1rem;
          }

          .magic-link-btn {
            background: white;
            --primary: #164c78;
            color: var(--primary);
            padding: 0.75rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1rem;
            border: 1.5px solid var(--primary);
            cursor: pointer;
            transition: all 0.2s;
          }

          .magic-link-btn:hover {
            background: #F8FAFC;
          }

          .magic-link-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .error-message {
            color: #EF4444;
            font-size: 0.875rem;
            background: #FEF2F2;
            padding: 0.75rem;
            border-radius: 8px;
            border-left: 4px solid #EF4444;
          }

          .success-message {
            color: #10B981;
            font-size: 0.875rem;
            background: #F0FDF4;
            padding: 0.75rem;
            border-radius: 8px;
            border-left: 4px solid #10B981;
          }
        `}</style>
      </div>
    </div>
  );
}
