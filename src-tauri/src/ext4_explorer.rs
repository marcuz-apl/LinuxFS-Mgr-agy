use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ext4Entry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size_bytes: u64,
    pub permissions: String, // e.g. "rwxr-xr-x"
    pub owner_uid_gid: String, // e.g. "root:root (0:0)"
    pub modified_time: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Ext4DirectoryResponse {
    pub current_path: String,
    pub entries: Vec<Ext4Entry>,
}

pub fn get_ext4_directory_contents(target_path: &str) -> Ext4DirectoryResponse {
    let clean_path = if target_path.is_empty() || target_path == "/" {
        "/"
    } else {
        target_path
    };

    let mut entries = Vec::new();

    if clean_path == "/" {
        entries.push(Ext4Entry {
            name: "bin".into(),
            path: "/bin".into(),
            is_dir: true,
            size_bytes: 4096,
            permissions: "rwxr-xr-x".into(),
            owner_uid_gid: "root:root (0:0)".into(),
            modified_time: "2026-08-10 14:20:00".into(),
        });
        entries.push(Ext4Entry {
            name: "boot".into(),
            path: "/boot".into(),
            is_dir: true,
            size_bytes: 4096,
            permissions: "rwxr-xr-x".into(),
            owner_uid_gid: "root:root (0:0)".into(),
            modified_time: "2026-08-10 14:22:10".into(),
        });
        entries.push(Ext4Entry {
            name: "etc".into(),
            path: "/etc".into(),
            is_dir: true,
            size_bytes: 12288,
            permissions: "rwxr-xr-x".into(),
            owner_uid_gid: "root:root (0:0)".into(),
            modified_time: "2026-08-11 09:15:30".into(),
        });
        entries.push(Ext4Entry {
            name: "home".into(),
            path: "/home".into(),
            is_dir: true,
            size_bytes: 4096,
            permissions: "rwxr-xr-x".into(),
            owner_uid_gid: "root:root (0:0)".into(),
            modified_time: "2026-08-12 11:00:00".into(),
        });
        entries.push(Ext4Entry {
            name: "mnt".into(),
            path: "/mnt".into(),
            is_dir: true,
            size_bytes: 4096,
            permissions: "rwxr-xr-x".into(),
            owner_uid_gid: "root:root (0:0)".into(),
            modified_time: "2026-08-12 11:21:00".into(),
        });
        entries.push(Ext4Entry {
            name: "var".into(),
            path: "/var".into(),
            is_dir: true,
            size_bytes: 4096,
            permissions: "rwxr-xr-x".into(),
            owner_uid_gid: "root:root (0:0)".into(),
            modified_time: "2026-08-12 12:45:00".into(),
        });
    } else if clean_path.starts_with("/mnt") || clean_path.starts_with("/home") {
        entries.push(Ext4Entry {
            name: "hada".into(),
            path: format!("{}/hada", clean_path),
            is_dir: true,
            size_bytes: 4096,
            permissions: "rwxr-xr-x".into(),
            owner_uid_gid: "1000:1000".into(),
            modified_time: "2026-08-12 11:21:00".into(),
        });
        entries.push(Ext4Entry {
            name: "backup_config.json".into(),
            path: format!("{}/backup_config.json", clean_path),
            is_dir: false,
            size_bytes: 14208,
            permissions: "rw-r--r--".into(),
            owner_uid_gid: "1000:1000".into(),
            modified_time: "2026-08-12 10:14:22".into(),
        });
        entries.push(Ext4Entry {
            name: "kernel_dump.log".into(),
            path: format!("{}/kernel_dump.log", clean_path),
            is_dir: false,
            size_bytes: 849201,
            permissions: "rw-r--r--".into(),
            owner_uid_gid: "root:root (0:0)".into(),
            modified_time: "2026-08-12 08:30:11".into(),
        });
    } else {
        entries.push(Ext4Entry {
            name: "config.yaml".into(),
            path: format!("{}/config.yaml", clean_path),
            is_dir: false,
            size_bytes: 3512,
            permissions: "rw-r--r--".into(),
            owner_uid_gid: "root:root (0:0)".into(),
            modified_time: "2026-08-11 16:20:00".into(),
        });
    }

    Ext4DirectoryResponse {
        current_path: clean_path.into(),
        entries,
    }
}
