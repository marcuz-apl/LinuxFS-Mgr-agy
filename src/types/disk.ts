export interface PartitionInfo {
  partition_number: number;
  partition_guid: string;
  volume_guid_path: string;
  device_path: string;
  filesystem: string;
  capacity_bytes: number;
  free_bytes: number;
  used_bytes: number;
  starting_sector: number;
  total_sectors: number;
  is_hidden: boolean;
  ext4_features: string[];
  ext4_volume_uuid: string;
  ext4_mount_point: string;
  ext4_block_size: number;
  ext4_inode_count: number;
}

export interface PhysicalDriveInfo {
  drive_index: number;
  model: string;
  adapter_type: string;
  serial_number: string;
  partition_style: string;
  disk_guid: string;
  capacity_bytes: number;
  total_sectors: number;
  sector_size: number;
  physical_sector_size: number;
  partitions: PartitionInfo[];
}

export interface SystemScanResult {
  drives: PhysicalDriveInfo[];
  is_admin: boolean;
  scan_timestamp: string;
}

export interface MountRecord {
  id: string;
  source_type: 'PARTITION' | 'IMAGE';
  source_path: string;
  target_drive_letter: string;
  mount_engine: string;
  is_read_only: boolean;
  mount_time: string;
  status: string;
  bytes_read: number;
  bytes_written: number;
  wsl_mount_name: string;
}

export interface MountResponse {
  success: boolean;
  message: string;
  record?: MountRecord;
}

export interface Ext4Entry {
  name: string;
  path: string;
  is_dir: boolean;
  size_bytes: number;
  permissions: string;
  owner_uid_gid: string;
  modified_time: string;
}

export interface Ext4DirectoryResponse {
  current_path: string;
  entries: Ext4Entry[];
}
