'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  MapPin, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const STEPS = [
  { id: 0, title: 'Case Selection', description: 'Link to existing or new case' },
  { id: 1, title: 'Noise Source', description: 'Address and noise type' },
  { id: 2, title: 'Intensity', description: 'Patterns and frequency' },
  { id: 3, title: 'Recipient', description: 'Where to send the report' },
  { id: 4, title: 'Preview', description: 'Review and generate' }
];

export default function NewReportPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    caseId: '',
    sourceAddress: '',
    noiseType: 'Loud Music',
    worstHours: 'Latenight (11pm-7am)',
    frequency: 'Daily',
    recipient: 'Local Council',
    caseName: ''
  });

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('noise_logs')
        .select('*')
        .order('timestamp', { ascending: false });
      if (data) setLogs(data);
    }
    fetchLogs();
  }, []);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    
    // Generate a 6-digit PIN and a short Report ID
    const securityPin = Math.floor(100000 + Math.random() * 900000).toString();
    const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 1. Create Complaint
    const { data: complaint, error: cError } = await supabase
      .from('complaints')
      .insert({
        source_address: formData.sourceAddress,
        noise_type: formData.noiseType,
        worst_hours_pattern: formData.worstHours,
        frequency_pattern: formData.frequency,
        recipient_name: formData.recipient,
        case_name: formData.caseName,
        noise_log_ids: selectedLogs,
        security_pin: securityPin,
        report_id: shortId,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (!cError) {
      router.push('/dashboard/reports');
    }
    setLoading(false);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        <header className="wizard-header">
          <div className="progress-bar">
            {STEPS.map((step) => (
              <div 
                key={step.id} 
                className={`progress-step ${step.id === currentStep ? 'active' : ''} ${step.id < currentStep ? 'completed' : ''}`}
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
              >
                <div className="step-circle">
                  {step.id < currentStep ? <CheckCircle2 size={16} /> : step.id + 1}
                </div>
                <span className="step-label">{step.title}</span>
              </div>
            ))}
          </div>
        </header>

        <main className="wizard-content">
          {currentStep === 0 && (
            <div className="step-view">
              <h2>Select Logs for Report</h2>
              <p>Choose the noise incidents you want to include in this evidence report.</p>
              
              <div className="logs-selector">
                {logs.map(log => (
                  <label key={log.id} className={`log-option ${selectedLogs.includes(log.id) ? 'selected' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={selectedLogs.includes(log.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedLogs([...selectedLogs, log.id]);
                        else setSelectedLogs(selectedLogs.filter(id => id !== log.id));
                      }}
                    />
                    <div className="log-info">
                      <span className="log-date">{new Date(log.timestamp).toLocaleString()}</span>
                      <span className="log-level">{log.average_decibel.toFixed(1)} dB</span>
                    </div>
                    <div className="log-tag">{log.tag || 'Noise'}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="step-view">
              <h2>Noise Source Details</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Source Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Flat 4, 123 Noise Street" 
                    value={formData.sourceAddress}
                    onChange={e => setFormData({...formData, sourceAddress: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Noise Type</label>
                  <select 
                    value={formData.noiseType}
                    onChange={e => setFormData({...formData, noiseType: e.target.value})}
                  >
                    <option>Loud Music</option>
                    <option>Parties</option>
                    <option>DIY / Construction</option>
                    <option>Barking Dogs</option>
                    <option>Alarms</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-view">
              <h2>Intensity & Frequency</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Worst Hours</label>
                  <select 
                    value={formData.worstHours}
                    onChange={e => setFormData({...formData, worstHours: e.target.value})}
                  >
                    <option>Mornings (7am-12pm)</option>
                    <option>Afternoons (12pm-5pm)</option>
                    <option>Evenings (5pm-11pm)</option>
                    <option>Latenight (11pm-7am)</option>
                    <option>Variable</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Frequency</label>
                  <select 
                    value={formData.frequency}
                    onChange={e => setFormData({...formData, frequency: e.target.value})}
                  >
                    <option>Daily</option>
                    <option>Multiple times a week</option>
                    <option>Weekends only</option>
                    <option>Occasional</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-view">
              <h2>Report Recipient</h2>
              <div className="form-group">
                <label>Submit to</label>
                <select 
                  value={formData.recipient}
                  onChange={e => setFormData({...formData, recipient: e.target.value})}
                >
                  <option>Local Council (ASB Team)</option>
                  <option>Landlord / Housing Assoc.</option>
                  <option>Environmental Health</option>
                  <option>Legal Representation</option>
                  <option>Personal Record</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-view confirmation">
              <CheckCircle2 size={48} className="success-icon" />
              <h2>Ready to Generate?</h2>
              <p>You have selected <strong>{selectedLogs.length} logs</strong> for this report.</p>
              <div className="summary-card">
                <div><strong>Source:</strong> {formData.sourceAddress}</div>
                <div><strong>Type:</strong> {formData.noiseType}</div>
                <div><strong>Recipient:</strong> {formData.recipient}</div>
              </div>
            </div>
          )}
        </main>

        <footer className="wizard-footer">
          <button 
            className="back-btn" 
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button 
              className="next-btn" 
              onClick={handleNext}
              disabled={currentStep === 0 && selectedLogs.length === 0}
            >
              <span>Next</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          )}
        </footer>

        <style jsx>{`
          .wizard-container {
            max-width: 800px;
            margin: 0 auto;
          }

          .wizard-card {
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #E2E8F0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            min-height: 500px;
          }

          .wizard-header {
            padding: 2rem;
            background: #F8FAFC;
            border-bottom: 1px solid #E2E8F0;
          }

          .progress-bar {
            display: flex;
            justify-content: space-between;
          }

          .progress-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
            position: relative;
          }

          .progress-step::after {
            content: '';
            position: absolute;
            top: 16px;
            left: 50%;
            width: 100%;
            height: 2px;
            background: #E2E8F0;
            z-index: 1;
          }

          .progress-step:last-child::after { display: none; }

          .step-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #E2E8F0;
            color: #64748B;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.875rem;
            position: relative;
            z-index: 2;
            transition: all 0.3s;
          }

          .progress-step.active .step-circle {
            background: var(--primary);
            color: white;
            box-shadow: 0 0 0 4px rgba(21, 76, 121, 0.1);
          }

          .progress-step.completed .step-circle {
            background: #10B981;
            color: white;
          }

          .step-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: #94A3B8;
          }

          .progress-step.active .step-label { color: var(--primary); }

          .wizard-content {
            padding: 3rem;
            flex: 1;
          }

          .step-view h2 {
            font-size: 1.5rem;
            font-weight: 800;
            color: #0F172A;
            margin-bottom: 0.5rem;
          }

          .step-view p {
            color: #64748B;
            margin-bottom: 2rem;
          }

          .logs-selector {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            max-height: 400px;
            overflow-y: auto;
            padding-right: 0.5rem;
          }

          .log-option {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border: 1.5px solid #E2E8F0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .log-option:hover { background: #F8FAFC; }
          .log-option.selected { border-color: var(--primary); background: #F0F9FF; }

          .log-info { display: flex; flex-direction: column; flex: 1; }
          .log-date { font-weight: 600; font-size: 0.9rem; }
          .log-level { font-size: 0.8rem; color: var(--primary); font-weight: 700; }
          .log-tag { font-size: 0.7rem; font-weight: 700; background: #E2E8F0; padding: 0.2rem 0.5rem; border-radius: 4px; }

          .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .form-group { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; }
          .form-group label { font-size: 0.875rem; font-weight: 600; color: #475569; }
          .form-group input, .form-group select {
            padding: 0.75rem;
            border: 1.5px solid #E2E8F0;
            border-radius: 10px;
            font-size: 0.95rem;
          }

          .summary-card {
            background: #F8FAFC;
            padding: 1.5rem;
            border-radius: 12px;
            margin-top: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            text-align: left;
          }

          .success-icon { color: #10B981; margin-bottom: 1.5rem; }

          .wizard-footer {
            padding: 1.5rem 3rem;
            background: #F8FAFC;
            border-top: 1px solid #E2E8F0;
            display: flex;
            justify-content: space-between;
          }

          .next-btn, .submit-btn {
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
          }

          .back-btn {
            background: white;
            border: 1px solid #E2E8F0;
            color: #64748B;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
}
