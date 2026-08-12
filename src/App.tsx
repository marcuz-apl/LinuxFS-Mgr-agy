import { useState, useEffect } from 'react';
import { HardDrive, UploadCloud, Layers, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { DriveTopologyGrid } from './components/DriveTopologyGrid';
import { ImageMountDropzone } from './components/ImageMountDropzone';
import { MountModal } from './components/MountModal';
import { ActiveMountsTable } from './components/ActiveMountsTable';
import { Ext4FileBrowser } from './components/Ext4FileBrowser';
import { SystemScanResult, PartitionInfo, MountRecord } from './types/disk';
import './App.css';

export function App() {
  const [activeTab, setActiveTab] = useState<'drives' | 'images' | 'explorer' | 'mounts'>('drives');
  const [scanResult, setScanResult] = useState<SystemScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeMounts, setActiveMounts] = useState<MountRecord[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSourceDesc, setModalSourceDesc] = useState('');
  const [pendingMountAction, setPendingMountAction] = useState<{
    type: 'PARTITION' | 'IMAGE';
    driveIndex?: number;
    partition?: PartitionInfo;
    imagePath?: string;
  } | null>(null);
  const [isSubmittingMount, setIsSubmittingMount] = useState(false);

  // Notification Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    performDriveScan();
  }, []);

  const performDriveScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockResult: SystemScanResult = {
        scan_timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        is_admin: true,
        drives: [
          {
            drive_index: 0,
            model: 'NVMe Samsung SSD 980 PRO 1TB',
            adapter_type: 'NVMe',
            serial_number: 'S69ENF0R123456X',
            partition_style: 'GPT',
            disk_guid: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
            capacity_bytes: 1000204886016,
            total_sectors: 1953525168,
            sector_size: 512,
            physical_sector_size: 4096,
            partitions: [
              {
                partition_number: 1,
                partition_guid: 'E3B0C442-98FC-11D1-B2A4-0060973044DA',
                volume_guid_path: '\\\\?\\Volume{00000000-0000-0000-0000-000000000001}',
                device_path: '\\Device\\HarddiskVolume1',
                filesystem: 'FAT32 (EFI)',
                capacity_bytes: 536870912,
                free_bytes: 500000000,
                used_bytes: 36870912,
                starting_sector: 2048,
                total_sectors: 1048576,
                is_hidden: true,
                ext4_features: [],
                ext4_volume_uuid: '',
                ext4_mount_point: '',
                ext4_block_size: 0,
                ext4_inode_count: 0,
              },
              {
                partition_number: 2,
                partition_guid: 'C12947F3-6A1B-4521-9981-872A1B0291AA',
                volume_guid_path: '\\\\?\\Volume{11111111-1111-1111-1111-111111111111}',
                device_path: '\\Device\\HarddiskVolume2',
                filesystem: 'NTFS (C:)',
                capacity_bytes: 999600000000,
                free_bytes: 450000000000,
                used_bytes: 549600000000,
                starting_sector: 1050624,
                total_sectors: 1952474544,
                is_hidden: false,
                ext4_features: [],
                ext4_volume_uuid: '',
                ext4_mount_point: '',
                ext4_block_size: 0,
                ext4_inode_count: 0,
              },
            ],
          },
          {
            drive_index: 1,
            model: 'WDC WD40EZAZ-00SF3B0',
            adapter_type: 'SATA',
            serial_number: 'WD-WX1234567890',
            partition_style: 'GPT',
            disk_guid: 'B2C3D4E5-F6A1-8901-BCDE-F12345678901',
            capacity_bytes: 4000787030016,
            total_sectors: 7814037168,
            sector_size: 512,
            physical_sector_size: 4096,
            partitions: [
              {
                partition_number: 1,
                partition_guid: 'F1A2B3C4-D5E6-7890-ABCD-1234567890AB',
                volume_guid_path: '\\\\?\\Volume{22222222-2222-2222-2222-222222222222}',
                device_path: '\\Device\\HarddiskVolume3',
                filesystem: 'NTFS (D:)',
                capacity_bytes: 4000700000000,
                free_bytes: 1200000000000,
                used_bytes: 2800700000000,
                starting_sector: 2048,
                total_sectors: 7813867184,
                is_hidden: false,
                ext4_features: [],
                ext4_volume_uuid: '',
                ext4_mount_point: '',
                ext4_block_size: 0,
                ext4_inode_count: 0,
              },
            ],
          },
          {
            drive_index: 2,
            model: 'ST2000DM008-2FR102',
            adapter_type: 'SATA',
            serial_number: 'Z520ABCD',
            partition_style: 'GPT',
            disk_guid: 'C3D4E5F6-A1B2-9012-CDEF-234567890123',
            capacity_bytes: 2000398934016,
            total_sectors: 3907029168,
            sector_size: 512,
            physical_sector_size: 4096,
            partitions: [
              {
                partition_number: 1,
                partition_guid: 'A9B8C7D6-E5F4-3210-9876-543210FEDCBA',
                volume_guid_path: '\\\\?\\Volume{33333333-3333-3333-3333-333333333333}',
                device_path: '\\Device\\HarddiskVolume4',
                filesystem: 'NTFS (F:)',
                capacity_bytes: 2000300000000,
                free_bytes: 800000000000,
                used_bytes: 1200300000000,
                starting_sector: 2048,
                total_sectors: 3906836480,
                is_hidden: false,
                ext4_features: [],
                ext4_volume_uuid: '',
                ext4_mount_point: '',
                ext4_block_size: 0,
                ext4_inode_count: 0,
              },
            ],
          },
          {
            drive_index: 3,
            model: 'TOSHIBA DT01ACA200',
            adapter_type: 'RAID / SATA',
            serial_number: '19IEMMLGS',
            partition_style: 'GPT',
            disk_guid: '2FC69765-CA3C-4BAF-ACD3-319568B3720F',
            capacity_bytes: 2000398934016,
            total_sectors: 3907029168,
            sector_size: 512,
            physical_sector_size: 4096,
            partitions: [
              {
                partition_number: 1,
                partition_guid: 'D4E5F6A1-B2C3-4567-8901-DEF123456789',
                volume_guid_path: '\\\\?\\Volume{55555555-5555-5555-5555-555555555555}',
                device_path: '\\Device\\HarddiskVolume8',
                filesystem: 'NTFS',
                capacity_bytes: 1503240740864,
                free_bytes: 900000000000,
                used_bytes: 603240740864,
                starting_sector: 2048,
                total_sectors: 2936014848,
                is_hidden: false,
                ext4_features: [],
                ext4_volume_uuid: '',
                ext4_mount_point: '',
                ext4_block_size: 0,
                ext4_inode_count: 0,
              },
              {
                partition_number: 2,
                partition_guid: '74AF99F9-7AAE-403A-A6CE-8A503B41A380',
                volume_guid_path: '\\\\?\\Volume{74af99f9-7aae-403a-a6ce-8a503b41a380}',
                device_path: '\\Device\\HarddiskVolume9',
                filesystem: 'EXT4 (Hidden)',
                capacity_bytes: 497158193152,
                free_bytes: 488203583488,
                used_bytes: 8954609664,
                starting_sector: 2936016896,
                total_sectors: 971012096,
                is_hidden: true,
                ext4_features: [
                  'has_journal',
                  'ext_attr',
                  'resize_inode',
                  'dir_index',
                  'filetype',
                  'extents',
                  '64bit',
                  'flex_bg',
                  'sparse_super',
                  'huge_file',
                  'extra_isize',
                ],
                ext4_volume_uuid: '3AE3CB43-2DDD-49F6-A35B-64B8E4AF5F94',
                ext4_mount_point: '/mnt/hada',
                ext4_block_size: 4096,
                ext4_inode_count: 3035136,
              },
            ],
          },
        ],
      };
      setScanResult(mockResult);
      setIsScanning(false);
    }, 400);
  };

  const handleOpenPartitionMountModal = (driveIndex: number, partition: PartitionInfo) => {
    setPendingMountAction({ type: 'PARTITION', driveIndex, partition });
    setModalTitle(`Mount Drive ${driveIndex} Partition ${partition.partition_number}`);
    setModalSourceDesc(
      `Ext4 Volume ${partition.volume_guid_path} (${(partition.capacity_bytes / (1024 * 1024 * 1024)).toFixed(2)} GB)`
    );
    setModalOpen(true);
  };

  const handleOpenImageMountModal = (imagePath: string, fileName: string, sizeBytes: number) => {
    setPendingMountAction({ type: 'IMAGE', imagePath });
    setModalTitle(`Mount Linux Disk Image '${fileName}'`);
    setModalSourceDesc(`File: ${imagePath} (${(sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB)`);
    setModalOpen(true);
  };

  const handleConfirmMount = (letter: string, readOnly: boolean, engine: string) => {
    setIsSubmittingMount(true);

    setTimeout(() => {
      let newRecord: MountRecord;
      if (pendingMountAction?.type === 'PARTITION') {
        newRecord = {
          id: `mnt_${pendingMountAction.driveIndex}_${pendingMountAction.partition?.partition_number}_${Date.now()}`,
          source_type: 'PARTITION',
          source_path: `Drive ${pendingMountAction.driveIndex} Partition ${pendingMountAction.partition?.partition_number} Ext4`,
          target_drive_letter: letter,
          mount_engine: engine === 'WSL2' ? 'WSL2 Kernel Bridge' : 'WinFSP Proxy',
          is_read_only: readOnly,
          mount_time: new Date().toLocaleTimeString(),
          status: 'ACTIVE',
          bytes_read: 14850100,
          bytes_written: readOnly ? 0 : 2104000,
          wsl_mount_name: `PHYSICALDRIVE${pendingMountAction.driveIndex}p${pendingMountAction.partition?.partition_number}`,
        };
      } else {
        newRecord = {
          id: `img_mnt_${letter}_${Date.now()}`,
          source_type: 'IMAGE',
          source_path: pendingMountAction?.imagePath || 'linux_disk.img',
          target_drive_letter: letter,
          mount_engine: engine === 'WSL2' ? 'WSL2 Virtual Bare' : 'WinFSP Proxy',
          is_read_only: readOnly,
          mount_time: new Date().toLocaleTimeString(),
          status: 'ACTIVE',
          bytes_read: 48910000,
          bytes_written: readOnly ? 0 : 1050000,
          wsl_mount_name: pendingMountAction?.imagePath?.split('\\').pop() || 'image.img',
        };
      }

      setActiveMounts((prev) => [...prev.filter((m) => m.target_drive_letter !== letter), newRecord]);
      setIsSubmittingMount(false);
      setModalOpen(false);
      setActiveTab('mounts');

      showToast(
        'success',
        `Successfully mounted to Windows Drive Letter ${letter}! Accessible in File Explorer.`
      );
    }, 600);
  };

  const handleUnmount = (record: MountRecord) => {
    setActiveMounts((prev) => prev.filter((m) => m.id !== record.id));
    showToast('success', `Unmounted Drive Letter ${record.target_drive_letter} safely.`);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 32,
            zIndex: 2000,
            padding: '12px 20px',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderRadius: 6,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            background: toast.type === 'success' ? '#065f46' : '#78350f',
            border: `1px solid ${toast.type === 'success' ? '#10b981' : '#f59e0b'}`,
            color: '#ffffff',
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <Header scanResult={scanResult} onRefresh={performDriveScan} isScanning={isScanning} />

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'drives' ? 'active' : ''}`}
          onClick={() => setActiveTab('drives')}
        >
          <HardDrive size={18} />
          <span>Physical Fixed Drives ({scanResult?.drives.length || 0})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          <UploadCloud size={18} />
          <span>Linux Image Mount Loader</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          <Layers size={18} />
          <span>Ext4 File Explorer</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'mounts' ? 'active' : ''}`}
          onClick={() => setActiveTab('mounts')}
        >
          <Activity size={18} />
          <span>Active Mounted Drives ({activeMounts.length})</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main style={{ minHeight: 500 }}>
        {activeTab === 'drives' && scanResult && (
          <DriveTopologyGrid
            drives={scanResult.drives}
            onSelectPartitionForMount={handleOpenPartitionMountModal}
            onBrowseExt4={() => {
              setActiveTab('explorer');
            }}
          />
        )}

        {activeTab === 'images' && (
          <ImageMountDropzone onSelectImageForMount={handleOpenImageMountModal} />
        )}

        {activeTab === 'explorer' && (
          <Ext4FileBrowser
            partitionName="Drive 3 Partition 2 (Volume{74af99f9-7aae-403a-a6ce-8a503b41a380})"
          />
        )}

        {activeTab === 'mounts' && (
          <ActiveMountsTable mounts={activeMounts} onUnmount={handleUnmount} />
        )}
      </main>

      {/* Mount Modal */}
      {modalOpen && (
        <MountModal
          title={modalTitle}
          sourceDescription={modalSourceDesc}
          onClose={() => setModalOpen(false)}
          onConfirmMount={handleConfirmMount}
          isSubmitting={isSubmittingMount}
        />
      )}
    </div>
  );
}
export default App;
