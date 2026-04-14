'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Search, 
  Filter, 
  Map as MapIcon, 
  List as ListIcon,
  ChevronRight,
  MoreVertical,
  Calendar
} from 'lucide-react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(true);
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await supabase
        .from('noise_logs')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (data) setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  useEffect(() => {
    if (viewMode === 'map' && !map.current && logs.length > 0) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-0.1276, 51.5074], // London fallback
        zoom: 12
      });

      map.current.on('load', () => {
        logs.forEach((log) => {
          if (log.longitude && log.latitude) {
            new mapboxgl.Marker({ color: '#154c79' })
              .setLngLat([log.longitude, log.latitude])
              .setPopup(new mapboxgl.Popup().setHTML(`
                <div style="padding: 10px;">
                  <h4 style="margin: 0 0 5px 0;">${log.tag || 'Noise Log'}</h4>
                  <p style="margin: 0; font-size: 14px; color: #154c79; font-weight: bold;">${log.average_decibel.toFixed(1)} dB</p>
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748B;">${new Date(log.timestamp).toLocaleString()}</p>
                </div>
              `))
              .addTo(map.current!);
          }
        });

        // Fit bounds if markers exist
        const coordinates = logs
          .filter(l => l.longitude && l.latitude)
          .map(l => [l.longitude, l.latitude] as [number, number]);
        
        if (coordinates.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          coordinates.forEach(coord => bounds.extend(coord));
          map.current?.fitBounds(bounds, { padding: 50 });
        }
      });
    }

    return () => {
      if (map.current) {
//        map.current.remove();
//        map.current = null;
      }
    };
  }, [viewMode, logs]);

  return (
    <div className="logs-view">
      <div className="view-header">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search logs by tag, notes or location..." />
        </div>
        
        <div className="view-controls">
          <button className="filter-btn">
            <Filter size={18} />
            <span>Filters</span>
          </button>
          
          <div className="mode-switch">
            <button 
              className={`mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon size={18} />
            </button>
            <button 
              className={`mode-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <MapIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="logs-content">
        {viewMode === 'list' ? (
          <div className="logs-table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Avg Level</th>
                  <th>Peak</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="log-row">
                      <td className="time-cell">
                        <div className="datetime">
                          <span className="date">{new Date(log.timestamp).toLocaleDateString()}</span>
                          <span className="time">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`tag-pill ${log.is_night_disturbance ? 'night' : ''}`}>
                          {log.tag || 'Unlabeled'}
                        </span>
                      </td>
                      <td>
                        <span className="db-text">{log.average_decibel.toFixed(1)} dB</span>
                      </td>
                      <td>
                        <span className="db-text peak">{log.peak_decibel.toFixed(1)} dB</span>
                      </td>
                      <td className="location-cell">
                        <MapPin size={14} />
                        <span>{log.location_name || 'Anonymized'}</span>
                      </td>
                      <td>
                        <button className="icon-btn-sm">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="empty-row">No noise logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="map-wrapper">
            <div ref={mapContainer} className="map-container" />
          </div>
        )}
      </div>

      <style jsx>{`
        .logs-view {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          height: calc(100vh - 140px);
        }

        .view-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .search-bar {
          flex: 1;
          position: relative;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .search-bar input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          background: white;
          font-size: 0.95rem;
        }

        .view-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          color: #64748B;
          font-weight: 600;
          cursor: pointer;
        }

        .mode-switch {
          display: flex;
          background: #F1F5F9;
          padding: 0.25rem;
          border-radius: 12px;
        }

        .mode-btn {
          padding: 0.5rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #164c78 0%, #0f3a5f 100%);
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .logs-table-container {
          background: white;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        .logs-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .logs-table th {
          padding: 1.25rem 1.5rem;
          background: #F8FAFC;
          color: #64748B;
          font-weight: 600;
          font-size: 0.875rem;
          border-bottom: 1px solid #E2E8F0;
        }

        .log-row {
          transition: background 0.2s;
        }

        .log-row:hover {
          background: #F8FAFC;
        }

        .log-row td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
          font-size: 0.95rem;
        }

        .datetime {
          display: flex;
          flex-direction: column;
        }

        .date { font-weight: 600; }
        .time { font-size: 0.8rem; color: #64748B; }

        .tag-pill {
          padding: 0.25rem 0.75rem;
          background: #E0F2FE;
          color: #0369A1;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .tag-pill.night {
          background: #EDE9FE;
          color: #6D28D9;
        }

        .db-text { font-weight: 700; }
        .db-text.peak { color: #EF4444; }

        .location-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748B;
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .map-wrapper {
          flex: 1;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #E2E8F0;
          background: white;
        }

        .map-container {
          width: 100%;
          height: 100%;
        }

        .icon-btn-sm {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .empty-row {
          text-align: center;
          padding: 4rem !important;
          color: #64748B;
        }
      `}</style>
    </div>
  );
}

function MapPin({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
