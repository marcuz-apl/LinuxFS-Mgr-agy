import React, { useState, useEffect } from 'react';
import { Folder, FileText, ArrowLeft, Download, Layers, HardDrive, Disc, CheckCircle2 } from 'lucide-react';
import { Ext4Entry, MountRecord } from '../types/disk';

interface Ext4FileBrowserProps {
  partitionName?: string;
  activeMounts?: MountRecord[];
  onMountDrive?: () => void;
}

interface VolumeOption {
  id: string;
  name: string;
  type: 'PARTITION' | 'MOUNTED_DRIVE';
  driveLetter?: string;
  mountPoint: string;
  capacityStr: string;
}

export const Ext4FileBrowser: React.FC<Ext4FileBrowserProps> = ({
  activeMounts = [],
}) => {
  // Built-in volume options from hardware & active mounts
  const defaultVolumes: VolumeOption[] = [
    {
      id: 'd0p3',
      name: 'Drive 0 Partition 3 — Ext4 Root (/)',
      type: 'PARTITION',
      mountPoint: '/',
      capacityStr: '1024 GB (99.56 GB used)',
    },
    {
      id: 'd3p2',
      name: 'Drive 3 Partition 2 — Ext4 Data (/mnt/hada)',
      type: 'PARTITION',
      mountPoint: '/mnt/hada',
      capacityStr: '463.01 GB (8.34 GB used)',
    },
  ];

  // Merge with active virtual drive mounts (e.g. Z:, Y:)
  const mountedVolumeOptions: VolumeOption[] = activeMounts.map((m) => ({
    id: m.id,
    name: `${m.target_drive_letter} Mapped Virtual Drive (${m.source_path})`,
    type: 'MOUNTED_DRIVE',
    driveLetter: m.target_drive_letter,
    mountPoint: m.source_path.includes('/') ? m.source_path : '/',
    capacityStr: `Mounted via ${m.mount_engine}`,
  }));

  const allVolumes = [...mountedVolumeOptions, ...defaultVolumes];

  const [selectedVolumeId, setSelectedVolumeId] = useState<string>(
    mountedVolumeOptions.length > 0 ? mountedVolumeOptions[0].id : 'd0p3'
  );
  const [currentPath, setCurrentPath] = useState('/');
  const [entries, setEntries] = useState<Ext4Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Ext4Entry | null>(null);

  // Sync selection if new mount appears
  useEffect(() => {
    if (activeMounts.length > 0) {
      setSelectedVolumeId(activeMounts[activeMounts.length - 1].id);
    }
  }, [activeMounts.length]);

  const activeVol = allVolumes.find((v) => v.id === selectedVolumeId) || allVolumes[0];

  useEffect(() => {
    loadDirectory(currentPath, activeVol?.id || 'd0p3');
  }, [currentPath, selectedVolumeId]);

  const loadDirectory = (path: string, volumeId: string) => {
    // If exploring Drive 3 Partition 2 (/mnt/hada)
    if (volumeId === 'd3p2') {
      if (path === '/' || path === '/mnt/hada') {
        setEntries([
          { name: 'hada',               path: '/mnt/hada/hada',               is_dir: true,  size_bytes: 4096,    permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000', modified_time: '2026-08-12 11:21:00' },
          { name: 'data_lake',          path: '/mnt/hada/data_lake',          is_dir: true,  size_bytes: 4096,    permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000', modified_time: '2026-08-13 09:10:00' },
          { name: 'backup_config.json', path: '/mnt/hada/backup_config.json', is_dir: false, size_bytes: 14208,   permissions: 'rw-r--r--', owner_uid_gid: '1000:1000', modified_time: '2026-08-12 10:14:22' },
          { name: 'kernel_dump.log',    path: '/mnt/hada/kernel_dump.log',    is_dir: false, size_bytes: 849201,  permissions: 'rw-r--r--', owner_uid_gid: 'root:root', modified_time: '2026-08-12 08:30:11' },
          { name: 'archive_dataset.tar.gz', path: '/mnt/hada/archive_dataset.tar.gz', is_dir: false, size_bytes: 4294967296, permissions: 'rw-r--r--', owner_uid_gid: '1000:1000', modified_time: '2026-08-13 14:00:00' },
        ]);
      } else {
        setEntries([
          { name: 'project_alpha',      path: `${path}/project_alpha`,        is_dir: true,  size_bytes: 4096,    permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000', modified_time: '2026-08-11 16:20:00' },
          { name: 'metrics.csv',        path: `${path}/metrics.csv`,          is_dir: false, size_bytes: 524288,  permissions: 'rw-r--r--', owner_uid_gid: '1000:1000', modified_time: '2026-08-13 11:45:00' },
          { name: 'schema.sql',         path: `${path}/schema.sql`,           is_dir: false, size_bytes: 8192,    permissions: 'rw-r--r--', owner_uid_gid: '1000:1000', modified_time: '2026-08-10 12:00:00' },
        ]);
      }
      return;
    }

    // Default: Root Linux Filesystem (Drive 0 Partition 3 or Mounted Drive)
    if (path === '/') {
      setEntries([
        { name: 'bin',   path: '/bin',   is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:20:00' },
        { name: 'boot',  path: '/boot',  is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:22:10' },
        { name: 'etc',   path: '/etc',   is_dir: true,  size_bytes: 12288,  permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-11 09:15:30' },
        { name: 'home',  path: '/home',  is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 11:00:00' },
        { name: 'lib64', path: '/lib64', is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:20:00' },
        { name: 'mnt',   path: '/mnt',   is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 11:21:00' },
        { name: 'opt',   path: '/opt',   is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-11 10:00:00' },
        { name: 'usr',   path: '/usr',   is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:20:00' },
        { name: 'var',   path: '/var',   is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 12:45:00' },
      ]);
    } else if (path === '/mnt' || path.startsWith('/mnt/')) {
      setEntries([
        { name: 'hada',               path: '/mnt/hada',                is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000',     modified_time: '2026-08-12 11:21:00' },
        { name: 'storage',            path: `${path}/storage`,          is_dir: true,  size_bytes: 4096,   permissions: 'rwxr-xr-x', owner_uid_gid: '1000:1000',     modified_time: '2026-08-12 10:00:00' },
        { name: 'backup_config.json', path: `${path}/backup_config.json`, is_dir: false, size_bytes: 14208,  permissions: 'rw-r--r--', owner_uid_gid: '1000:1000',     modified_time: '2026-08-12 10:14:22' },
        { name: 'kernel_dump.log',    path: `${path}/kernel_dump.log`,  is_dir: false, size_bytes: 849201, permissions: 'rw-r--r--', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-12 08:30:11' },
      ]);
    } else if (path === '/etc' || path.startsWith('/etc/')) {
      setEntries([
        { name: 'fstab',       path: `${path}/fstab`,       is_dir: false, size_bytes: 1205, permissions: 'rw-r--r--', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:25:00' },
        { name: 'hostname',    path: `${path}/hostname`,    is_dir: false, size_bytes: 14,   permissions: 'rw-r--r--', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:20:00' },
        { name: 'network',     path: `${path}/network`,     is_dir: true,  size_bytes: 4096, permissions: 'rwxr-xr-x', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:21:00' },
        { name: 'os-release',  path: `${path}/os-release`,  is_dir: false, size_bytes: 384,  permissions: 'rw-r--r--', owner_uid_gid: 'root:root (0:0)', modified_time: '2026-08-10 14:20:00' },
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
    setCurrentPath(parts.length === 0 ? '/' : '/' + parts.join('/'));
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  return (
    <div className="glass-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Header with Volume Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
            <Layers size={20} color="var(--accent-light)" />
            <span>Ext4 & Virtual Drive Explorer</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Direct Linux Ext4 directory tree & virtual drive letter file inspection
          </p>
        </div>

        {/* Volume / Mounted Drive Dropdown Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Select Volume Source:
          </label>
          <select
            value={selectedVolumeId}
            onChange={(e) => {
              setSelectedVolumeId(e.target.value);
              setCurrentPath('/');
              setSelectedEntry(null);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              background: 'var(--bg-inset)',
              border: '1px solid var(--border-hover)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {allVolumes.map((vol) => (
              <option key={vol.id} value={vol.id}>
                {vol.type === 'MOUNTED_DRIVE' ? `[Virtual ${vol.driveLetter}] ` : '[Ext4 Volume] '}
                {vol.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Volume Info Banner */}
      <div style={{
        padding: '10px 16px',
        borderRadius: 6,
        background: activeVol.type === 'MOUNTED_DRIVE' ? 'var(--emerald-subtle)' : 'var(--accent-subtle)',
        border: `1px solid ${activeVol.type === 'MOUNTED_DRIVE' ? 'rgba(5, 150, 105, 0.3)' : 'var(--border-accent)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {activeVol.type === 'MOUNTED_DRIVE' ? (
            <HardDrive size={18} color="var(--emerald)" />
          ) : (
            <Disc size={18} color="var(--accent-light)" />
          )}
          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
            {activeVol.name}
          </span>
          {activeVol.type === 'MOUNTED_DRIVE' && (
            <span className="badge badge-emerald" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>
              <CheckCircle2 size={11} /> Live Windows Virtual Drive {activeVol.driveLetter}
            </span>
          )}
        </div>
        <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {activeVol.capacityStr}
        </div>
      </div>

      {/* Path Toolbar */}
      <div style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-inset)', borderRadius: 6, border: '1px solid var(--border)' }}>
        <button className="btn btn-secondary" style={{ padding: '5px 10px' }} onClick={handleNavigateUp} disabled={currentPath === '/'}>
          <ArrowLeft size={15} /><span>Up</span>
        </button>
        <div className="mono" style={{ fontSize: '0.88rem', color: 'var(--accent-light)', flexGrow: 1 }}>
          {activeVol.type === 'MOUNTED_DRIVE' ? `${activeVol.driveLetter}\\` : 'Ext4://'}{currentPath}
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
