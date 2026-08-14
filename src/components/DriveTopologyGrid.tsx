import React, { useState } from 'react';
import { HardDrive, Disc, ExternalLink, Info, Layers, CheckCircle2 } from 'lucide-react';
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
    return gb >= 1000 ? `${(gb / 1024).toFixed(2)} TB` : `${gb.toFixed(2)} GB`;
  };

  return (
    <div className="drives-grid">
      {drives.map((drive) => {
        const hasExt4 = drive.partitions.some((p) => p.filesystem.toUpperCase().includes('EXT4'));
        return (
          <div key={drive.drive_index} className={`glass-panel drive-card ${hasExt4 ? 'glass-panel-glow' : ''}`}>
            <div className="drive-card-header">
              <div className="drive-info">
                <div className="drive-icon">
                  <HardDrive size={24} />
                </div>
                <div>
                  <div className="drive-name">Drive {drive.drive_index}: {drive.model}</div>
                  <div className="drive-specs mono">
                    <span>{formatBytes(drive.capacity_bytes)}</span>
                    <span>• {drive.partition_style}</span>
                    <span>• {drive.adapter_type}</span>
                    <span>• SN: {drive.serial_number}</span>
                  </div>
                </div>
              </div>
              {hasExt4 ? (
                <div className="badge badge-cyan"><CheckCircle2 size={13} /><span>Ext4 Host Drive</span></div>
              ) : (
                <div className="badge badge-emerald"><span>Online</span></div>
              )}
            </div>

            {/* Partition Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600 }}>Storage Volume Layout</span>
                <span className="mono">{drive.partitions.length} Partition(s)</span>
              </div>
              <div className="partition-bar-container">
                {drive.partitions.map((p) => {
                  const percent = Math.max(6, (p.capacity_bytes / drive.capacity_bytes) * 100);
                  const isExt4 = p.filesystem.toUpperCase().includes('EXT4');
                  const isFat = p.filesystem.toUpperCase().includes('FAT');
                  const colorClass = isExt4 ? 'partition-segment-ext4' : isFat ? 'partition-segment-fat' : 'partition-segment-ntfs';
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

            {/* Partition Items */}
            <div className="partition-list">
              {drive.partitions.map((p) => {
                const isExt4 = p.filesystem.toUpperCase().includes('EXT4');
                return (
                  <div key={p.partition_number} className={`partition-item ${isExt4 ? 'partition-item-ext4' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Disc size={20} color={isExt4 ? 'var(--emerald)' : 'var(--text-muted)'} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.93rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
                          <span>Partition {p.partition_number} — {p.filesystem}</span>
                          {p.is_hidden && (
                            <span className="badge badge-amber" style={{ padding: '1px 7px', fontSize: '0.62rem' }}>Hidden</span>
                          )}
                        </div>
                        <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {formatBytes(p.capacity_bytes)} Total • {formatBytes(p.free_bytes)} Free
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setSelectedPartitionDetail(p)}>
                        <Info size={13} /><span>Inspect</span>
                      </button>
                      {isExt4 && (
                        <>
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onBrowseExt4(p)}>
                            <Layers size={13} /><span>Browse Ext4</span>
                          </button>
                          <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => onSelectPartitionForMount(drive.drive_index, p)}>
                            <ExternalLink size={13} /><span>Mount Drive Letter</span>
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

      {/* Partition Inspector Modal */}
      {selectedPartitionDetail && (
        <div className="modal-overlay" onClick={() => setSelectedPartitionDetail(null)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
                <Info size={18} /><span>Partition {selectedPartitionDetail.partition_number} Inspector</span>
              </h2>
              <button className="btn btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setSelectedPartitionDetail(null)}>✕</button>
            </div>

            <div className="mono" style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: '0.83rem', background: 'var(--bg-inset)', padding: 16, borderRadius: 6, border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>FileSystem:</strong> {selectedPartitionDetail.filesystem}</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Volume GUID Path:</strong> {selectedPartitionDetail.volume_guid_path}</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Device Path:</strong> {selectedPartitionDetail.device_path}</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Partition GUID:</strong> {selectedPartitionDetail.partition_guid}</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Capacity:</strong> {formatBytes(selectedPartitionDetail.capacity_bytes)} ({selectedPartitionDetail.capacity_bytes.toLocaleString()} bytes)</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Starting Sector:</strong> {selectedPartitionDetail.starting_sector.toLocaleString()}</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Total Sectors:</strong> {selectedPartitionDetail.total_sectors.toLocaleString()}</div>
              {selectedPartitionDetail.ext4_volume_uuid && (
                <>
                  <hr style={{ borderColor: 'var(--border)', margin: '4px 0' }} />
                  <div style={{ color: 'var(--emerald)' }}><strong>Ext4 UUID:</strong> {selectedPartitionDetail.ext4_volume_uuid}</div>
                  <div style={{ color: 'var(--emerald)' }}><strong>Original Mount:</strong> {selectedPartitionDetail.ext4_mount_point}</div>
                  <div><strong style={{ color: 'var(--text-primary)' }}>Block Size:</strong> {selectedPartitionDetail.ext4_block_size} bytes</div>
                  <div><strong style={{ color: 'var(--text-primary)' }}>Inode Count:</strong> {selectedPartitionDetail.ext4_inode_count.toLocaleString()}</div>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>Superblock Features:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 7 }}>
                      {selectedPartitionDetail.ext4_features.map((feat) => (
                        <span key={feat} className="badge badge-violet" style={{ fontSize: '0.65rem', textTransform: 'none' }}>{feat}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedPartitionDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
