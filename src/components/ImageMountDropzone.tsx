import React, { useState } from 'react';
import { UploadCloud, FileCode2, ExternalLink, Disc } from 'lucide-react';

interface ImageMountDropzoneProps {
  onSelectImageForMount: (imagePath: string, fileName: string, sizeBytes: number) => void;
}

export const ImageMountDropzone: React.FC<ImageMountDropzoneProps> = ({ onSelectImageForMount }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string; size: number } | null>(null);

  const sampleImages = [
    { name: 'ubuntu-24.04-server-raw.img',  path: 'C:\\LinuxFS\\Images\\ubuntu-24.04-server-raw.img',  size: 16106127360 },
    { name: 'arch_linux_rootfs.ext4',        path: 'C:\\LinuxFS\\Images\\arch_linux_rootfs.ext4',        size: 8589934592  },
    { name: 'debian-12-disk.qcow2',          path: 'C:\\LinuxFS\\Images\\debian-12-disk.qcow2',          size: 21474836480 },
    { name: 'fedora-workstation.vhdx',       path: 'C:\\LinuxFS\\Images\\fedora-workstation.vhdx',       size: 34359738368 },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile({ path: (file as any).path || `C:\\MountedImages\\${file.name}`, name: file.name, size: file.size || 10737418240 });
    }
  };

  const formatBytes = (bytes: number) => `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="glass-panel" style={{ padding: 22 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
          <UploadCloud size={20} color="var(--accent-light)" />
          <span>Linux Disk Image Virtual Drive Mount</span>
        </h2>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 18 }}>
          Drag & drop any Linux disk image (<span className="mono" style={{ color: 'var(--accent-light)' }}>.img, .ext4, .iso, .vhdx, .vhd, .qcow2</span>) to assign a Windows Drive Letter.
        </p>

        <div className={`dropzone ${dragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)' }}>
            <FileCode2 size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>Drag & drop your Linux Disk Image here</h3>
            <p className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supports Ext2/3/4, Raw, ISO, VHDX, VHD, QCOW2</p>
          </div>
          <button className="btn btn-secondary" onClick={() => setSelectedFile({ path: sampleImages[0].path, name: sampleImages[0].name, size: sampleImages[0].size })}>
            Browse Image Files...
          </button>
        </div>

        {selectedFile && (
          <div style={{ marginTop: 18, padding: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--accent-subtle)', border: '1px solid var(--border-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Disc size={26} color="var(--accent-light)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{selectedFile.name}</div>
                <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedFile.path} • {formatBytes(selectedFile.size)}</div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => onSelectImageForMount(selectedFile.path, selectedFile.name, selectedFile.size)}>
              <ExternalLink size={15} /><span>Mount Image to Drive Letter</span>
            </button>
          </div>
        )}
      </div>

      {/* Sample Quick-Mount Presets */}
      <div className="glass-panel" style={{ padding: 22 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>Sample Linux Image Quick Mount Presets</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {sampleImages.map((img) => (
            <div key={img.name} style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Disc size={18} color="var(--emerald)" />
                <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{img.name}</span>
              </div>
              <div className="mono" style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{formatBytes(img.size)}</div>
              <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem' }} onClick={() => onSelectImageForMount(img.path, img.name, img.size)}>
                <ExternalLink size={13} /><span>Mount to Drive Letter</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
