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

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  const loadDirectory = (path: string) => {
    if (path === '/') {
      setEntries([
        { name: 'bin', path: '/bin', is_dir: true, size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:20:00' },
        { name: 'boot', path: '/boot', is_dir: true, size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:22:10' },
        { name: 'etc', path: '/etc', is_dir: true, size_bytes: 12288, permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-11 09:15:30' },
        { name: 'home', path: '/home', is_dir: true, size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 11:00:00' },
        { name: 'mnt', path: '/mnt', is_dir: true, size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 11:21:00' },
        { name: 'var', path: '/var', is_dir: true, size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 12:45:00' },
      ]);
    } else if (path === '/mnt' || path.startsWith('/mnt/')) {
      setEntries([
        { name: 'hada', path: '/mnt/hada', is_dir: true, size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000', modified_time: '2026-08-12 11:21:00' },
        { name: 'backup_config.json', path: `${path}/backup_config.json`, is_dir: false, size_bytes: 14208, permissions: 'rw-r--r--', owner_uid_gid: '1000:1000', modified_time: '2026-08-12 10:14:22' },
        { name: 'kernel_dump.log', path: `${path}/kernel_dump.log`, is_dir: false, size_bytes: 849201, permissions: 'rw-r--r--', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 08:30:11' },
      ]);
    } else {
      setEntries([
        { name: 'user_settings.conf', path: `${path}/user_settings.conf`, is_dir: false, size_bytes: 3512, permissions: 'rw-r--r--', owner_uid_gid: '1000:1000', modified_time: '2026-08-11 16:20:00' },
        { name: 'documents', path: `${path}/documents`, is_dir: true, size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000', modified_time: '2026-08-12 09:00:00' },
      ]);
    }
  };

  const handleNavigateUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const parentPath = '/' + parts.join('/');
    setCurrentPath(parentPath);
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  return (
    <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Layers size={22} color="var(--neon-cyan)" />
            <span>Ext4 Filesystem Browser — {partitionName}</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Direct Linux Ext4 directory tree & file inspection
          </p>
        </div>

        <div className="badge badge-cyan mono">
          {currentPath}
        </div>
      </div>

      {/* Path Toolbar */}
      <div className="glass-panel" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.3)' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '6px 12px' }}
          onClick={handleNavigateUp}
          disabled={currentPath === '/'}
        >
          <ArrowLeft size={16} />
          <span>Up</span>
        </button>

        <div className="mono" style={{ fontSize: '0.9rem', color: 'var(--neon-cyan)', flexGrow: 1 }}>
          Ext4://{currentPath}
        </div>
      </div>

      {/* File Tree Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="glass-panel" style={{ padding: 16, background: 'rgba(0,0,0,0.2)', maxHeight: 450, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Permissions</th>
                <th style={{ padding: 8 }}>Owner</th>
                <th style={{ padding: 8 }}>Size</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.path}
                  style={{
                    cursor: 'pointer',
                    background: selectedEntry?.path === entry.path ? 'rgba(0,240,255,0.08)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                  }}
                  onClick={() => setSelectedEntry(entry)}
                  onDoubleClick={() => {
                    if (entry.is_dir) setCurrentPath(entry.path);
                  }}
                >
                  <td style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                    {entry.is_dir ? (
                      <Folder size={18} color="var(--neon-cyan)" />
                    ) : (
                      <FileText size={18} color="var(--text-muted)" />
                    )}
                    <span>{entry.name}</span>
                  </td>
                  <td className="mono" style={{ padding: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {entry.permissions}
                  </td>
                  <td className="mono" style={{ padding: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {entry.owner_uid_gid}
                  </td>
                  <td className="mono" style={{ padding: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {entry.is_dir ? '<DIR>' : formatBytes(entry.size_bytes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected File Details Panel */}
        <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--neon-cyan)' }}>
            Entry Inspector
          </h3>

          {selectedEntry ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 600, fontSize: '1.05rem', wordBreak: 'break-all' }}>
                {selectedEntry.name}
              </div>
              <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div><strong>Path:</strong> {selectedEntry.path}</div>
                <div><strong>Type:</strong> {selectedEntry.is_dir ? 'Directory' : 'Regular File'}</div>
                <div><strong>Size:</strong> {formatBytes(selectedEntry.size_bytes)}</div>
                <div><strong>Permissions:</strong> {selectedEntry.permissions}</div>
                <div><strong>Owner:</strong> {selectedEntry.owner_uid_gid}</div>
                <div><strong>Modified:</strong> {selectedEntry.modified_time}</div>
              </div>

              {!selectedEntry.is_dir && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 12 }}
                  onClick={() => alert(`Exporting '${selectedEntry.name}' to local Windows Downloads folder...`)}
                >
                  <Download size={16} />
                  <span>Extract to Windows NTFS</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Select a file or directory from the list to view Ext4 permissions and metadata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
