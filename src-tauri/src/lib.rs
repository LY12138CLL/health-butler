// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod avatar;
use avatar::{take_photo};
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 生成 Excel
use rust_xlsxwriter::Workbook;
use serde::Serialize;
#[derive(Serialize)]
struct ExcelData {
    data: Vec<u8>, // 直接返回字节
}
#[tauri::command]
fn create_excel(data: Vec<Vec<String>>) -> Result<ExcelData, String> {
    let buffer = (|| {
        let mut workbook = Workbook::new();
        let worksheet = workbook.add_worksheet().set_name("血压记录")?;
        worksheet.write_row_matrix(0, 0, data)?;
        workbook.save_to_buffer()
    })()
    .map_err(|e| e.to_string())?;
    Ok(ExcelData { data: buffer })
}

// 读取 Excel
use calamine::{open_workbook_from_rs, Reader, Xlsx};
use std::io::Cursor;
#[tauri::command]
fn read_excel(bytes: Vec<u8>) -> Result<Vec<Vec<String>>, String> {
    // 1. 将前段传递过来的字节转换为Excel
    let cursor = Cursor::new(bytes);
    let mut workbook: Xlsx<_> =
        open_workbook_from_rs(cursor).map_err(|e| format!("解析 Excel 失败: {}", e))?;

    // 2. 获取第一个工作表名称
    let sheet_names = workbook.sheet_names();
    if sheet_names.is_empty() {
        return Err("Excel 文件中没有工作表".to_string());
    }
    let sheet_name = &sheet_names[0];

    // 3. 读取工作表：这里直接匹配 Ok(range)，因为返回的是 Result<Range, XlsxError>
    let sheet = match workbook.worksheet_range(sheet_name) {
        Ok(range) => range,
        Err(e) => return Err(format!("读取工作表失败: {}", e)),
    };

    // 4. 将表格数据转为 Vec<Vec<String>>
    let mut result = Vec::new();
    for row in sheet.rows() {
        // 获取前6列内容
        let row_str: Vec<String> = (0..6)
            .map(|i| row.get(i).map(|cell| cell.to_string()).unwrap_or_default())
            .collect();
        result.push(row_str);
    }
    Ok(result)
}

// 入口
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_native_camera::init())
        .plugin(tauri_plugin_lingyi_toolbox::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_notifications::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, create_excel, read_excel,take_photo]) // 合并为一个
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
