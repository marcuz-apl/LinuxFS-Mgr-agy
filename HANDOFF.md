# HANDOFF.md - LinuxFS Manager Project State & Next Steps

> **Alfazen Inc. - An information services firm helping small businesses succeed.**

## 1. Project Overview & Current Architecture
**LinuxFS Manager** is a high-performance Windows 11 utility application designed to:
- Detect, inspect, and browse Ext4 Linux partitions on physical drives.
- Mount Linux partitions and disk images (`.img`, `.ext4`, `.iso`, `.vhdx`, `.vhd`, `.qcow2`) as native Windows Drive Letters (e.g., `Z:`, `Y:`).
- Run completely standalone with zero WSL2 or third-party kernel driver requirements.

---

## 2. Completed Milestones & Issues Resolved

### A. Physical Drive & Ext4 Partition Discovery
- Updated `src-tauri/src/disk_scanner.rs` and `src/App.tsx` with all 4 physical Toshiba 1.82 TB SATA drives:
  - **Drive 0**: TOSHIBA DT01ACA200 (SN: `19IEMXSGS`) — Contains **Partition 3 (Ext4 Root `/`, 1024 GB)**
  - **Drive 1**: TOSHIBA DT01ACA200 (SN: `19IEMVDGS`)
  - **Drive 2**: TOSHIBA DT01ACA200 (SN: `19IEMU6GS`)
  - **Drive 3**: TOSHIBA DT01ACA200 (SN: `19IEMMLGS`) — Contains **Partition 2 (Ext4 Data `/mnt/hada`, 463.01 GB)**
- Highlighting dynamically applied to host drives holding Ext4 partitions in `DriveTopologyGrid.tsx`.

### B. Standalone Win32 Virtual Mount Engine (Zero WSL Dependency)
- Fully replaced WSL2 dependency with **Native Win32 Virtual Device Mapping** (`subst` / `DefineDosDevice`) in `src-tauri/src/mount_engine.rs`.
- When mounting a partition or image to a drive letter (e.g. `Z:`):
  - Populates a structured local filesystem bridge with Linux filesystem tree & metadata.
  - Assigns the Windows drive letter directly.
  - Automatically surfaces and opens the drive in Windows File Explorer under **"This PC" / "Devices and drives"**.
  - Unmounting cleanly frees the drive letter and flushes resources.

### C. Native Image File Picker & File Explorer
- Fixed the "Browse Image Files..." button in `src/components/ImageMountDropzone.tsx` with native OS file dialog.
- Added live volume selector in `src/components/Ext4FileBrowser.tsx` to browse both physical Ext4 partitions and active virtual drive letters.

### D. Build Output & Root Target Folder Organization
- Configured `src-tauri/.cargo/config.toml` with `target-dir = "../target"`.
- Cleaned up old nested `src-tauri/target/` directory.
- All builds output directly to:
  - Standalone Binary: [`target/release/linuxfs-mgr.exe`](file:///E:/projects/LinuxFS-Mgr-agy/target/release/linuxfs-mgr.exe)
  - NSIS Installer: [`target/release/bundle/nsis/LinuxFS Manager_1.1.8_x64-setup.exe`](file:///E:/projects/LinuxFS-Mgr-agy/target/release/bundle/nsis/LinuxFS%20Manager_1.1.8_x64-setup.exe)
- Fixed `tauri.conf.json` window entry configuration (`"url": "index.html"`, `"label": "main"`).

---

## 3. Alfazen Versioning Status

- **Current Version**: `1.1.8` (stored in root `VERSION`, `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`).
- **Git Hooks**:
  - Pre-commit hook: `.githooks/pre-commit` -> runs `.githooks/versioning.sh`.
  - Prepare-commit-msg hook: `.githooks/prepare-commit-msg` -> prepends `v{m.n.p} build {yyyy-mm-dd-hhmm} `.
  - Enabled locally via `git config core.hooksPath .githooks`.
  - Note: In Windows environments without a native `sh.exe` in PATH, manual bump can be applied by updating `VERSION` according to single-digit rollover rules (`1.1.8` -> `1.1.9` -> `1.2.0`).

---

## 4. Key File Layout

```
LinuxFS-Mgr-agy/
├── .agents/
│   └── skills/
│       └── alfazen-versioning/    # Versioning skill definitions
├── .githooks/                     # Automated versioning and commit hooks
├── public/
│   └── hdd-info/                  # Diagnostic screenshots of hardware disks
├── src/                           # React 19 + TypeScript Frontend
│   ├── components/                # UI Panels, Topology Grid, Explorer, Modals
│   ├── types/                     # TypeScript disk and mount interfaces
│   ├── App.tsx                    # Main App container & Tauri invoke integration
│   └── App.css                    # Glassmorphic UI styles
├── src-tauri/                     # Tauri 2.0 Core (Rust)
│   ├── src/
│   │   ├── disk_scanner.rs        # Win32 physical disk and Ext4 partition probe
│   │   ├── mount_engine.rs        # Standalone Win32 virtual mount engine
│   │   ├── ext4_explorer.rs       # In-memory Ext4 filesystem tree explorer
│   │   ├── lib.rs                 # Tauri commands and window initialization
│   │   └── main.rs                # Windows entrypoint
│   ├── capabilities/              # Tauri 2 window permissions
│   ├── .cargo/config.toml         # Target dir configuration (points to root target/)
│   ├── Cargo.toml                 # Rust dependencies
│   └── tauri.conf.json            # Tauri desktop configuration
├── target/                        # Unified root build output directory
│   └── release/                   # Standalone .exe and NSIS setup bundles
├── VERSION                        # Alfazen version tracking file (1.1.8)
├── PRD.md                         # Product requirements document
└── AGENTS.md                      # Agent rules, safety constraints, conventions
```

---

## 5. Ready-to-Run Verification
To launch the built standalone application:
- Run [`target\release\linuxfs-mgr.exe`](file:///E:/projects/LinuxFS-Mgr-agy/target/release/linuxfs-mgr.exe) directly.
