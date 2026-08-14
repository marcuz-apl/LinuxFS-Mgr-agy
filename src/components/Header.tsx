import React from 'react';
import { HardDrive, ShieldCheck, ShieldAlert, RefreshCw, Cpu } from 'lucide-react';
import { SystemScanResult } from '../types/disk';
import packageJson from '../../package.json';

interface HeaderProps {
  scanResult: SystemScanResult | null;
  onRefresh: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({ scanResult, onRefresh, isScanning }) => {
  const [appVersion, setAppVersion] = useState('1.1.9');

  return (
    <header className="glass-panel app-header">
      <div className="header-brand">
        <div className="brand-logo-container">
          <HardDrive size={24} />
        </div>
        <div>
          <h1 className="brand-title">LinuxFS Manager <span style={{ fontSize: '0.78rem', color: 'var(--accent-light)', background: 'var(--accent-subtle)', padding: '2px 7px', borderRadius: 4, marginLeft: 6 }}>v{appVersion}</span></h1>
          <p className="brand-subtitle">Ext4 Partition Inspector & Virtual Drive Mount Engine</p>
        </div>
      </div>

      <div className="header-meta">
        {scanResult?.is_admin ? (
          <div className="badge badge-emerald" title="Windows Administrator Execution Level Active">
            <ShieldCheck size={13} />
            <span>Admin Active</span>
          </div>
        ) : (
          <div className="badge badge-amber" title="Standard User Execution Level">
            <ShieldAlert size={13} />
            <span>Standard User</span>
          </div>
        )}

        <div className="badge badge-cyan">
          <span className="pulse-dot pulse-dot-green" />
          <Cpu size={13} />
          <span>Native Win32 Engine (No WSL Required)</span>
        </div>

        <button
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={isScanning}
        >
          <RefreshCw size={14} className={isScanning ? 'spin' : ''} />
          <span>{isScanning ? 'Scanning...' : 'Rescan'}</span>
        </button>

        <div className="badge badge-violet mono">v{currentVersion}</div>
      </div>
    </header>
  );
};
