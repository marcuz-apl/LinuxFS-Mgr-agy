import React from 'react';
import { HardDrive, Eject, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { MountRecord } from '../types/disk';

interface ActiveMountsTableProps {
  mounts: MountRecord[];
  onUnmount: (mount: MountRecord) => void;
}

export const ActiveMountsTable: React.FC<ActiveMountsTableProps> = ({ mounts, onUnmount }) => {
  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="glass-panel" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={22} color="var(--fluent-emerald)" />
            <span>Active Virtual Drives & Mounted Volumes</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Real-time Windows Drive Letter mapping table and filesystem status
          </p>
        </div>

        <div className="badge badge-emerald">
          {mounts.length} Active Mount(s)
        </div>
      </div>

      {mounts.length === 0 ? (
        <div style={{ padding: 48, textAlign: 'center', background: '#0f172a', borderRadius: 8, border: '1px dashed var(--fluent-card-border)' }}>
          <HardDrive size={40} color="var(--text-muted)" style={{ marginBottom: 12 }} />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            No Active Virtual Drive Letter Mappings
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Select an Ext4 partition from Physical Drives or load a Linux Disk Image to assign a Windows Drive Letter (e.g. Z:).
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Drive Letter</th>
                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Source Volume / File</th>
                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Engine</th>
                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Access Protection</th>
                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Mounted Since</th>
                <th style={{ padding: '8px 16px', textAlign: 'left' }}>Data Throughput</th>
                <th style={{ padding: '8px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mounts.map((m) => (
                <tr
                  key={m.id}
                  style={{ background: 'var(--fluent-card-bg)', borderRadius: 6 }}
                >
                  <td style={{ padding: '14px 16px', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--fluent-accent-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <HardDrive size={18} />
                      <span>{m.target_drive_letter}</span>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.source_path}</div>
                    <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {m.wsl_mount_name}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                      <Cpu size={12} />
                      <span>{m.mount_engine}</span>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    {m.is_read_only ? (
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        <ShieldCheck size={12} /> Read-Only
                      </span>
                    ) : (
                      <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                        Read-Write
                      </span>
                    )}
                  </td>

                  <td className="mono" style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {m.mount_time}
                  </td>

                  <td className="mono" style={{ padding: '14px 16px', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--fluent-emerald)' }}>↓ {formatBytes(m.bytes_read)}</span>
                    <span style={{ color: 'var(--fluent-accent-light)', marginLeft: 8 }}>↑ {formatBytes(m.bytes_written)}</span>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right', borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => onUnmount(m)}
                    >
                      <Eject size={14} />
                      <span>Unmount & Eject</span>
                    </button>
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
