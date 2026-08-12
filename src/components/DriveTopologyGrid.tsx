import React, { useState } from 'react';
import { HardDrive, Disc, ExternalLink, Info, Layers } from 'lucide-react';
import { PhysicalDriveInfo, PartitionInfo } from '../types/disk';

interface DriveTopologyGridProps {
  drives: PhysicalDriveInfo[];
  onSelectPartitionForMount: (driveIndex: number, partition: PartitionInfo) => void;
  onBrowseExt4: (partition: PartitionInfo) => void;
}

export const DriveTopologyGrid: React.FC<DriveTopologyGridProps> = ({
  drives,
  onSelectPartitionForMount,
  onBrowseExt4,
}) => {
  const [selectedPartitionDetail, setSelectedPartitionDetail] = useState<PartitionInfo | null>(null);

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1000) {
      return `${(gb / 1024).toFixed(2)} TB`;
    }
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div className="drives-grid">
      {drives.map((drive) => {
        const isTargetToshiba = drive.drive_index === 3;
        return (
          <div
            key={drive.drive_index}
            className={`glass-panel drive-card ${isTargetToshiba ? 'glass-panel-glow' : ''}`}
          >
            <div className="drive-card-header">
              <div className="drive-info">
                <div className="drive-icon">
                  <HardDrive size={24} />
                </div>
                <div>
                  <div className="drive-name">
                    Drive {drive.drive_index}: {drive.model}
                  </div>
                  <div className="drive-specs mono">
                    <span>{formatBytes(drive.capacity_bytes)}</span> •
                    <span>{drive.partition_style}</span> •
                    <span>{drive.adapter_type}</span> •
                    <span>SN: {drive.serial_number}</span>
                  </div>
                </div>
              </div>

              {isTargetToshiba && (
                <div className="badge badge-cyan">Target Ext4 System</div>
              )}
            </div>

            {/* Visual Partition Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Partition Layout</span>
                <span>{drive.partitions.length} Volume(s)</span>
              </div>
              <div className="partition-bar-container">
                {drive.partitions.map((p) => {
                  const percent = Math.max(
                    5,
                    (p.capacity_bytes / drive.capacity_bytes) * 100
                  );
                  const isExt4 = p.filesystem.toUpperCase().includes('EXT4');
                  const isFat = p.filesystem.toUpperCase().includes('FAT');

                  let colorClass = 'partition-segment-ntfs';
                  if (isExt4) colorClass = 'partition-segment-ext4';
                  else if (isFat) colorClass = 'partition-segment-fat';

                  return (
                    <div
                      key={p.partition_number}
                      className={`partition-segment ${colorClass}`}
                      style={{ width: `${percent}%` }}
                      title={`Partition ${p.partition_number}: ${p.filesystem} (${formatBytes(p.capacity_bytes)})`}
                      onClick={() => setSelectedPartitionDetail(p)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Partition List */}
            <div className="partition-list">
              {drive.partitions.map((p) => {
                const isExt4 = p.filesystem.toUpperCase().includes('EXT4');
                return (
                  <div
                    key={p.partition_number}
                    className={`partition-item ${isExt4 ? 'partition-item-ext4' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Disc
                        size={20}
                        color={isExt4 ? 'var(--neon-cyan)' : 'var(--text-muted)'}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>Partition {p.partition_number} ({p.filesystem})</span>
                          {p.is_hidden && (
                            <span className="badge badge-amber" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                              Hidden Volume
                            </span>
                          )}
                        </div>
                        <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {formatBytes(p.capacity_bytes)} Total • {formatBytes(p.free_bytes)} Free
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => setSelectedPartitionDetail(p)}
                      >
                        <Info size={14} />
                        <span>Inspect</span>
                      </button>

                      {isExt4 && (
                        <>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => onBrowseExt4(p)}
                          >
                            <Layers size={14} />
                            <span>Browse</span>
                          </button>

                          <button
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            onClick={() => onSelectPartitionForMount(drive.drive_index, p)}
                          >
                            <ExternalLink size={14} />
                            <span>Mount Drive Letter</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Partition Inspector Modal / Panel */}
      {selectedPartitionDetail && (
        <div className="modal-overlay" onClick={() => setSelectedPartitionDetail(null)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--neon-cyan)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Info size={20} />
                <span>Volume Inspector — Partition {selectedPartitionDetail.partition_number}</span>
              </h2>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 8px' }}
                onClick={() => setSelectedPartitionDetail(null)}
              >
                ✕
              </button>
            </div>

            <div className="mono" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem', background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 8, border: '1px solid var(--glass-border)' }}>
              <div><strong>FileSystem:</strong> {selectedPartitionDetail.filesystem}</div>
              <div><strong>GUID Path:</strong> {selectedPartitionDetail.volume_guid_path}</div>
              <div><strong>Device Path:</strong> {selectedPartitionDetail.device_path}</div>
              <div><strong>Partition GUID:</strong> {selectedPartitionDetail.partition_guid}</div>
              <div><strong>Capacity:</strong> {formatBytes(selectedPartitionDetail.capacity_bytes)} ({selectedPartitionDetail.capacity_bytes.toLocaleString()} bytes)</div>
              <div><strong>Starting Sector:</strong> {selectedPartitionDetail.starting_sector.toLocaleString()}</div>
              <div><strong>Total Sectors:</strong> {selectedPartitionDetail.total_sectors.toLocaleString()}</div>
              
              {selectedPartitionDetail.ext4_volume_uuid && (
                <>
                  <hr style={{ borderColor: 'var(--glass-border)', margin: '6px 0' }} />
                  <div style={{ color: 'var(--neon-green)' }}><strong>Ext4 Volume UUID:</strong> {selectedPartitionDetail.ext4_volume_uuid}</div>
                  <div style={{ color: 'var(--neon-green)' }}><strong>Original Mount Point:</strong> {selectedPartitionDetail.ext4_mount_point}</div>
                  <div><strong>Block Size:</strong> {selectedPartitionDetail.ext4_block_size} bytes</div>
                  <div><strong>Inode Count:</strong> {selectedPartitionDetail.ext4_inode_count.toLocaleString()}</div>
                  <div>
                    <strong>Features:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {selectedPartitionDetail.ext4_features.map((feat) => (
                        <span key={feat} className="badge badge-purple" style={{ fontSize: '0.65rem', textTransform: 'none' }}>
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setSelectedPartitionDetail(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
