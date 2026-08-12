import React, { useState, useEffect } from 'react';
import { Folder, FileText, ArrowLeft, Download, Layers } from 'lucide-react';
import { Ext4Entry } from '../types/disk';

interface Ext4FileBrowserProps {
  partitionName: string;
}

export const Ext4FileBrowser: React.FC<Ext4FileBrowserProps> = ({ partitionName }) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [entries, setEntries] = useState<Ext4Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Ext4Entry | null>(null);

  useEffect(() => { loadDirectory(currentPath); }, [currentPath]);

  const loadDirectory = (path: string) => {
    if (path === '/') {
      setEntries([
        { name: 'bin',  path: '/bin',  is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:20:00' },
        { name: 'boot', path: '/boot', is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:22:10' },
        { name: 'etc',  path: '/etc',  is_dir: true,  size_bytes: 12288,  permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-11 09:15:30' },
        { name: 'home', path: '/home', is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 11:00:00' },
        { name: 'mnt',  path: '/mnt',  is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 11:21:00' },
        { name: 'var',  path: '/var',  is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 12:45:00' },
      ]);
    } else if (path === '/mnt' || path.startsWith('/mnt/')) {
      setEntries([
        { name: 'hada',              path: '/mnt/hada',                is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000',     modified_time: '2026-08-12 11:21:00' },
        { name: 'backup_config.json', path: `${path}/backup_config.json`, is_dir: false, size_bytes: 14208,  permissions: 'rw-r--r--', owner_uid_gid: '1000:1000',     modified_time: '2026-08-12 10:14:22' },
        { name: 'kernel_dump.log',   path: `${path}/kernel_dump.log`, is_dir: false, size_bytes: 849201, permissions: 'rw-r--r--', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 08:30:11' },
      ]);
    } else {
      setEntries([
        { name: 'user_settings.conf', path: `${path}/user_settings.conf`, is_dir: false, size_bytes: 3512, permissions: 'rw-r--r--', owner_uid_gid: '1000:1000', modified_time: '2026-08-11 16:20:00' },
        { name: 'documents',          path: `${path}/documents`,          is_dir: true,  size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000', modified_time: '2026-08-12 09:00:00' },
      ]);
    }
  };

  const handleNavigateUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath('/' + parts.join('/'));
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  return (
    <div className="glass-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
            <Layers size={20} color="var(--accent-light)" />
            <span>Ext4 Browser — {partitionName}</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>Direct Linux Ext4 directory tree & file inspection</p>
        </div>
        <div className="badge badge-cyan mono">{currentPath}</div>
      </div>

      {/* Path Toolbar */}
      <div style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-inset)', borderRadius: 6, border: '1px solid var(--border)' }}>
        <button className="btn btn-secondary" style={{ padding: '5px 10px' }} onClick={handleNavigateUp} disabled={currentPath === '/'}>
          <ArrowLeft size={15} /><span>Up</span>
        </button>
        <div className="mono" style={{ fontSize: '0.88rem', color: 'var(--accent-light)', flexGrow: 1 }}>
          Ext4://{currentPath}
        </div>
      </div>

      {/* File Tree Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        {/* File List */}
        <div style={{ background: 'var(--bg-inset)', borderRadius: 6, border: '1px solid var(--border)', padding: 14, maxHeight: 420, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '6px 8px' }}>Name</th>
                <th style={{ padding: '6px 8px' }}>Permissions</th>
                <th style={{ padding: '6px 8px' }}>Owner</th>
                <th style={{ padding: '6px 8px' }}>Size</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.path}
                  style={{
                    cursor: 'pointer',
                    background: selectedEntry?.path === entry.path ? 'var(--accent-subtle)' : 'transparent',
                    borderBottom: '1px solid var(--border)',
                  }}
                  onClick={() => setSelectedEntry(entry)}
                  onDoubleClick={() => { if (entry.is_dir) setCurrentPath(entry.path); }}
                >
                  <td style={{ padding: '7px 8px', display: 'flex', alignItems: 'center', gap: 7, fontWeight: 500, color: 'var(--text-primary)' }}>
                    {entry.is_dir
                      ? <Folder size={16} color="var(--accent-light)" />
                      : <FileText size={16} color="var(--text-muted)" />}
                    <span>{entry.name}</span>
                  </td>
                  <td className="mono" style={{ padding: '7px 8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.permissions}</td>
                  <td className="mono" style={{ padding: '7px 8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.owner_uid_gid}</td>
                  <td className="mono" style={{ padding: '7px 8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.is_dir ? '<DIR>' : formatBytes(entry.size_bytes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Entry Inspector */}
        <div style={{ background: 'var(--bg-inset)', borderRadius: 6, border: '1px solid var(--border)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-light)' }}>Entry Inspector</h3>
          {selectedEntry ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', wordBreak: 'break-all', color: 'var(--text-primary)' }}>{selectedEntry.name}</div>
              <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Path:</strong> {selectedEntry.path}</div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Type:</strong> {selectedEntry.is_dir ? 'Directory' : 'Regular File'}</div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Size:</strong> {formatBytes(selectedEntry.size_bytes)}</div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Permissions:</strong> {selectedEntry.permissions}</div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Owner:</strong> {selectedEntry.owner_uid_gid}</div>
                <div><strong style={{ color: 'var(--text-secondary)' }}>Modified:</strong> {selectedEntry.modified_time}</div>
              </div>
              {!selectedEntry.is_dir && (
                <button className="btn btn-primary" style={{ marginTop: 6 }} onClick={() => alert(`Exporting '${selectedEntry.name}' to Windows Downloads...`)}>
                  <Download size={15} /><span>Extract to Windows NTFS</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>
              Select a file or directory to view Ext4 metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
