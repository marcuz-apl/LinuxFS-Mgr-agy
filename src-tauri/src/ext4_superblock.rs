//! Read-only ext4 superblock parser.
//!
//! Ext4 stores the primary superblock at byte offset 1024 from the start of the
//! filesystem (the first 1024 bytes are reserved for x86 boot sectors / boot code).
//! We open the raw partition with `GENERIC_READ` + full share modes, seek to the
//! superblock, and decode the little-endian fields the inspector UI shows.
//!
//! All fields are little-endian per the ext4 on-disk specification.

use std::fs::File;
use std::io::{Read, Seek, SeekFrom};
use std::os::windows::io::FromRawHandle;

use windows::Win32::Foundation::{GENERIC_READ, HANDLE};
use windows::Win32::Storage::FileSystem::{
    CreateFileW, FILE_ATTRIBUTE_NORMAL, FILE_FLAGS_AND_ATTRIBUTES, FILE_SHARE_READ, FILE_SHARE_WRITE,
    OPEN_EXISTING,
};

/// Parsed ext4 primary superblock fields surfaced to the UI / scanner.
#[derive(Debug, Clone, Default)]
pub struct Ext4Superblock {
    pub block_size: u32,
    pub inode_count: u32,
    pub magic: u16,
    pub uuid_hex: String,
    pub last_mounted: String,
    pub feature_compat: u32,
    pub feature_incompat: u32,
    pub feature_ro_compat: u32,
}

const EXT_SUPER_MAGIC: u16 = 0xEF53;
const SB_OFFSET: u64 = 1024;

/// Bit flags for the `compat`/`incompat` superblock feature words.
mod flags {
    // s_feature_compat
    pub const HAS_JOURNAL: u32 = 0xC;
    pub const EXT_ATTR: u32 = 0x20;
    pub const RESIZE_INODE: u32 = 0x40;
    pub const DIR_INDEX: u32 = 0x80;
    // s_feature_incompat
    pub const FILETYPE: u32 = 0x2;
    pub const EXTENTS: u32 = 0x100;
    pub const _64BIT: u32 = 0x200;
    pub const MMP: u32 = 0x400;
    pub const FLEX_BG: u32 = 0x800;
    // s_feature_ro_compat
    pub const SPARSE_SUPER: u32 = 0x01;
    pub const HUGE_FILE: u32 = 0x08;
    pub const EXTRA_ISIZE: u32 = 0x40;
}

impl Ext4Superblock {
    /// Try to read and decode the ext4 superblock from a raw device path that points
    /// at the *start of the filesystem* (a whole partition or a partition device),
    /// such as `\\.\Volume{GUID}`. Returns `None` when the filesystem is not ext2/3/4
    /// or the device cannot be opened read-only (e.g. permission denied).
    pub fn read(device_path: &str) -> Option<Ext4Superblock> {
        let desired = GENERIC_READ.0; // u32
        let share = FILE_SHARE_READ | FILE_SHARE_WRITE; // FILE_SHARE_MODE
        let handle: HANDLE = unsafe {
            CreateFileW(
                device_path,
                desired,
                share,
                None,
                OPEN_EXISTING,
                FILE_FLAGS_AND_ATTRIBUTES(FILE_ATTRIBUTE_NORMAL.0),
                HANDLE::default(),
            )
            .ok()?
        };
        if handle.is_invalid() {
            return None;
        }

        // Wrap the raw handle so it is closed deterministically on return.
        let file = unsafe { File::from_raw_handle(handle.0) };

        let mut buf = [0u8; 1024];
        let mut ok = false;
        {
            let mut f = file.try_clone().ok()?;
            f.seek(SeekFrom::Start(SB_OFFSET)).ok()?;
            if f.read_exact(&mut buf).is_ok() {
                ok = true;
            }
        }
        drop(file);

        if !ok {
            return None;
        }
        parse_superblock(&buf)
    }
}

fn parse_u16(buf: &[u8], off: usize) -> u16 {
    ((buf[off] as u16) | ((buf[off + 1] as u16) << 8))
}
fn parse_u32(buf: &[u8], off: usize) -> u32 {
    ((buf[off] as u32))
        | ((buf[off + 1] as u32) << 8)
        | ((buf[off + 2] as u32) << 16)
        | ((buf[off + 3] as u32) << 24)
}

fn parse_superblock(buf: &[u8]) -> Option<Ext4Superblock> {
    let magic = parse_u16(buf, 0x38);
    if magic != EXT_SUPER_MAGIC {
        return None;
    }
    // s_log_block_size at offset 0x18: block size = 1024 << n.
    let s_log_block_size = buf[0x18] as u32;
    let block_size = 1024u32 << s_log_block_size;

    let inode_count = parse_u32(buf, 0x00);
    let feature_compat = parse_u32(buf, 0x5C);
    let feature_incompat = parse_u32(buf, 0x60);
    let feature_ro_compat = parse_u32(buf, 0x64);

    let mut uuid_bytes = [0u8; 16];
    uuid_bytes.copy_from_slice(&buf[0x68..0x78]);
    let uuid_hex: String = uuid_bytes.iter().map(|b| format!("{:02X}", b)).collect();

    // s_last_mounted at offset 0x58, 64-byte NUL-padded ASCII path.
    let mut last_mounted = String::new();
    for &c in &buf[0x58..0x58 + 64] {
        if c == 0 {
            break;
        }
        last_mounted.push(c as char);
    }

    Some(Ext4Superblock {
        block_size,
        inode_count,
        magic,
        uuid_hex,
        last_mounted,
        feature_compat,
        feature_incompat,
        feature_ro_compat,
    })
}

/// Map raw superblock feature flag bits to human-readable feature names for the
/// inspector badges (has_journal, filetype, extents, 64bit, flex_bg, ...).
pub fn feature_flag_names(compat: u32, incompat: u32, ro_compat: u32) -> Vec<String> {
    let mut names = Vec::new();

    let compat_names: &[(u32, &str)] = &[
        (flags::HAS_JOURNAL, "has_journal"),
        (flags::EXT_ATTR, "ext_attr"),
        (flags::RESIZE_INODE, "resize_inode"),
        (flags::DIR_INDEX, "dir_index"),
    ];
    let incompat_names: &[(u32, &str)] = &[
        (flags::FILETYPE, "filetype"),
        (flags::EXTENTS, "extents"),
        (flags::_64BIT, "64bit"),
        (flags::MMP, "mmp"),
        (flags::FLEX_BG, "flex_bg"),
    ];
    let ro_names: &[(u32, &str)] = &[
        (flags::SPARSE_SUPER, "sparse_super"),
        (flags::HUGE_FILE, "huge_file"),
        (flags::EXTRA_ISIZE, "extra_isize"),
    ];

    for (bit, name) in compat_names {
        if compat & bit != 0 {
            names.push((*name).to_string());
        }
    }
    for (bit, name) in incompat_names {
        if incompat & bit != 0 {
            names.push((*name).to_string());
        }
    }
    for (bit, name) in ro_names {
        if ro_compat & bit != 0 {
            names.push((*name).to_string());
        }
    }
    names
}