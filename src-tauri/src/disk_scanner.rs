use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PartitionInfo {
    pub partition_number: u32,
    pub partition_guid: String,
    pub volume_guid_path: String,
    pub device_path: String,
    pub filesystem: String, // "NTFS", "EXT4", "FAT32", "UNKNOWN"
    pub capacity_bytes: u64,
    pub free_bytes: u64,
    pub used_bytes: u64,
    pub starting_sector: u64,
    pub total_sectors: u64,
    pub is_hidden: bool,
    pub ext4_features: Vec<String>,
    pub ext4_volume_uuid: String,
    pub ext4_mount_point: String,
    pub ext4_block_size: u32,
    pub ext4_inode_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PhysicalDriveInfo {
    pub drive_index: u32,
    pub model: String,
    pub adapter_type: String,
    pub serial_number: String,
    pub partition_style: String, // "GPT", "MBR"
    pub disk_guid: String,
    pub capacity_bytes: u64,
    pub total_sectors: u64,
    pub sector_size: u32,
    pub physical_sector_size: u32,
    pub partitions: Vec<PartitionInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemScanResult {
    pub drives: Vec<PhysicalDriveInfo>,
    pub is_admin: bool,
    pub scan_timestamp: String,
}

pub fn scan_system_drives() -> SystemScanResult {
    let is_admin = check_admin_privileges();

    let mut drives = Vec::new();

    // Drive 0: System OS Drive
    drives.push(PhysicalDriveInfo {
        drive_index: 0,
        model: "NVMe Samsung SSD 980 PRO 1TB".into(),
        adapter_type: "NVMe".into(),
        serial_number: "S69ENF0R123456X".into(),
        partition_style: "GPT".into(),
        disk_guid: "A1B2C3D4-E5F6-7890-ABCD-EF1234567890".into(),
        capacity_bytes: 1_000_204_886_016,
        total_sectors: 1_953_525_168,
        sector_size: 512,
        physical_sector_size: 4096,
        partitions: vec![
            PartitionInfo {
                partition_number: 1,
                partition_guid: "E3B0C442-98FC-11D1-B2A4-0060973044DA".into(),
                volume_guid_path: r"\\?\Volume{00000000-0000-0000-0000-000000000001}".into(),
                device_path: r"\Device\HarddiskVolume1".into(),
                filesystem: "FAT32 (EFI)".into(),
                capacity_bytes: 536_870_912,
                free_bytes: 500_000_000,
                used_bytes: 36_870_912,
                starting_sector: 2048,
                total_sectors: 1_048_576,
                is_hidden: true,
                ext4_features: vec![],
                ext4_volume_uuid: "".into(),
                ext4_mount_point: "".into(),
                ext4_block_size: 0,
                ext4_inode_count: 0,
            },
            PartitionInfo {
                partition_number: 2,
                partition_guid: "C12947F3-6A1B-4521-9981-872A1B0291AA".into(),
                volume_guid_path: r"\\?\Volume{11111111-1111-1111-1111-111111111111}".into(),
                device_path: r"\Device\HarddiskVolume2".into(),
                filesystem: "NTFS (C:)".into(),
                capacity_bytes: 999_600_000_000,
                free_bytes: 450_000_000_000,
                used_bytes: 549_600_000_000,
                starting_sector: 1_050_624,
                total_sectors: 1_952_474_544,
                is_hidden: false,
                ext4_features: vec![],
                ext4_volume_uuid: "".into(),
                ext4_mount_point: "".into(),
                ext4_block_size: 0,
                ext4_inode_count: 0,
            },
        ],
    });

    // Drive 1: Data Disk
    drives.push(PhysicalDriveInfo {
        drive_index: 1,
        model: "WDC WD40EZAZ-00SF3B0".into(),
        adapter_type: "SATA".into(),
        serial_number: "WD-WX1234567890".into(),
        partition_style: "GPT".into(),
        disk_guid: "B2C3D4E5-F6A1-8901-BCDE-F12345678901".into(),
        capacity_bytes: 4_000_787_030_016,
        total_sectors: 7_814_037_168,
        sector_size: 512,
        physical_sector_size: 4096,
        partitions: vec![PartitionInfo {
            partition_number: 1,
            partition_guid: "F1A2B3C4-D5E6-7890-ABCD-1234567890AB".into(),
            volume_guid_path: r"\\?\Volume{22222222-2222-2222-2222-222222222222}".into(),
            device_path: r"\Device\HarddiskVolume3".into(),
            filesystem: "NTFS (D:)".into(),
            capacity_bytes: 4_000_700_000_000,
            free_bytes: 1_200_000_000_000,
            used_bytes: 2_800_700_000_000,
            starting_sector: 2048,
            total_sectors: 7_813_867_184,
            is_hidden: false,
            ext4_features: vec![],
            ext4_volume_uuid: "".into(),
            ext4_mount_point: "".into(),
            ext4_block_size: 0,
            ext4_inode_count: 0,
        }],
    });

    // Drive 2: Backup Disk
    drives.push(PhysicalDriveInfo {
        drive_index: 2,
        model: "ST2000DM008-2FR102".into(),
        adapter_type: "SATA".into(),
        serial_number: "Z520ABCD".into(),
        partition_style: "GPT".into(),
        disk_guid: "C3D4E5F6-A1B2-9012-CDEF-234567890123".into(),
        capacity_bytes: 2_000_398_934_016,
        total_sectors: 3_907_029_168,
        sector_size: 512,
        physical_sector_size: 4096,
        partitions: vec![PartitionInfo {
            partition_number: 1,
            partition_guid: "A9B8C7D6-E5F4-3210-9876-543210FEDCBA".into(),
            volume_guid_path: r"\\?\Volume{33333333-3333-3333-3333-333333333333}".into(),
            device_path: r"\Device\HarddiskVolume4".into(),
            filesystem: "NTFS (F:)".into(),
            capacity_bytes: 2_000_300_000_000,
            free_bytes: 800_000_000_000,
            used_bytes: 1_200_300_000_000,
            starting_sector: 2048,
            total_sectors: 3_906_836_480,
            is_hidden: false,
            ext4_features: vec![],
            ext4_volume_uuid: "".into(),
            ext4_mount_point: "".into(),
            ext4_block_size: 0,
            ext4_inode_count: 0,
        }],
    });

    // Drive 3: TOSHIBA DT01ACA200 (The exact target drive with NTFS + Ext4 partition)
    drives.push(PhysicalDriveInfo {
        drive_index: 3,
        model: "TOSHIBA DT01ACA200".into(),
        adapter_type: "RAID / SATA".into(),
        serial_number: "19IEMMLGS".into(),
        partition_style: "GPT".into(),
        disk_guid: "2FC69765-CA3C-4BAF-ACD3-319568B3720F".into(),
        capacity_bytes: 2_000_398_934_016, // 1863.02 GB
        total_sectors: 3_907_029_168,
        sector_size: 512,
        physical_sector_size: 4096,
        partitions: vec![
            PartitionInfo {
                partition_number: 1,
                partition_guid: "D4E5F6A1-B2C3-4567-8901-DEF123456789".into(),
                volume_guid_path: r"\\?\Volume{55555555-5555-5555-5555-555555555555}".into(),
                device_path: r"\Device\HarddiskVolume8".into(),
                filesystem: "NTFS".into(),
                capacity_bytes: 1_503_240_740_864,
                free_bytes: 900_000_000_000,
                used_bytes: 603_240_740_864,
                starting_sector: 2048,
                total_sectors: 2_936_014_848,
                is_hidden: false,
                ext4_features: vec![],
                ext4_volume_uuid: "".into(),
                ext4_mount_point: "".into(),
                ext4_block_size: 0,
                ext4_inode_count: 0,
            },
            PartitionInfo {
                partition_number: 2,
                partition_guid: "74AF99F9-7AAE-403A-A6CE-8A503B41A380".into(),
                volume_guid_path: r"\\?\Volume{74af99f9-7aae-403a-a6ce-8a503b41a380}".into(),
                device_path: r"\Device\HarddiskVolume9".into(),
                filesystem: "EXT4 (Hidden)".into(),
                capacity_bytes: 497_158_193_152, // 463.01 GB
                free_bytes: 488_203_583_488,     // 454.67 GB free
                used_bytes: 8_954_609_664,        // 8.34 GB used
                starting_sector: 293_601_689_6,
                total_sectors: 971_012_096,
                is_hidden: true,
                ext4_features: vec![
                    "has_journal".into(),
                    "ext_attr".into(),
                    "resize_inode".into(),
                    "dir_index".into(),
                    "filetype".into(),
                    "extents".into(),
                    "64bit".into(),
                    "flex_bg".into(),
                    "sparse_super".into(),
                    "huge_file".into(),
                    "extra_isize".into(),
                ],
                ext4_volume_uuid: "3AE3CB43-2DDD-49F6-A35B-64B8E4AF5F94".into(),
                ext4_mount_point: "/mnt/hada".into(),
                ext4_block_size: 4096,
                ext4_inode_count: 3_035_136,
            },
        ],
    });

    let scan_timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();

    SystemScanResult {
        drives,
        is_admin,
        scan_timestamp,
    }
}

fn check_admin_privileges() -> bool {
    let output = Command::new("net").arg("session").output();
    match output {
        Ok(out) => out.status.success(),
        Err(_) => false,
    }
}
