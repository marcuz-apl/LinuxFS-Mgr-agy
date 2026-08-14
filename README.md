# LinuxFS Manager

> **Alfazen Inc.** — *An information services firm helping small businesses succeed.*

**LinuxFS Manager** is a high-performance Windows 11 desktop utility designed to inspect Ext4 raw Linux partitions on fixed physical drives and mount Linux disk images as native Windows drive letters (e.g., `E:`, `Z:`).

---

## Key Features

- 🔍 **Physical Partition Discovery**: Automatically detects Ext4 partitions across physical drives (including hidden Linux partitions alongside NTFS/FAT32 volumes).
- 💿 **Linux Image Loader**: Mount raw disk images (`.img`, `.raw`, `.ext4`), virtual machine drives (`.vhdx`, `.vhd`, `.qcow2`), and ISOs directly into Windows Explorer.
- 🚀 **Standalone Native Architecture**:
  - Native Win32 Virtual Device Mapping (`subst` & `DefineDosDeviceW` in Local/Global session scopes).
  - Pure userland filesystem bridges with zero external driver dependencies.
- 🛡️ **Read-Only Safety**: Defaults to safe, non-destructive read-only mounting to protect Linux journal structures and file permissions.
- ✨ **Futuristic Glassmorphic UI**: Sleek, dark-themed React UI powered by Tauri 2.0 with real-time throughput metrics and drive health monitors.

---

## Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Tauri 2.0, React 19, TypeScript, Vite, CSS Modules |
| **Backend Core** | Rust (Tauri Core), Tokio Async Runtime, Win32 API |
| **Mount Engines** | Native Win32 Virtual Device Mapping & Shell Integration |
| **Versioning** | [Alfazen Versioning](.agents/skills/alfazen-versioning/SKILL.md) (`m.n.p` single-digit rollover) |


---

## Documentation

- 📄 [Product Requirements Document (PRD.md)](file:///e:/projects/LinuxFS-Mgr-agy/PRD.md)
- 📋 [Development & Safety Rules (AGENTS.md)](file:///e:/projects/LinuxFS-Mgr-agy/AGENTS.md)
- 🏷️ [Alfazen Versioning Skill](file:///e:/projects/LinuxFS-Mgr-agy/.agents/skills/alfazen-versioning/SKILL.md)

---

## Versioning & Git Hooks

This repository utilizes **Alfazen Versioning** rules with automated `.githooks`:
* Version tracking via `VERSION` in the repository root.
* Pre-commit hook (`.githooks/pre-commit`) automatically increments patch/minor version tags (`0`–`9` rollover mechanics).
* Prepare-commit-msg hook (`.githooks/prepare-commit-msg`) formats commit subjects as `v{m.n.p} build {yyyy-mm-dd-hhmm} <subject>`.
