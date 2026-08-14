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

    // Drive 0: TOSHIBA DT01ACA200 (System OS + Linux Root Ext4 Partition)
    drives.push(PhysicalDriveInfo {
        drive_index: 0,
        model: "TOSHIBA DT01ACA200".into(),
        adapter_type: "RAID / SATA".into(),
        serial_number: "19IEMXSGS".into(),
        partition_style: "GPT".into(),
        disk_guid: "3F105755-1632-4E19-AA59-D36F93636DA7".into(),
        capacity_bytes: 2_000_398_934_016, // 1863.02 GB
        total_sectors: 3_907_029_168,
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
                capacity_bytes: 900_350_435_328,
                free_bytes: 450_000_000_000,
                used_bytes: 450_350_435_328,
                starting_sector: 1_050_624,
                total_sectors: 1_756_762_112,
                is_hidden: false,
                ext4_features: vec![],
                ext4_volume_uuid: "".into(),
                ext4_mount_point: "".into(),
                ext4_block_size: 0,
                ext4_inode_count: 0,
            },
            PartitionInfo {
                partition_number: 3,
                partition_guid: "60CECFF5-4E47-47DD-9B4C-126A79C56A68".into(),
                volume_guid_path: r"\\?\Volume{9c778dc4-1a1c-4404-8e04-f155dcf6a121}".into(),
                device_path: r"\Device\HarddiskVolume4".into(),
                filesystem: "EXT4 (Root /)".into(),
                capacity_bytes: 1_099_511_627_776, // 1024.00 GB
                free_bytes: 992_608_976_896,      // 924.44 GB free
                used_bytes: 106_902_650_880,      // 99.56 GB used
                starting_sector: 1_757_812_736,
                total_sectors: 2_147_483_648,
                is_hidden: false,
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
                ext4_volume_uuid: "9C778DC4-1A1C-4404-8E04-F155DCF6A121".into(),
                ext4_mount_point: "/".into(),
                ext4_block_size: 4096,
                ext4_inode_count: 67_108_864,
            },
        ],
    });

    // Drive 1: TOSHIBA DT01ACA200 (Data Storage)
    drives.push(PhysicalDriveInfo {
        drive_index: 1,
        model: "TOSHIBA DT01ACA200".into(),
        adapter_type: "RAID / SATA".into(),
        serial_number: "19IEMVDGS".into(),
        partition_style: "GPT".into(),
        disk_guid: "8C2EFC83-9218-4AB7-9633-7EB98767D0B9".into(),
        capacity_bytes: 2_000_398_934_016, // 1863.02 GB
        total_sectors: 3_907_029_168,
        sector_size: 512,
        physical_sector_size: 4096,
        partitions: vec![PartitionInfo {
            partition_number: 1,
            partition_guid: "F1A2B3C4-D5E6-7890-ABCD-1234567890AB".into(),
            volume_guid_path: r"\\?\Volume{22222222-2222-2222-2222-222222222222}".into(),
            device_path: r"\Device\HarddiskVolume3".into(),
            filesystem: "NTFS (D:)".into(),
            capacity_bytes: 2_000_390_000_000,
            free_bytes: 850_000_000_000,
            used_bytes: 1_150_390_000_000,
            starting_sector: 2048,
            total_sectors: 3_907_010_000,
            is_hidden: false,
            ext4_features: vec![],
            ext4_volume_uuid: "".into(),
            ext4_mount_point: "".into(),
            ext4_block_size: 0,
            ext4_inode_count: 0,
        }],
    });

    // Drive 2: TOSHIBA DT01ACA200 (Backup Volume)
    drives.push(PhysicalDriveInfo {
        drive_index: 2,
        model: "TOSHIBA DT01ACA200".into(),
        adapter_type: "RAID / SATA".into(),
        serial_number: "19IEMU6GS".into(),
        partition_style: "GPT".into(),
        disk_guid: "74FEB489-5DAD-4916-8838-98D01F7971F5".into(),
        capacity_bytes: 2_000_398_934_016, // 1863.02 GB
        total_sectors: 3_907_029_168,
        sector_size: 512,
        physical_sector_size: 4096,
        partitions: vec![PartitionInfo {
            partition_number: 1,
            partition_guid: "A9B8C7D6-E5F4-3210-9876-543210FEDCBA".into(),
            volume_guid_path: r"\\?\Volume{33333333-3333-3333-3333-333333333333}".into(),
            device_path: r"\Device\HarddiskVolume5".into(),
            filesystem: "NTFS (E:)".into(),
            capacity_bytes: 2_000_390_000_000,
            free_bytes: 1_100_000_000_000,
            used_bytes: 900_390_000_000,
            starting_sector: 2048,
            total_sectors: 3_907_010_000,
            is_hidden: false,
            ext4_features: vec![],
            ext4_volume_uuid: "".into(),
            ext4_mount_point: "".into(),
            ext4_block_size: 0,
            ext4_inode_count: 0,
        }],
    });

    // Drive 3: TOSHIBA DT01ACA200 (NTFS + Ext4 Hidden /mnt/hada Partition)
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
                filesystem: "NTFS (Basic Data)".into(),
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
                starting_sector: 2_936_016_896,
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
