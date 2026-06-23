# 库仑定律 HTML 互动课件

这是一个面向高中物理课堂的库仑定律演示课件项目。课件采用固定 `1920 × 1080` 的 16:9 舞台，包含逐步呈现、平滑翻页、进度条、文字编辑和 GeoGebra 互动实验。

## 推荐入口

优先使用：

```text
index.html
```

该版本通过 GeoGebra 官方 CDN 加载运行库，同时从本地 `assets` 目录读取三个 `.ggb` 实验文件。使用时需要联网。

需要离线使用 GeoGebra 运行库时，可使用：

```text
index_local.html
```

它从项目内的 `GeoGebra` 目录加载运行库。`index_local.html` 已纳入 Git；体积较大的 `GeoGebra/` 运行库仍仅保存在本地，不提交到仓库。

## 文件结构

```text
qayzzxd.github.io/
├── README.md
├── index.html
├── index_local.html
├── make_charge_split_gif.js
├── assets/
│   ├── 1.ggb
│   ├── 2.ggb
│   ├── 3.ggb
│   └── split.gif
└── GeoGebra/                 # 本地目录，Git 忽略
    ├── deployggb.js
    └── HTML5/5.0/web3d/
```

各文件说明：

| 文件 | 说明 |
| --- | --- |
| `index.html` | 当前推荐的在线版本；橙黑高对比风格，10 页，使用在线 GeoGebra 运行库 |
| `index_local.html` | 本地离线版本；内容相同，使用本地 GeoGebra 运行库 |
| `assets/1.ggb` | 静电摆球实验，二维 GeoGebra 活动 |
| `assets/2.ggb` | 库仑扭秤实验，包含三维视图 |
| `assets/3.ggb` | 库仑定律交互实验，二维 GeoGebra 活动 |
| `assets/split.gif` | 相同金属小球接触后电荷量平分的动态演示 |
| `make_charge_split_gif.js` | 生成电荷量平分动画的脚本 |
| `GeoGebra/` | GeoGebra HTML5 离线运行环境，不提交到 Git |

## 启动方式

GeoGebra 文件不能可靠地通过 `file://` 直接加载，必须使用 HTTP 服务。

在终端进入项目目录，例如：

```powershell
cd C:\Users\zxd\codex_projects\qayzzxd.github.io
```

启动本地服务（Windows）：

```powershell
python -m http.server 8765
```

macOS 或 Linux 也可使用：

```bash
python3 -m http.server 8765
```

打开在线运行库版本：

```text
http://localhost:8765/
```

打开本地 GeoGebra 运行库版本：

```text
http://localhost:8765/index_local.html
```

停止服务：

```text
Ctrl+C
```

## 操作方式

| 操作 | 功能 |
| --- | --- |
| `→`、`↓`、空格 | 显示下一项；当前页内容全部显示后进入下一页 |
| `←`、`↑` | 收回上一项；全部收回后返回上一页 |
| 鼠标滚轮 | 向前或向后推进 |
| 触摸左右滑动 | 移动设备翻页 |
| `Home` 或 `R` | 返回封面 |
| `End` | 跳到最后一页 |
| `E` | 开启或关闭文字编辑模式 |
| `Ctrl/⌘ + S` | 将文字修改保存到浏览器 |

当前页会写入 URL 哈希和 `sessionStorage`，刷新后仍停留在原页。

## 课件大纲

1. 封面：第九章“静电场及其应用”——第 2 节库仑定律
2. 问题与思考：静电摆球定性实验
3. 物理理想模型：点电荷
4. 科学猜想：类比万有引力与平方反比规律
5. 库仑扭秤（一）：微小力的测量与转化放大
6. 库仑扭秤（二）：电荷量平分与控制变量
7. 库仑定律：内容、公式、方向、条件和静电力常量
8. 例题：氢原子内静电力与万有引力的数量级对比
9. 静电力叠加：等边三角形顶点电荷的矢量合成
10. 课堂小结与作业

第 10 页最后会依次呈现正负电荷的吸引动画和标准分式形式的库仑定律公式。

## GeoGebra 集成

