import React from 'react';
import { HardDrive, Eject, ShieldCheck, Activity, Cpu, FolderOpen, Layers } from 'lucide-react';
import { MountRecord } from '../types/disk';

interface ActiveMountsTableProps {
  mounts: MountRecord[];
  onUnmount: (mount: MountRecord) => void;
  onOpenExplorer?: (mount: MountRecord) => void;
  onBrowseExt4?: (mount: MountRecord) => void;
}

export const ActiveMountsTable: React.FC<ActiveMountsTableProps> = ({
  mounts,
  onUnmount,
  onOpenExplorer,
  onBrowseExt4,
}) => {
  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="glass-panel" style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
            <Activity size={20} color="var(--emerald)" />
            <span>Active Virtual Drives & Mounted Volumes</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Real-time Windows Drive Letter mapping, File Explorer integration, and Ext4 filesystem status
          </p>
        </div>
        <div className="badge badge-emerald">{mounts.length} Active Mount(s)</div>
      </div>

      {mounts.length === 0 ? (
        <div style={{ padding: 44, textAlign: 'center', background: 'var(--bg-inset)', borderRadius: 8, border: '1px dashed var(--border)' }}>
          <HardDrive size={36} color="var(--text-muted)" style={{ marginBottom: 10 }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>No Active Virtual Drive Letter Mappings</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Select an Ext4 partition from Physical Drives or load a Linux Disk Image to assign a Windows Drive Letter.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '6px 14px', textAlign: 'left' }}>Drive Letter</th>
                <th style={{ padding: '6px 14px', textAlign: 'left' }}>Source</th>
                <th style={{ padding: '6px 14px', textAlign: 'left' }}>Engine</th>
                <th style={{ padding: '6px 14px', textAlign: 'left' }}>Access</th>
                <th style={{ padding: '6px 14px', textAlign: 'left' }}>Mounted Since</th>
                <th style={{ padding: '6px 14px', textAlign: 'left' }}>Throughput</th>
                <th style={{ padding: '6px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mounts.map((m) => (
                <tr key={m.id} style={{ background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <td style={{ padding: '12px 14px', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
                    <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <HardDrive size={16} /><span>{m.target_drive_letter}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{m.source_path}</div>
                    <div className="mono" style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{m.wsl_mount_name}</div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div className="badge badge-violet" style={{ fontSize: '0.68rem' }}>
                      <Cpu size={11} /><span>{m.mount_engine}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {m.is_read_only ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}><ShieldCheck size={11} /> Read-Only</span>
                    ) : (
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>Read-Write</span>
                    )}
                  </td>
                  <td className="mono" style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.mount_time}</td>
                  <td className="mono" style={{ padding: '12px 14px', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--emerald)' }}>↓ {formatBytes(m.bytes_read)}</span>
                    <span style={{ color: 'var(--accent-light)', marginLeft: 8 }}>↑ {formatBytes(m.bytes_written)}</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '5px 9px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5 }}
                        title="Open in Windows File Explorer"
                        onClick={() => onOpenExplorer && onOpenExplorer(m)}
                      >
                        <FolderOpen size={13} color="var(--accent-light)" />
                        <span>Explorer</span>
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '5px 9px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5 }}
                        title="Browse files inside LinuxFS Manager"
                        onClick={() => onBrowseExt4 && onBrowseExt4(m)}
                      >
                        <Layers size={13} color="var(--emerald)" />
                        <span>Browse</span>
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '5px 9px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5 }}
                        title="Safely unmount and flush buffers"
                        onClick={() => onUnmount(m)}
                      >
                        <Eject size={13} />
                        <span>Unmount</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

