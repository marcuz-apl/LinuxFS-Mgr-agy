import React, { useState } from 'react';
import { UploadCloud, FileCode2, ExternalLink, Disc } from 'lucide-react';

interface ImageMountDropzoneProps {
  onSelectImageForMount: (imagePath: string, fileName: string, sizeBytes: number) => void;
}

export const ImageMountDropzone: React.FC<ImageMountDropzoneProps> = ({ onSelectImageForMount }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string; size: number } | null>(null);

  const sampleImages = [
    { name: 'ubuntu-24.04-server-raw.img', path: 'C:\\LinuxFS\\Images\\ubuntu-24.04-server-raw.img', size: 16106127360 },
    { name: 'arch_linux_rootfs.ext4', path: 'C:\\LinuxFS\\Images\\arch_linux_rootfs.ext4', size: 8589934592 },
    { name: 'debian-12-disk.qcow2', path: 'C:\\LinuxFS\\Images\\debian-12-disk.qcow2', size: 21474836480 },
    { name: 'fedora-workstation.vhdx', path: 'C:\\LinuxFS\\Images\\fedora-workstation.vhdx', size: 34359738368 },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const filePath = (file as any).path || `C:\\MountedImages\\${file.name}`;
      setSelectedFile({
        path: filePath,
        name: file.name,
        size: file.size || 10737418240,
      });
    }
  };

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="glass-panel" style={{ padding: 24 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <UploadCloud size={22} color="var(--neon-cyan)" />
          <span>Linux Disk Image Virtual Drive Mount</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          Drag & drop any Linux disk image file (<span className="mono" style={{ color: 'var(--neon-cyan)' }}>.img, .ext4, .iso, .vhdx, .vhd, .qcow2</span>) to attach and map as a native Windows Drive Letter.
        </p>

        <div
          className={`dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,240,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon-cyan)' }}>
            <FileCode2 size={32} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>
              Drag and drop your Linux Disk Image here
            </h3>
            <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Supports Ext2/3/4, Raw (.img, .ext4), ISO, VHDX, VHD, QCOW2
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const sample = sampleImages[0];
                setSelectedFile({ path: sample.path, name: sample.name, size: sample.size });
              }}
            >
              Browse Image Files...
            </button>
          </div>
        </div>

        {selectedFile && (
          <div className="glass-panel-glow" style={{ marginTop: 20, padding: 20, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 240, 255, 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Disc size={28} color="var(--neon-cyan)" />
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{selectedFile.name}</div>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Path: {selectedFile.path} • Size: {formatBytes(selectedFile.size)}
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => onSelectImageForMount(selectedFile.path, selectedFile.name, selectedFile.size)}
            >
              <ExternalLink size={16} />
              <span>Mount Image to Drive Letter</span>
            </button>
          </div>
        )}
      </div>

      {/* Preset Sample Images for Quick Testing */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-main)' }}>
          Sample Linux Image Quick Mount Presets
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {sampleImages.map((img) => (
            <div
              key={img.name}
              className="glass-panel"
              style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(255,255,255,0.02)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Disc size={20} color="var(--neon-green)" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{img.name}</span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {formatBytes(img.size)}
              </div>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => onSelectImageForMount(img.path, img.name, img.size)}
              >
                <ExternalLink size={14} />
                <span>Mount to Drive Letter</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