### 活动对应关系

```text
assets/1.ggb → 第 2 页静电摆球
assets/2.ggb → 第 5 页库仑扭秤
assets/3.ggb → 第 7 页库仑定律
```

每次刷新都会给 GGB 文件附加时间戳查询参数，强制浏览器重新读取原文件：

```js
const freshFileName = `${fileName}?reload=${Date.now()}`;
```

### 在线版本

在线版使用：

```html
<script src="https://www.geogebra.org/apps/deployggb.js"></script>
```

三个活动统一使用包含三维能力的运行库，其中库仑扭秤活动会启用三维视图：

```text
https://www.geogebra.org/apps/5.4.920.0/web3d/
```

`assets/1.ggb`、`assets/2.ggb` 和 `assets/3.ggb` 始终从本地读取，不会上传到 GeoGebra。为减轻首屏加载压力，在线版会在相关内容首次显示时再加载第 5 页和第 7 页的活动。

### 离线版本

离线版使用：

```text
GeoGebra/deployggb.js
GeoGebra/HTML5/5.0/web3d/
```

离线运行库可从 GeoGebra 官方下载：

```text
https://download.geogebra.org/package/geogebra-math-apps-bundle
```

下载并解压后，将完整的 `GeoGebra` 目录放在 `index_local.html` 同级。因此 GeoGebra 实验无需联网，但必须保留上述目录结构。页面仍引用 Google Fonts；断网时浏览器会自动使用系统字体，不影响课件和实验运行。

## 设计与实现

- 单 HTML 文件课件，无构建流程。
- 固定 `1920 × 1080` 舞台，整体等比缩放。
- 手机端保持 16:9，不重新排列内容。
- 橙黑高对比视觉风格。
- `.fragment` 与 `data-step` 控制课堂内容的逐步出现顺序。
- `.active`、`.visible` 控制页面显示。
- 顶部为章节页眉，右下角为当前页码。
- 底部橙色进度条显示课程进度。
- 支持 `prefers-reduced-motion`。

## 修改提示

### 调整逐步呈现顺序

为元素添加：

```html
<div class="fragment" data-step="1">第一步</div>
<div class="fragment" data-step="2">第二步</div>
```

同一页中，`data-step` 数值越小越早出现。

### 修改主题颜色

编辑 HTML 顶部的 CSS 变量：

```css
:root {
  --orange: #ff5a36;
  --dark: #171717;
  --ink: #f4efe4;
}
```

### 更新 GeoGebra 实验

直接覆盖：

```text
assets/1.ggb
assets/2.ggb
assets/3.ggb
```

保持文件名不变，刷新课件即可重新读取。若新 GGB 使用不同 GeoGebra 版本创建，可能还需要同步修改在线版的 `onlineGGBCodebase` 版本号；`assets/2.ggb` 必须保留正确的三维视图配置。

## 常见问题

### GGB 区域空白

确认：

1. 通过 `http://localhost:8765/` 访问，而不是双击 HTML。
2. `assets/1.ggb`、`assets/2.ggb`、`assets/3.ggb` 路径存在。
3. 在线版本能够访问 `www.geogebra.org`。
4. 离线版本的 `index_local.html` 和 `GeoGebra` 目录均已准备好，且没有被移动或删除。

### 第二个 GGB 显示为二维网格

第二个活动需要三维运行库。在线版已固定使用：

```text
GeoGebra 5.4.920.0 / web3d
```

如果更换了 `2.ggb`，应检查新文件的 GeoGebra 版本和三维视图配置。

### 修改文字后无法恢复

编辑内容保存在浏览器 `localStorage` 中。清除该站点的本地存储，或更换浏览器访问，即可恢复 HTML 文件中的原始文字。

## 运行环境

- 推荐浏览器：最新版 Chrome、Edge 或 Safari。
- 推荐使用 Python 3 自带的 HTTP 服务。
- 在线版需要网络访问 GeoGebra CDN 和 Google Fonts。
- 离线版需要另外下载 GeoGebra Math Apps Bundle，并将解压后的 `GeoGebra/` 目录单独保存在本地。
