mod disk_scanner;
mod ext4_explorer;
mod mount_engine;

use disk_scanner::{SystemScanResult};
use ext4_explorer::{Ext4DirectoryResponse};
use mount_engine::{MountResponse};

#[tauri::command]
fn scan_drives() -> SystemScanResult {
    disk_scanner::scan_system_drives()
}

#[tauri::command]
fn mount_partition(
    drive_index: u32,
    partition_number: u32,
    drive_letter: String,
    read_only: bool,
) -> MountResponse {
    mount_engine::execute_mount_partition(drive_index, partition_number, &drive_letter, read_only)
}

#[tauri::command]
fn mount_image(image_path: String, drive_letter: String, read_only: bool) -> MountResponse {
    mount_engine::execute_mount_image(&image_path, &drive_letter, read_only)
}

#[tauri::command]
fn unmount_drive(drive_letter: String, source_path: String) -> MountResponse {
    mount_engine::execute_unmount(&drive_letter, &source_path)
}

#[tauri::command]
fn browse_ext4_path(target_path: String) -> Ext4DirectoryResponse {
    ext4_explorer::get_ext4_directory_contents(&target_path)
}

#[tauri::command]
fn open_in_file_explorer(target_path: String) -> bool {
    mount_engine::open_target_in_explorer(&target_path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scan_drives,
            mount_partition,
            mount_image,
            unmount_drive,
            browse_ext4_path,
            open_in_file_explorer
        ])
        .run(tauri::generate_context!())
        .expect("error while running LinuxFS Manager tauri application");
}

