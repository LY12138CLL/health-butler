# 健康管家

## 简介

一款用于管理个人血压、血糖（暂未实现）、服药的Android应用。项目实际名称：`health-butler`，打包的Android应用安装后的名称：`健康管家`，Android应用标识符：`com.administrator.health-butler`

<img src="doc/首页.jpg" alt="首页" width="200"> <img src="doc/详情.jpg" alt="详情" width="200"> <img src="doc/我的.jpg" alt="我的" width="200"> <img src="doc/血压记录.jpg" alt="我的" width="200"> <img src="doc/用药管理.jpg" alt="我的" width="200">

## 技术栈

tauri2：整体框架

vue3：前端框架

Vue Router：路由管理

Pinia：状态管理

vant：UI

## 配置代码签名

### 生成密钥库

#### 方式1

使用 Java 的 `keytool` 命令生成一个 `.jks` 文件，在cmd或poweshell中的任意目录下执行都可以：

```cmd
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

秘钥库文件的生成路径可以自定义，只需要更改~/upload-keystore.jks这段路径即可

#### 方法2

按照 Android Studio 密钥生成步骤，网址：https://developer.android.com/studio/publish/app-signing?hl=zh-cn#sign-apk

注意：

1. 一定要记住密钥库文件的具体的路径和生成密钥库时设置的密码，后续要用
2. 请务必将此密钥库文件存放在安全的地方，绝对不要提交到代码仓库！

### 添加秘钥

在 `src-tauri/gen/android/keystore.properties`文件中并填入以下内容：

```pro
storeFile=密钥库的绝对路径，建议使用双反斜杠
storePassword=你的密钥库密码
keyAlias=upload
keyPassword=你的密钥别名密码
```

## 配置SDK

安装Android Studio，并在 `src-tauri/gen/android/local.properties`文件中添加SDK所在的路径

```properties
## This file must *NOT* be checked into Version Control Systems,
# as it contains information specific to your local configuration.
#
# Location of the SDK. This is only used by Gradle.
# For customization when using a Version Control System, please read the
# header note.
#Fri Jul 31 09:04:02 CST 2026
sdk.dir=D\:\\AndroidStudio\\SDK
```

## 打包或测试

初始化项目：

```cmd
pnpm install
```

测试，项目根目录下执行：

```cmd
pnpm run tauri android dev
```

打包：

```cmd
pnpm tauri android build --apk
```

## 详细技术实现

### tauri插件、前端依赖、rust包添加

####tauri插件

| 名称                        | 作用                                         | 归属   |
| --------------------------- | -------------------------------------------- | ------ |
| sql                         | 操作sqlite数据库                             | 官方   |
| http                        | 网络请求                                     | 官方   |
| fs                          | 文件操作                                     | 官方   |
| tauri-plugin-native-camera  | 打开系统原生相机拍照功能                     | 第三方 |
| tauri-plugin-lingyi-toolbox | 权限操作、打开浏览器等，自个写的，目前已发布 | 第三方 |
| tauri-plugin-notifications  | 发送通知                                     | 第三方 |

#### 前端依赖（手动添加）

| 名称                                        | 作用                                                   | 分类 |
| ------------------------------------------- | ------------------------------------------------------ | ---- |
| @choochmeque/tauri-plugin-notifications-api | 发送通知（插件的）                                     | 生产 |
| @tauri-apps/plugin-fs                       | 文件操作（插件的）                                     | 生产 |
| @tauri-apps/plugin-http                     | 网络请求（插件的）                                     | 生产 |
| @tauri-apps/plugin-sql                      | 操作sqlite数据库（插件的）                             | 生产 |
| tauri-plugin-lingyi-toolbox                 | 权限操作、打开浏览器等，自个写的，目前已发布（插件的） | 生产 |
| tauri-plugin-native-camera-api              | 打开系统原生相机拍照功能（插件的）                     | 生产 |
| vue-router                                  | vue路由管理                                            | 生产 |
| vue-chartjs                                 | chartjs的vue绑定                                       | 生产 |
| postcss-pxtorem                             | px转rem                                                | 生产 |

| 名称                       | 作用                 | 分类 |
| -------------------------- | -------------------- | ---- |
| pinia                      | vue状态管理          | 生产 |
| cheerio                    | 解析 HTML 和 XML     | 生产 |
| chart.js                   | 绘制图表             | 生产 |
| amfe-flexible              | 前端移动端适配       | 生产 |
| vant                       | 移动端UI框架         | 生产 |
| @vant/auto-import-resolver | vant按需引入组件所需 | 开发 |
| unplugin-vue-components    | vant按需引入组件所需 | 开发 |
| unplugin-auto-import       | vant按需引入组件所需 | 开发 |

#### rust包（手动添加）

| 名称                        | 作用                                                   |
| --------------------------- | ------------------------------------------------------ |
| tauri-plugin-http           | 网络请求（插件的）                                     |
| calamine                    | 读取excel表格                                          |
| rust_xlsxwriter             | 写入excel表格                                          |
| tauri-plugin-notifications  | 发送通知（插件的）                                     |
| base64                      | 将 base64 编码和解码为字节或 utf8                      |
| tauri-plugin-lingyi-toolbox | 权限操作、打开浏览器等，自个写的，目前已发布（插件的） |
| tauri-plugin-native-camera  | 打开系统原生相机拍照功能（插件的）                     |
| tauri-plugin-fs             | 文件操作（插件的）                                     |
| tauri-plugin-sql            | 操作sqlite数据库（插件的）                             |

#### 提示

官方插件直接按照官网中的添加方式添加，一般会自动添加前端依赖和rust的包，其它插件需要手动添加依赖和包

### 注册插件

在`src-tauri\src\lib.rs`：

~~~rust
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
~~~

### 权限配置

在`src-tauri\capabilities\default.json`中配置：

~~~json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "opener:default",
    "sql:default",
    "sql:allow-execute",
    "notifications:default",
    "lingyi-toolbox:default",
    "native-camera:allow-take-picture",
    "fs:default",
    "fs:allow-appconfig-read-recursive",
    "fs:allow-appconfig-write-recursive",
    {
      "identifier": "fs:allow-write-file",
      "allow": [{ "path": "/storage/emulated/0/Download/**" }]
    },
    "http:default",
    {
      "identifier": "http:default",
      "allow": [{ "url": "https://gitee.com/*" }]
    },

    {
      "identifier": "fs:allow-write-file",
      "allow": [{ "path": "$APPDATA/avatar/**" }]
    },
    {
      "identifier": "fs:allow-read-file",
      "allow": [{ "path": "$APPDATA/avatar/**" }]
    },
    {
      "identifier": "fs:allow-mkdir",
      "allow": [{ "path": "$APPDATA/avatar/**" }]
    },
    {
      "identifier": "fs:allow-remove",
      "allow": [{ "path": "$APPDATA/avatar/**" }]
    },

    {
      "identifier": "fs:allow-exists",
      "allow": [
        { "path": "$APPDATA/avatar/**" },
        { "path": "$RESOURCE/**" }
      ]
    }
  ]
}
~~~

### 静态资源访问配置

解决前端访问静态资源时加载失败问题

在`src-tauri\tauri.conf.json`中配置：

~~~json
"security": {
      "csp": "default-src 'self'; img-src 'self' asset: http://asset.localhost data: blob:; font-src 'self' asset: http://asset.localhost data:; style-src 'self' 'unsafe-inline'",
      "assetProtocol": {
        "enable": true,
        "scope": {
          "requireLiteralLeadingDot": false,
          "allow": [
            "$CACHE/**",
            "$APPLOCALDATA/**",
            "$APPDATA/**"
          ],
          "deny": []
        }
      }
    }
~~~

### android配置

#### 添加jitpack仓库

解决tauri-plugin-lingyi-toolbox插件添加 [XXPermissions](https://github.com/getActivity/XXPermissions) 框架

在 src-tauri\gen\android\build.gradle.kts：

~~~kotlin
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }   // 添加这一行
    }
}
~~~

#### 关闭全屏模式

有些复杂，详见`tauri基础.md`文档中`移动端输入框被键盘遮挡`问题的解决方法

#### 添加自定义通知提示音、图标

详见[tauri基础.md](https://github.com/LY12138CLL/tauri-study/blob/main/tauri%E5%9F%BA%E7%A1%80.md)中`发送通知`的解决方法

#### 添加系统权限

在`src-tauri\gen\android\app\src\main\AndroidManifest.xml`中：

~~~xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 通知权限 -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <!-- AndroidTV support -->
    <uses-feature android:name="android.software.leanback" android:required="false" />

    <!-- 在这添加精准闹钟权限 -->
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <!-- 摄像头权限 -->
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.health_butler"
        android:usesCleartextTraffic="${usesCleartextTraffic}">
        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:launchMode="singleTask"
            android:label="@string/main_activity_title"
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
                <!-- AndroidTV support -->
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
          android:name="androidx.core.content.FileProvider"
          android:authorities="${applicationId}.fileprovider"
          android:exported="false"
          android:grantUriPermissions="true">
          <meta-data
            android:name="android.support.FILE_PROVIDER_PATHS"
            android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
~~~

###开发时遇到的问题解决思路

#### 左滑屏幕退出应用

使用vue-router的路由前置守卫解决，详见详见[tauri基础.md](https://github.com/LY12138CLL/tauri-study/blob/main/tauri%E5%9F%BA%E7%A1%80.md)中`移动端左滑退出应用`问题的解决方法

#### 打开相机拍照

使用`tauri-plugin-native-camera`实现拍照时，虽然插件本身会申请相机权限，但是第一次点击允许后，不会进入拍照。解决方案，使用`tauri-plugin-lingyi-toolbox`插件申请权限，然后在调用该插件拍照

#### 选择或保存文件

使用官方的`dialog`虽然能弹出文件选择框，但是有时点击选择文件后，并不会读取文件，就好像没有选择。

解决方案，使用前端`input`标签，type为file，可以实现选择文件，使用js读取文件内容

保存文件也一样，有时会出bug，直接保存到固定目录即可

#### 通知提示音

使用官方的`notification`插件不支持自定义通知提示音、定时发送通知等，所以使用第三方的`tauri-plugin-notifications`插件。

在使用该插件更改通知提示音时，会出现无效情况。详细原因及解决方案详见[tauri基础.md](https://github.com/LY12138CLL/tauri-study/blob/main/tauri%E5%9F%BA%E7%A1%80.md)文档中`发送通知`问题的解决方法

#### 输入框被遮挡

当输入框位于屏幕底部时，点击输入框，输入法会遮挡输入框，导致无法看到具体输入的内容

解决方案：更改全屏模式的配置或关闭全屏模式，详见[tauri基础.md](https://github.com/LY12138CLL/tauri-study/blob/main/tauri%E5%9F%BA%E7%A1%80.md)文档中`移动端输入框被键盘遮挡`问题的解决方法

#### 读取文件或解析图片

读取文件或解析图片虽然前端也能实现，但是速度慢的可怜，有时更换头像时要卡好几秒。

解决方案：将这些耗性能的操作放到rust中，更换头像时，将头像照片存储到缓存目录中，然后根据绝对录屏转换为url直接渲染，避免直接渲染base64速度慢问题

