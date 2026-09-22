use std::fs;
use base64::{Engine as _, engine::general_purpose};
use tauri::Manager;
use tauri_plugin_native_camera::NativeCameraExt;


// 拍照
fn capture_photo(app: &tauri::AppHandle) -> Result<String, String> {
    let result = app
        .native_camera()
        .take_picture()
        .map_err(|e| e.to_string())?;
    Ok(result.image_data)
}

// 解码图片
fn decode_base64(base64_str: &str) -> Result<Vec<u8>, String> {
    let data = if let Some(pos) = base64_str.find("base64,") {
        &base64_str[pos + 7..]
    } else {
        base64_str
    };
    general_purpose::STANDARD
        .decode(data)
        .map_err(|e| format!("Base64 解码失败: {e}"))
}

// 保存照片
fn save_avatar(app: &tauri::AppHandle, bytes: &[u8]) -> Result<(), String> {
    let avatar_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("获取 appdata 失败: {e}"))?
        .join("avatar");

    fs::create_dir_all(&avatar_dir)
        .map_err(|e| format!("创建 avatar 目录失败: {e}"))?;

    fs::write(avatar_dir.join("avatar.jpg"), bytes)
        .map_err(|e| format!("写入文件失败: {e}"))?;

    Ok(())
}


// 主函数
#[tauri::command]
pub async fn take_photo(app: tauri::AppHandle) -> Result<bool, String> {
    let image_data = capture_photo(&app)?;   // 1. 拍照
    let bytes = decode_base64(&image_data)?; // 2. 解码
    save_avatar(&app, &bytes)?;              // 3. 保存
    Ok(true)
}