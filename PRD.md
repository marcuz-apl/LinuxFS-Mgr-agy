# Product Requirements Document (PRD)

## Project Title: LinuxFS Manager (Windows 11 Ext4 & Image Mounting Utility)
**Document Version:** `1.0.0` (Stored in `VERSION`)  
**Status:** Approved for Implementation  
**Skill Compliance:** [Alfazen Versioning v1.0.0](file:///e:/projects/LinuxFS-Mgr-agy/.agents/skills/alfazen-versioning/SKILL.md)  
**Target OS:** Windows 11 (x64 / ARM64)  
**Company:** *Alfazen Inc. - An information services firm helping small businesses succeed.*

---

## 1. Executive Summary

**LinuxFS Manager** is a high-performance Windows 11 desktop application designed to bridge the gap between Windows and Linux storage filesystems. It enables Windows users to effortlessly detect, explore, and access Linux Ext4 partitions on physical fixed disk drives (such as multi-partition drives containing both NTFS and Ext4 volumes) and mount Linux disk images (`.img`, `.ext4`, `.iso`, `.vhdx`, `.vhd`, `.qcow2`) directly as native Windows Drive Letters (e.g. `E:`, `Z:`).

The application pairs a futuristic, dark-mode glassmorphic user interface with a high-throughput, low-footprint Rust backend utilizing Win32 APIs, WSL2 Kernel Mounting, and WinFSP (Windows File System Proxy).

---

## 2. Hardware & Environment Reference

The initial development and target validation environment is configured based on the verified host system metrics:

```mermaid
graph TD
    subgraph Host System [Windows 11 Host PC - 4 Physical Drives]
        D0[Drive 0: OS / System Disk]
        D1[Drive 1: Data Storage]
        D2[Drive 2: Backup Volume]
        subgraph D3 [Drive 3: TOSHIBA DT01ACA200 - GPT Table]
            D3P1[Partition 1: NTFS Volume]
            D3P2[Partition 2: EXT4 Hidden Volume]
        end
    end
    
    D3P2 --> |GUID Path: \\?\Volume{74af99f9-7aae-403a-a6ce-8a503b41a380}| LFM[LinuxFS Manager Engine]
    LFM --> |Mount Mapping| Letter[Windows Virtual Drive Letter Z:]
```

### Verified Target Partition Profile (Drive 3 Partition 2):
* **Disk Model:** TOSHIBA DT01ACA200 (Capacity: 1863.02 GB / 2TB GPT Disk)
* **Disk GUID:** `2FC69765-CA3C-4BAF-ACD3-319568B3720F`
* **Partition 2 File System:** Ext4 (Hidden Partition)
* **Capacity:** 463.01 GB (Used: 8.34 GB, Free: 454.67 GB)
* **Volume GUID Path:** `\\?\Volume{74af99f9-7aae-403a-a6ce-8a503b41a380}`
* **Device Path:** `\Device\HarddiskVolume9`
* **Ext4 Feature Flags:** `has_journal`, `ext_attr`, `resize_inode`, `dir_index`, `filetype`, `extents`, `64bit`, `flex_bg`, `sparse_super`, `huge_file`, `extra_isize`
* **Original Linux Mount Point:** `/mnt/hada`
* **Volume UUID:** `3AE3CB43-2DDD-49F6-A35B-64B8E4AF5F94`
* **Partition GUID:** `74AF99F9-7AAE-403A-A6CE-8A503B41A380`

---

## 3. Technology Stack & Framework Recommendation

### 3.1 Framework Selection Rationale

| Layer | Recommended Choice | Alternative Evaluated | Why Tauri 2.0 + Rust Wins |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | **Tauri 2.0 + React 18 + TypeScript** | Electron / WinUI 3 C# | **Ultra-lightweight** (~15MB RAM idle vs 150MB+ for Electron). Enables custom web glassmorphism visuals while leveraging native Windows WebView2. |
| **Backend Core** | **Rust (Tauri Core + Win32 / Tokio)** | C# .NET 8 / C++ Win32 | **Memory Safety & Performance**: Direct P/Invoke capability to Windows Kernel, safe memory management, zero runtime overhead for IO operations. |
| **Mount Driver** | **Dual-Engine (WSL2 + WinFSP)** | Ext2FSD / Paragon | **WSL2** provides 100% native kernel Ext4 stability with zero risk of filesystem corruption. **WinFSP** provides zero-dependency userland mounting. |

### 3.2 System Architecture Diagram

```
+-----------------------------------------------------------------------+
|                       LinuxFS Manager (React 18 UI)                   |
|   - Physical Disk Map   - Image File Dropzone   - Active Mount Grid   |
+-----------------------------------------------------------------------+
                                   |  (IPC Invocation via Tauri 2.0)
+-----------------------------------------------------------------------+
|                      Rust Engine Backend (Tauri Core)                 |
|   - Device Scanner     - Virtual Drive Manager  - System Privilege    |
+-----------------------------------------------------------------------+
             /                                             \
            v                                               v
+-----------------------+                       +-----------------------+
|  Engine A: WSL2 Mount |                       | Engine B: WinFSP Fuse |
|  wsl --mount --bare   |                       | WinFSP Userland Driver|
+-----------------------+                       +-----------------------+
            \                                               /
             v                                             v
+-----------------------------------------------------------------------+
|                     Windows Explorer Drive Letter Mapping             |
|                  DefineDosDeviceW() / WNetAddConnection2W()           |
|                          Mapped Drive (e.g. Z:\)                      |
+-----------------------------------------------------------------------+
```

---

## 4. Key Functional Features

### Feature 1: Physical Drive & Partition Auto-Discovery
- **Disk Topology View**: Scans all physical drives (`\\.\PHYSICALDRIVE0` through `PHYSICALDRIVE3`) and displays partition tables (GPT/MBR), volume labels, capacities, partition attributes, and filesystem signatures (NTFS, FAT32, Ext2/3/4, Btrfs, XFS).
- **Ext4 Partition Detection**: Highlights hidden Ext4 partitions (such as Drive 3 Partition 2 `Volume{74af99f9-7aae-403a-a6ce-8a503b41a380}`).
- **Partition Metadata Inspector**: Displays block size, inode counts, group block counts, journal flags, volume UUID, and original mount point (`/mnt/hada`).

### Feature 2: Linux Image Loader & Virtual Drive Mount
- **Multi-Format Image Support**: Load raw disk images (`.img`, `.raw`, `.ext4`), virtual machine disk files (`.vhdx`, `.vhd`, `.qcow2`), and ISO images.
- **Drag-and-Drop Loader**: User can drag any `.img` or `.vhdx` file into the UI dropzone for instant validation and mount setup.
- **Windows Drive Letter Mapping**: Pick any available drive letter (`E:` through `Z:`) to assign to the mounted partition/image.
- **Read-Only / Read-Write Security Toggle**: Default mounts are forced to **Read-Only** mode to safeguard Linux file permissions and journal integrity.

### Feature 3: Built-in Ext4 File Browser & Explorer
- **Native File Tree View**: Explore Ext4 directories directly inside the application without mounting to Windows Explorer if preferred.
- **File Preview & Metadata**: View file attributes, UID/GID Linux permissions, file size, creation/modification timestamps.
- **One-Click File Extraction**: Export files/folders directly from Ext4 volumes to local Windows NTFS directories.

### Feature 4: Real-time Mount Dashboard & Health Monitor
- **Active Mount Table**: View all currently active virtual drives, mount engines used, mount duration, read/write speed, and volume usage bars.
- **Eject & Safe Unmount**: One-click safe unmounting that cleanly flushes buffers, removes the Windows Drive Letter, and unmounts the underlying disk image/partition.

---

## 5. Non-Functional Requirements & Security

1. **Safety & Non-Destructive Operation**: Partition scanner MUST perform read-only disk handles to ensure no partition tables are modified accidentally.
2. **Elevated Privileges (UAC)**: Windows Admin rights are required for raw disk handles and drive letter assignment. Application will prompt for elevation cleanly via manifest.
3. **Clean Teardown**: In case of unexpected system termination, startup checks will detect orphaned drive letter assignments or stale WSL2 mount endpoints and offer automated cleanup.
4. **Performance**: Initial disk scan must complete in under 500ms. Image loading to Drive Letter completion in under 2.0 seconds.

---

## 6. Versioning & Quality Controls (Alfazen Versioning)

- **Version Storage**: Repository root `VERSION` file (initial `1.0.0`).
- **Rollover Mechanics**: `m.n.p` structure with single-digit constraints (`0`–`9`) for minor `n` and patch `p`.
- **Git Hook Automation**: `.githooks/pre-commit` and `.githooks/prepare-commit-msg` automatically stage version updates and format commit subjects (`v{m.n.p} build {yyyy-mm-dd-hhmm} <subject>`).
