import React from 'react';
import { HardDrive, ShieldCheck, ShieldAlert, RefreshCw, Cpu } from 'lucide-react';
import { SystemScanResult } from '../types/disk';

interface HeaderProps {
  scanResult: SystemScanResult | null;
  onRefresh: () => void;
  isScanning: boolean;
}

export const Header: React.FC<HeaderProps> = ({ scanResult, onRefresh, isScanning }) => {
  return (
    <header className="glass-panel app-header">
      <div className="header-brand">
        <div className="brand-logo-container">
          <HardDrive size={26} />
        </div>
        <div>
          <h1 className="brand-title text-gradient-cyan">LinuxFS Manager</h1>
          <p className="brand-subtitle">Ext4 Partition Inspector & Virtual Drive Mount Engine</p>
        </div>
      </div>

      <div className="header-meta">
        {scanResult?.is_admin ? (
          <div className="badge badge-emerald" title="Windows Administrator Execution Level Active">
            <ShieldCheck size={14} />
            <span>Admin Privileges Active</span>
          </div>
        ) : (
          <div className="badge badge-amber" title="Standard User Execution Level">
            <ShieldAlert size={14} />
            <span>Standard User Mode</span>
          </div>
        )}

        <div className="badge badge-cyan" style={{ gap: 8 }}>
          <span className="pulse-dot pulse-dot-green"></span>
          <Cpu size={14} />
          <span>WSL2 & WinFSP Ready</span>
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={onRefresh}
          disabled={isScanning}
        >
          <RefreshCw size={15} className={isScanning ? 'spin' : ''} />
          <span>{isScanning ? 'Scanning...' : 'Rescan System'}</span>
        </button>

        <div className="badge badge-violet mono" style={{ padding: '6px 12px' }}>v1.0.5</div>
      </div>
    </header>
  );
};
