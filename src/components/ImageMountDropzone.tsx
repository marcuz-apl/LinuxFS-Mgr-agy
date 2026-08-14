import React, { useState, useRef } from 'react';
import { UploadCloud, FileCode2, ExternalLink, Disc, FolderOpen } from 'lucide-react';

interface ImageMountDropzoneProps {
  onSelectImageForMount: (imagePath: string, fileName: string, sizeBytes: number) => void;
}

export const ImageMountDropzone: React.FC<ImageMountDropzoneProps> = ({ onSelectImageForMount }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePresets = [
    { name: 'ubuntu-24.04-rootfs.ext4',  path: 'ubuntu-24.04-rootfs.ext4',  size: 8589934592, desc: 'Ext4 Linux RootFS Image' },
    { name: 'debian-12-disk.raw',        path: 'debian-12-disk.raw',        size: 16106127360, desc: 'Raw Disk Image' },
    { name: 'arch-linux-system.vhdx',    path: 'arch-linux-system.vhdx',    size: 21474836480, desc: 'Hyper-V VHDX Virtual Disk' },
    { name: 'alpine-standard-3.20.iso',  path: 'alpine-standard-3.20.iso',  size: 734003200, desc: 'ISO Optical Linux Image' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      const filePath = (file as any).path || file.name;
      setSelectedFile({
        path: filePath,
        name: file.name,
        size: file.size || 10737418240,
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const filePath = (file as any).path || file.name;
      setSelectedFile({
        path: filePath,
        name: file.name,
        size: file.size || 10737418240,
      });
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Hidden File Input for Native File Picking */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".img,.ext4,.iso,.vhdx,.vhd,.qcow2,.raw"
        style={{ display: 'none' }}
      />

      <div className="glass-panel" style={{ padding: 22 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)' }}>
          <UploadCloud size={20} color="var(--accent-light)" />
          <span>Linux Disk Image Virtual Drive Mount</span>
        </h2>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: 18 }}>
          Drag & drop any Linux disk image (<span className="mono" style={{ color: 'var(--accent-light)' }}>.img, .ext4, .iso, .vhdx, .vhd, .qcow2, .raw</span>) to assign a Windows Drive Letter.
        </p>

        <div className={`dropzone ${dragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)' }}>
            <FileCode2 size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>Drag & drop your Linux Disk Image here</h3>
            <p className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supports Ext2/3/4, Raw, ISO, VHDX, VHD, QCOW2</p>
          </div>
          <button className="btn btn-secondary" onClick={triggerFileBrowser}>
            <FolderOpen size={15} />
            <span>Browse Image Files...</span>
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

      {/* Quick-Mount Image Templates */}
      <div className="glass-panel" style={{ padding: 22 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>Quick Select Linux Image Profiles</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {samplePresets.map((img) => (
            <div key={img.name} style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-inset)', border: '1px solid var(--border)', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Disc size={18} color="var(--emerald)" />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block' }}>{img.name}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{img.desc}</span>
                </div>
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
