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
        <div className="brand-icon">
          <HardDrive size={24} />
        </div>
        <div>
          <h1 className="brand-title">LinuxFS Manager</h1>
          <p className="brand-subtitle">Ext4 Partition Inspector & Image Mount Utility</p>
        </div>
      </div>

      <div className="header-meta">
        {scanResult?.is_admin ? (
          <div className="badge badge-green" title="Administrator rights active - Full raw disk access enabled">
            <ShieldCheck size={14} />
            <span>Admin Active</span>
          </div>
        ) : (
          <div className="badge badge-amber" title="Limited privileges - UAC Administrator rights recommended">
            <ShieldAlert size={14} />
            <span>Standard User</span>
          </div>
        )}

        <div className="badge badge-cyan" title="Mount Engine Status">
          <Cpu size={14} />
          <span>WSL2 / WinFSP Ready</span>
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={onRefresh}
          disabled={isScanning}
        >
          <RefreshCw size={16} className={isScanning ? 'spin' : ''} />
          <span>{isScanning ? 'Scanning...' : 'Rescan Drives'}</span>
        </button>

        <div className="badge badge-purple mono">v1.0.2</div>
      </div>
    </header>
  );
};
