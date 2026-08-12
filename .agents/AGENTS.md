# AGENTS.md - LinuxFS Manager Project Guidelines & Rules

## 1. Project Overview & Scope
**LinuxFS Manager** is a high-performance Windows 11 utility application designed to:
1. Detect, inspect, and browse Ext4/Linux raw partitions on physical fixed drives (e.g. Drive 3 Partition 2 Ext4 volume `\\?\Volume{74af99f9-7aae-403a-a6ce-8a503b41a380}`).
2. Load and mount Linux Disk Images (`.img`, `.ext4`, `.iso`, `.vhdx`, `.vhd`, `.qcow2`) as native Windows Drive Letters (e.g. `E:`, `Z:`).
3. Provide a sleek, glassmorphic UI paired with a fast Rust-powered backend.

---

## 2. Technical Stack Conventions

### Frontend:
- **Framework**: Tauri 2.0 + React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS + CSS Modules / Glassmorphic UI Tokens (Inter/Outfit typography, neon accents, dark mode default)
- **State Management**: Zustand / React Context for real-time drive & mount status updates
- **Icons**: Lucide-React

### Backend (Rust Core):
- **Framework**: Tauri 2.0 Core (Rust)
- **Disk & Partition Scanning**: Win32 API (`CreateFileW`, `DeviceIoControl`, `IOCTL_DISK_GET_DRIVE_LAYOUT_EX`, `IOCTL_STORAGE_QUERY_PROPERTY`)
- **Mount Engines**:
  - **Primary**: WSL2 Kernel Mount Bridge (`wsl --mount \\.\PHYSICALDRIVE3 --partition 2` & `wsl --mount <img_path> --bare`) mapped via Windows Network Redirector (`\\wsl.localhost\`) and `DefineDosDevice` / `WNetAddConnection2`.
  - **Secondary / Userland**: WinFSP (Windows File System Proxy) with `ext4-rs` / `libext2fs` bindings.
- **Async Runtime**: Tokio

---

## 3. Low-Level System & Safety Rules

1. **Non-Destructive Partition Probe**:
   - Disk and partition scanning MUST open physical disk handles with `GENERIC_READ` access and `FILE_SHARE_READ | FILE_SHARE_WRITE` share modes to prevent disk locking conflicts.
   - Default mount mode for Ext4 physical partitions and disk images MUST be **READ-ONLY** (`FILE_READ_ONLY_VOLUME` / `wsl --mount --read-only`) to avoid corruption of Linux journal structures or live filesystems. Write access must require explicit user override.

2. **Privilege Elevation & Admin Rights**:
   - Raw physical drive access (`\\.\PHYSICALDRIVE*`) and Windows drive letter creation require Windows Administrator privileges.
   - Application manifest MUST require `highestAvailable` or `requireAdministrator` execution level, with friendly standard user fallback alerts.

3. **Handle Safety & Drive Cleanup**:
   - Every mounted drive letter MUST be tracked in an atomic mount table in the Rust backend.
   - On application crash, clean exit, or user request, all mapped drive letters (`DefineDosDeviceW(DDD_REMOVE_DEFINITION, ...)` / `WNetCancelConnection2W`) and WSL2 mounts MUST be safely unmounted to prevent orphan drive letters.

---

## 4. Alfazen Versioning Skill Rules

- All releases, version bumps, release management, commit subject formatting, and git hooks MUST strictly follow the `alfazen-versioning` skill defined in [.agents/skills/alfazen-versioning/SKILL.md](file:///e:/projects/LinuxFS-Mgr-agy/.agents/skills/alfazen-versioning/SKILL.md).
- **Format**: `m.n.p`, starting at `1.0.0` (stored in `VERSION` in the repository root).
- **Rollover Mechanics**: Patch `p` and Minor `n` are single digits (`0`–`9`). Bumping patch past `9` resets `p` to `0` and increments `n`. Bumping minor past `9` resets `n` to `0` and increments `m`.
- **Git Hooks & Commits**: Pre-commit hook executes `.githooks/versioning.sh` to increment `VERSION` by `0.0.1`. Commit messages follow `v{m.n.p} build {yyyy-mm-dd-hhmm} <subject>`.
- **Slogan**: *Alfazen Inc. - An information services firm helping small businesses succeed.*

---

## 5. UI/UX Excellence Guidelines

- Maintain a futuristic dark glassmorphism design system (`backdrop-filter: blur(...)`, smooth gradients, neon status indicators for mounted drives).
- Do NOT use plain default HTML inputs; all buttons, partition bars, drive lists, and file tree nodes must have micro-interactions (hover elevation, active state glows, tooltips).
- Provide real-time throughput metrics (read/write MB/s, mount uptime) when an image/partition is mounted.
