# FFmpeg CLI 参考手册

> 本机版本：**ffmpeg 8.0.1** | 安装路径：`/opt/homebrew/bin/ffmpeg`
> 编译器：Apple clang 17.0.0 | 架构：ARM64 (Apple Silicon)

FFmpeg 是开源的跨平台音视频处理工具集，支持几乎所有音视频格式的录制、转换、流化处理。核心由 `ffmpeg`（转码）、`ffprobe`（分析）、`ffplay`（播放）三个命令组成。

## 目录

- [安装信息](#安装信息)
- [基础语法](#基础语法)
- [全局选项](#全局选项)
- [输入/输出选项](#输入输出选项)
- [视频选项](#视频选项)
- [音频选项](#音频选项)
- [字幕选项](#字幕选项)
- [流控制选项](#流控制选项)
- [滤镜系统](#滤镜系统)
- [高级选项](#高级选项)
- [常用编码器](#常用编码器)
- [支持格式](#支持格式)
- [硬件加速](#硬件加速)
- [ffprobe 工具](#ffprobe-工具)
- [常用命令示例](#常用命令示例)

---

## 安装信息

### 编译配置

```
--prefix=/opt/homebrew/Cellar/ffmpeg/8.0.1_4
--enable-shared
--enable-pthreads
--enable-version3
--enable-ffplay
--enable-gpl
--enable-libsvtav1        # AV1 编码 (SVT-AV1)
--enable-libopus          # Opus 音频编解码
--enable-libx264          # H.264 编码
--enable-libmp3lame       # MP3 编码
--enable-libdav1d         # AV1 解码 (dav1d)
--enable-libvpx           # VP8/VP9 编解码
--enable-libx265          # H.265/HEVC 编码
--enable-openssl          # HTTPS/加密协议
--enable-videotoolbox     # macOS 硬件加速
--enable-audiotoolbox     # macOS 音频硬件
--enable-neon             # ARM NEON 指令集
```

### 库版本

| 库 | 版本 |
|---|---|
| libavutil | 60.8.100 |
| libavcodec | 62.11.100 |
| libavformat | 62.3.100 |
| libavdevice | 62.1.100 |
| libavfilter | 11.4.100 |
| libswscale | 9.1.100 |
| libswresample | 6.1.100 |

---

## 基础语法

```bash
ffmpeg [全局选项] {[输入文件选项] -i 输入文件}... {[输出文件选项] 输出文件}...
```

### 通用模式

```bash
ffmpeg -i input.mp4 output.mkv                        # 基础转换
ffmpeg -i input1.mp4 -i input2.mp3 output.mp4         # 多输入
ffmpeg -y -i input.mp4 output.mp4                     # 覆盖输出
ffmpeg -n -i input.mp4 output.mp4                     # 不覆盖已存在文件
```

---

## 全局选项

| 选项 | 说明 |
|---|---|
| `-y` | 覆盖输出文件（不提示确认） |
| `-n` | 永不覆盖输出文件，文件已存在则退出 |
| `-v <loglevel>` | 设置日志级别：`quiet` `panic` `fatal` `error` `warning` `info` `verbose` `debug` `trace` |
| `-stats` | 打印编码进度报告 |
| `-hide_banner` | 隐藏版本/版权信息 |
| `-benchmark` | 添加基准测试计时 |
| `-benchmark_all` | 为每个任务添加计时 |
| `-progress <url>` | 将进度信息写入 URL/文件 |
| `-timelimit <seconds>` | 设置最大运行时间（CPU 用户时间） |

### 帮助与信息

| 选项 | 说明 |
|---|---|
| `-h` | 打印基本选项帮助 |
| `-h long` | 打印更多选项 |
| `-h full` | 打印所有选项（含编解码器细节，非常长） |
| `-h type=name` | 打印指定类型的帮助（decoder/encoder/demuxer/muxer/filter/bsf/protocol） |
| `-version` | 显示版本信息 |
| `-L` | 显示许可证 |
| `-buildconf` | 显示编译配置 |
| `-encoders` | 列出可用编码器 |
| `-decoders` | 列出可用解码器 |
| `-muxers` | 列出可用复用器（封装格式） |
| `-demuxers` | 列出可用解复用器 |
| `-filters` | 列出可用滤镜 |
| `-pix_fmts` | 列出可用像素格式 |
| `-layouts` | 列出标准声道布局 |
| `-sample_fmts` | 列出音频采样格式 |
| `-formats` | 列出可用格式 |
| `-codecs` | 列出可用编解码器 |
| `-bsfs` | 列出比特流滤镜 |
| `-protocols` | 列出支持的协议 |
| `-devices` | 列出可用设备 |
| `-hwaccels` | 列出硬件加速方法 |
| `-colors` | 列出可用颜色名 |

---

## 输入/输出选项

### 输入与输出通用选项

| 选项 | 说明 | 适用范围 |
|---|---|---|
| `-f <fmt>` | 强制指定容器格式（默认自动检测） | 输入/输出 |
| `-t <duration>` | 设置处理时长（秒或 `HH:MM:SS.ms`） | 输入/输出 |
| `-to <time_stop>` | 在指定时间点停止处理 | 输入/输出 |
| `-ss <time_off>` | 设置起始时间（快进到指定位置） | 输入/输出 |
| `-fs <limit_size>` | 限制输出文件大小（字节） | 仅输出 |

### 仅输入选项

| 选项 | 说明 |
|---|---|
| `-sseof <time_off>` | 从文件末尾偏移处开始 |
| `-seek_timestamp` | 启用按时间戳定位 |
| `-accurate_seek` | 启用精确定位（默认） |
| `-itsoffset <time_off>` | 设置输入时间戳偏移 |
| `-re` | 以原生帧率读取输入（用于推流） |
| `-readrate <speed>` | 以指定速率读取输入 |
| `-stream_loop <count>` | 设置输入流循环次数 |
| `-find_stream_info` | 分析流信息（默认开启） |

### 仅输出选项

| 选项 | 说明 |
|---|---|
| `-metadata[:spec] key=value` | 添加/修改元数据 |
| `-map [-]input_id[:stream_spec]` | 指定输入流映射 |
| `-map_metadata outfile:infile` | 设置元数据映射 |
| `-map_chapters <input_index>` | 设置章节映射 |
| `-shortest` | 在最短输入结束时停止编码 |
| `-target <type>` | 指定目标类型（`vcd` `svcd` `dvd` `dv` `dv50`，可加 `pal-`/`ntsc-`/`film-` 前缀） |

---

## 视频选项

| 选项 | 说明 |
|---|---|
| `-r[:stream_spec] <rate>` | 设置帧率（Hz 值、分数或缩写，如 `30` `30000/1001` `ntsc`） |
| `-aspect[:stream_spec] <ratio>` | 设置宽高比（`4:3` `16:9` 或 `1.3333` `1.7777`） |
| `-vn` | 禁用视频 |
| `-vcodec <codec>` | 设置视频编解码器（等同于 `-c:v`） |
| `-vf <filter_graph>` | 设置视频滤镜链（等同于 `-filter:v`） |
| `-b <bitrate>` | 设置视频比特率（推荐用 `-b:v`，如 `-b:v 5M`） |
| `-pix_fmt[:stream_spec] <format>` | 设置像素格式（`yuv420p` `nv12` `rgb24` 等） |
| `-vframes <number>` | 设置输出视频帧数 |
| `-fps_mode[:stream_spec]` | 设置帧率匹配模式（替代已弃用的 `-vsync`） |
| `-fpsmax[:stream_spec] <rate>` | 设置最大帧率 |
| `-pass[:stream_spec] <n>` | 设置多遍编码的遍数（1-3） |
| `-passlogfile[:stream_spec] <prefix>` | 设置两遍编码日志文件前缀 |
| `-force_key_frames[:stream_spec] <timestamps>` | 在指定时间戳强制插入关键帧 |
| `-hwaccel[:stream_spec] <name>` | 启用硬件加速解码 |
| `-hwaccel_device[:stream_spec] <name>` | 选择硬件加速设备 |
| `-hwaccel_output_format[:stream_spec]` | 选择硬件加速输出格式 |
| `-autorotate[:stream_spec]` | 自动插入旋转滤镜（默认开启） |
| `-autoscale[:stream_spec]` | 自动在滤镜链末尾插入缩放滤镜 |
| `-timecode <hh:mm:ss[:;.]ff>` | 设置初始时间码 |

---

## 音频选项

| 选项 | 说明 |
|---|---|
| `-aq <quality>` | 设置音频质量（编解码器相关） |
| `-ar[:stream_spec] <rate>` | 设置音频采样率（Hz），常用 `44100` `48000` |
| `-ac[:stream_spec] <channels>` | 设置声道数（`1`=单声道 `2`=立体声 `6`=5.1） |
| `-an` | 禁用音频 |
| `-acodec <codec>` | 设置音频编解码器（等同于 `-c:a`） |
| `-ab <bitrate>` | 设置音频比特率（等同于 `-b:a`，如 `-b:a 128k`） |
| `-af <filter_graph>` | 设置音频滤镜链（等同于 `-filter:a`） |
| `-aframes <number>` | 设置输出音频帧数 |
| `-sample_fmt[:stream_spec] <format>` | 设置采样格式 |
| `-ch_layout[:stream_spec] <layout>` | 设置声道布局（`mono` `stereo` `5.1` `7.1` 等） |

---

## 字幕选项

| 选项 | 说明 |
|---|---|
| `-sn` | 禁用字幕 |
| `-scodec <codec>` | 设置字幕编解码器（等同于 `-c:s`） |
| `-stag <fourcc>` | 强制字幕 FourCC 标签 |
| `-fix_sub_duration[:stream_spec]` | 修复字幕时长 |
| `-canvas_size[:stream_spec] <WxH>` | 设置字幕画布大小 |

---

## 流控制选项

| 选项 | 说明 |
|---|---|
| `-c[:stream_spec] <codec>` | 选择编解码器，`copy` 表示直接复制流不重新编码 |
| `-codec[:stream_spec] <codec>` | `-c` 的别名 |
| `-pre[:stream_spec] <preset>` | 预设名称 |
| `-frames[:stream_spec] <number>` | 设置输出帧数 |
| `-tag[:stream_spec] <fourcc>` | 强制编解码器 FourCC 标签 |
| `-q[:stream_spec] <q>` | 使用固定质量（VBR 模式） |
| `-disposition[:stream_spec]` | 设置流 disposition |
| `-bsf[:stream_spec] <filters>` | 设置比特流滤镜（逗号分隔） |
| `-discard[:stream_spec]` | 设置丢弃策略 |

### 流选择器语法

流选择器 `[:stream_spec]` 可以是：
- 流索引号（如 `:0` `:1`）
- `v` 视频 / `a` 音频 / `s` 字幕
- 省略时对所有流生效

```bash
-c:v libx264        # 设置视频编码器
-c:a copy           # 音频直接复制
-c:s mov_text       # 字幕编码器
```

---

## 滤镜系统

### 基本语法

```bash
-vf "filter1,filter2,filter3"       # 视频滤镜链
-af "filter1,filter2"                # 音频滤镜链
-filter_complex "complex_graph"      # 复杂滤镜图
```

### 常用视频滤镜

| 滤镜 | 说明 | 示例 |
|---|---|---|
| `scale` | 缩放 | `scale=1920:1080` `scale=-1:720`（等比缩放） |
| `crop` | 裁剪 | `crop=1280:720:0:0`（宽:高:x:y） |
| `trim` | 截取片段 | `trim=start=10:end=30` |
| `setpts` | 设置 PTS | `setpts=0.5*PTS`（加速） `setpts=2*PTS`（减速） |
| `fps` | 设置帧率 | `fps=30` |
| `reverse` | 反转视频 | `reverse` |
| `rotate` | 旋转 | `rotate=PI/2`（顺时针90度） |
| `transpose` | 翻转/转置 | `transpose=1`（顺时针90度） `transpose=2`（逆时针90度） |
| `fade` | 淡入淡出 | `fade=in:0:30,fade=out:st=60:d=30` |
| `overlay` | 叠加（需复杂滤镜图） | 复杂滤镜图中使用 |
| `drawtext` | 绘制文字 | `drawtext=text='Hello':fontfile=/path/font.ttf:fontsize=24:fontcolor=white:x=10:y=10` |
| `ass` | 渲染 ASS 字幕 | `ass=subtitle.ass` |
| `subtitles` | 烧录字幕 | `subtitles=sub.srt` |
| `eq` | 亮度/对比度/饱和度 | `eq=brightness=0.1:contrast=1.2:saturation=1.5` |
| `hue` | 色调/饱和度 | `hue=s=1.5:h=30` |
| `unsharp` | 锐化 | `unsharp=5:5:1.0:5:5:0.0` |
| `hflip` | 水平翻转 | `hflip` |
| `vflip` | 垂直翻转 | `vflip` |
| `pad` | 填充/加边 | `pad=1920:1080:0:0:black` |
| `setdar` | 设置显示宽高比 | `setdar=16:9` |
| `setsar` | 设置采样宽高比 | `setsar=1:1` |
| `split` | 分割流（复杂滤镜图） | 复杂滤镜图中使用 |
| `concat` | 拼接流 | 复杂滤镜图中使用 |
| `zoompan` | 缩放平移（Ken Burns 效果） | `zoompan=z='min(zoom+0.0015,1.5)':d=200` |

### 常用音频滤镜

| 滤镜 | 说明 | 示例 |
|---|---|---|
| `atempo` | 调整速度 | `atempo=2.0`（2倍速） `atempo=0.5`（0.5倍速） |
| `afade` | 淡入淡出 | `afade=in:st=0:d=5,afade=out:st=50:d=5` |
| `volume` | 调整音量 | `volume=0.5`（减半） `volume=2.0`（翻倍） `volume=3dB` |
| `aresample` | 重采样 | `aresample=48000` |
| `aformat` | 格式转换 | `aformat=sample_fmts=fltp:channel_layouts=stereo` |
| `lowpass` | 低通滤波 | `lowpass=f=1000` |
| `highpass` | 高通滤波 | `highpass=f=200` |
| `bandpass` | 带通滤波 | `bandpass=f=1000:width_type=h:width=500` |
| `equalizer` | 均衡器 | `equalizer=f=1000:t=h:w=200:g=3` |
| `anull` | 空操作（透传） | `anull` |
| `amix` | 混音 | 复杂滤镜图中使用 |
| `asplit` | 分割流 | 复杂滤镜图中使用 |
| `adelay` | 延迟 | `adelay=1000|1000`（左右各延迟1秒） |
| `aecho` | 回声 | `aecho=0.8:0.88:60:0.4` |
| `compand` | 压缩/扩展动态范围 | `compand=.3|.3:1|1:-1/-60|-60/-40|-40/-30|-20/-20:6:0:-90:0.2` |
| `loudnorm` | 响度归一化 (EBU R128) | `loudnorm=I=-16:TP=-1.5:LRA=11` |
| `dynaudnorm` | 动态音频归一化 | `dynaudnorm` |
| `adeclip` | 去除削波 | `adeclip` |
| `afftdn` | FFT 降噪 | `afftdn` |

### 复杂滤镜图

```bash
# 两路输入的叠加
ffmpeg -i background.mp4 -i overlay.png \
  -filter_complex "[0:v][1:v]overlay=W-w-10:H-h-10" output.mp4

# 多视频拼接
ffmpeg -i part1.mp4 -i part2.mp4 -i part3.mp4 \
  -filter_complex "[0:v][1:v][2:v]concat=n=3:v=1:a=0" output.mp4

# 画中画
ffmpeg -i main.mp4 -i pip.mp4 \
  -filter_complex "[0:v]setpts=PTS-STARTPTS[main];[1:v]setpts=PTS-STARTPTS[scaled];[scaled]scale=iw/4:ih/4[pip];[main][pip]overlay=W-w-20:H-h-20" output.mp4

# 双输出（同时录制和预览）
ffmpeg -i input.mp4 \
  -filter_complex "split[v1][v2]" \
  -map "[v1]" -c:v libx264 -preset fast output.mp4 \
  -map "[v2]" -c:v libx264 -preset ultrafast preview.mp4
```

---

## 高级选项

### 码率控制

| 选项 | 说明 |
|---|---|
| `-b:v <bitrate>` | 视频比特率（如 `5M` `8000k`） |
| `-b:a <bitrate>` | 音频比特率（如 `128k` `320k`） |
| `-maxrate <bitrate>` | 最大比特率 |
| `-minrate <bitrate>` | 最小比特率 |
| `-bufsize <size>` | 码率控制缓冲区大小 |
| `-g <number>` | GOP 大小（关键帧间隔） |
| `-keyint_min <number>` | 最小关键帧间隔 |
| `-bf <number>` | 最大连续 B 帧数 |
| `-qmin <int>` | 最小量化参数 |
| `-qmax <int>` | 最大量化参数 |
| `-crf <float>` | 恒定质量因子（x264/x265，0-51，越低质量越高） |
| `-qp <int>` | 恒定量化参数 |
| `-preset <name>` | 编码预设（影响速度/压缩比权衡） |
| `-tune <name>` | 编码调优目标 |
| `-profile <name>` | 编码配置文件 |
| `-level <name>` | 编码级别 |
| `-pass 1` / `-pass 2` | 两遍编码 |
| `-x265-params` | x265 编码器专用参数 |
| `-x264-params` | x264 编码器专用参数 |

### 编码预设（x264/x265）

| 预设 | 说明 |
|---|---|
| `ultrafast` | 最快编码，最大文件 |
| `superfast` | 很快 |
| `veryfast` | 较快 |
| `faster` | 快 |
| `fast` | 较快（推荐） |
| `medium` | 默认，速度与质量平衡 |
| `slow` | 较慢，更好质量 |
| `slower` | 慢，更好质量 |
| `veryslow` | 很慢，最佳质量 |

### 编码调优（x264）

| 调优 | 说明 |
|---|---|
| `film` | 电影（真实拍摄） |
| `animation` | 动画 |
| `grain` | 保留胶片颗粒 |
| `stillimage` | 静态图像 |
| `fastdecode` | 快速解码 |
| `zerolatency` | 零延迟（直播推流） |
| `psnr` | 优化 PSNR |
| `ssim` | 优化 SSIM |

### 时间戳选项

| 选项 | 说明 |
|---|---|
| `-copyts` | 复制时间戳 |
| `-start_at_zero` | 输入时间戳从 0 开始 |
| `-copytb <mode>` | 复制输入流时间基 |
| `-enc_time_base <ratio>` | 设置编码器时间基 |

---

## 常用编码器

### 视频编码器

| 编码器 | 编解码格式 | 特点 |
|---|---|---|
| `libx264` | H.264/AVC | 最广泛兼容，质量/速度优秀 |
| `libx264rgb` | H.264 RGB | 无损 RGB 编码 |
| `libx265` | H.265/HEVC | 更高压缩率，4K 推荐 |
| `libsvtav1` | AV1 | 新一代编解码器，开源高效 |
| `h264_videotoolbox` | H.264 | macOS 硬件编码 |
| `hevc_videotoolbox` | H.265/HEVC | macOS 硬件编码 |
| `libvpx-vp9` | VP9 | Google WebM 格式 |
| `libvpx` | VP8 | WebM 格式（较旧） |
| `mpeg4` | MPEG-4 Part 2 | 旧格式兼容 |
| `mpeg2video` | MPEG-2 | DVD/广播标准 |
| `mjpeg` | Motion JPEG | 高质量逐帧压缩 |
| `prores` | Apple ProRes | 专业后期制作 |
| `gif` | GIF | 动图（256色） |
| `apng` | APNG | 动态 PNG |
| `png` | PNG | 静态图片序列 |
| `copy` | - | 直接复制流，不重新编码（最快） |

### 音频编码器

| 编码器 | 格式 | 特点 |
|---|---|---|
| `libmp3lame` | MP3 | 最广泛兼容 |
| `libopus` | Opus | 现代低延迟，语音/音乐均优 |
| `aac` | AAC | Apple 原生 AAC |
| `pcm_s16le` | PCM 16-bit | 无损 PCM |
| `pcm_s24le` | PCM 24-bit | 高精度无损 PCM |
| `flac` | FLAC | 无损压缩 |
| `vorbis` | Vorbis | 开源（OGG 容器） |
| `alac` | ALAC | Apple 无损 |
| `copy` | - | 直接复制流 |

### 字幕编码器

| 编码器 | 格式 |
|---|---|
| `mov_text` | 3GPP Timed Text（MP4 内嵌） |
| `srt` / `subrip` | SubRip（.srt） |
| `ass` / `ssa` | ASS/SSA（高级样式） |
| `webvtt` | WebVTT（Web 字幕） |
| `ttml` | TTML |
| `dvdsub` | DVD 字幕 |
| `dvbsub` | DVB 字幕 |

---

## 支持格式

### 常用容器格式

| 格式 | 说明 | 扩展名 |
|---|---|---|
| MP4 | 最广泛兼容的视频格式 | `.mp4` `.m4v` |
| MKV / Matroska | 灵活的多媒体容器 | `.mkv` |
| WebM | Web 优化的开放格式 | `.webm` |
| AVI | 传统 Windows 格式 | `.avi` |
| MOV | Apple QuickTime | `.mov` |
| FLV | Flash 视频 | `.flv` |
| TS / MPEG-TS | 传输流（直播常用） | `.ts` |
| MP3 | 音频 | `.mp3` |
| FLAC | 无损音频 | `.flac` |
| OGG | 开源音频容器 | `.ogg` |
| WAV | 无损 PCM 音频 | `.wav` |
| AAC | 原始 AAC 音频 | `.aac` |
| GIF | 动图 | `.gif` |
| APNG | 动态 PNG | `.apng` |
| PNG / JPEG / BMP | 图片序列 | `.png` `.jpg` `.bmp` |
| DASH | MPEG-DASH 自适应流 | `.mpd` |
| HLS | HTTP 直播流 | `.m3u8` |
| 3GP | 3G 移动设备 | `.3gp` |
| ProRes | Apple 专业视频 | `.mov` |

---

## 硬件加速

本机支持：**VideoToolbox**（Apple Silicon / macOS 原生）

```bash
# 使用 VideoToolbox 硬件解码
-hwaccel videotoolbox -i input.mp4

# 使用 VideoToolbox 硬件编码 H.264
-c:v h264_videotoolbox -b:v 5M

# 使用 VideoToolbox 硬件编码 H.265
-c:v hevc_videotoolbox -b:v 10M -q:v 50

# 完整硬件加速管道
-hwaccel videotoolbox -hwaccel_output_format videotoolbox_vld -i input.mp4 -c:v hevc_videotoolbox output.mp4
```

---

## ffprobe 工具

ffprobe 是 ffmpeg 套件中的媒体分析工具。

```bash
# 查看文件信息
ffprobe input.mp4

# JSON 格式输出
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4

# 查看流信息（紧凑格式）
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,duration,sample_rate,channels -of default=noprint_wrappers=1 input.mp4

# 查看格式信息
ffprobe -v error -show_entries format=duration,size,bit_rate -of default=noprint_wrappers=1 input.mp4

# 获取视频帧数
ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 input.mp4

# 获取视频分辨率
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 input.mp4

# 获取音频采样率
ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of csv=p=0 input.mp4

# 获取视频帧率
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 input.mp4
```

---

## 常用命令示例

### 格式转换

```bash
# MP4 转 MKV
ffmpeg -i input.mp4 -c copy output.mkv

# MKV 转 MP4（重新编码）
ffmpeg -i input.mkv -c:v libx264 -c:a aac output.mp4

# 视频转 GIF
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" output.gif

# 视频转 WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm

# 生成 HLS 流
ffmpeg -i input.mp4 -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 0 output.m3u8
```

### 视频处理

```bash
# 压缩视频（CRF 模式）
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a copy output.mp4

# 指定码率压缩
ffmpeg -i input.mp4 -c:v libx264 -b:v 2M -c:a copy output.mp4

# 缩放分辨率
ffmpeg -i input.mp4 -vf "scale=1280:720" -c:a copy output.mp4

# 等比缩放（宽度 720，高度自动）
ffmpeg -i input.mp4 -vf "scale=720:-2" -c:a copy output.mp4

# 裁剪视频（从 00:01:30 开始，持续 30 秒）
ffmpeg -i input.mp4 -ss 00:01:30 -t 30 -c copy output.mp4

# 精确裁剪（重新编码）
ffmpeg -i input.mp4 -ss 00:01:30 -t 30 -c:v libx264 -c:a copy output.mp4

# 裁剪画面（去除上下黑边）
ffmpeg -i input.mp4 -vf "crop=1920:800:0:140" -c:a copy output.mp4

# 提取视频中的某一帧
ffmpeg -i input.mp4 -ss 00:01:00 -frames:v 1 frame.png

# 提取图片序列
ffmpeg -i input.mp4 -vf "fps=24" frames/frame_%04d.png

# 调整播放速度（2倍速）
ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" output.mp4

# 调整播放速度（0.5倍速）
ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=2*PTS[v];[0:a]atempo=0.5[a]" -map "[v]" -map "[a]" output.mp4

# 旋转视频 90 度
ffmpeg -i input.mp4 -vf "transpose=1" -c:a copy output.mp4

# 水平镜像翻转
ffmpeg -i input.mp4 -vf "hflip" -c:a copy output.mp4

# 垂直翻转
ffmpeg -i input.mp4 -vf "vflip" -c:a copy output.mp4

# 添加水印
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=W-w-10:H-h-10" -c:a copy output.mp4
```

### 音频处理

```bash
# 提取音频
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3

# 提取无损音频
ffmpeg -i input.mp4 -vn -c:a flac output.flac

# WAV 转 MP3
ffmpeg -i input.wav -c:a libmp3lame -q:a 2 output.mp3

# 调整音量（增加 10dB）
ffmpeg -i input.mp3 -af "volume=10dB" output.mp3

# 音频归一化（EBU R128）
ffmpeg -i input.mp3 -af loudnorm output.mp3

# 音频淡入淡出
ffmpeg -i input.mp3 -af "afade=in:st=0:d=5,afade=out:st=55:d=5" output.mp3

# 合并多个音频
ffmpeg -i audio1.mp3 -i audio2.mp3 -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" output.mp3

# 混音（两路叠加）
ffmpeg -i audio1.mp3 -i audio2.mp3 -filter_complex "[0:a][1:a]amix=inputs=2:duration=longest" output.mp3
```

### 字幕处理

```bash
# 烧录 SRT 字幕
ffmpeg -i input.mp4 -vf "subtitles=sub.srt" -c:a copy output.mp4

# 烧录 ASS 字幕
ffmpeg -i input.mp4 -vf "ass=style.ass" -c:a copy output.mp4

# 提取字幕
ffmpeg -i input.mkv -map 0:s:0 subs.srt

# 添加外挂字幕（不烧录）
ffmpeg -i input.mp4 -i subs.srt -c copy -c:s mov_text output.mp4

# 字幕格式转换（SRT 转 ASS）
ffmpeg -i input.srt output.ass
```

### 多文件操作

```bash
# 拼接视频（相同编码格式）
# 先创建 filelist.txt：
#   file 'part1.mp4'
#   file 'part2.mp4'
#   file 'part3.mp4'
ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4

# 拼接视频（不同编码格式）
ffmpeg -i part1.mp4 -i part2.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1" output.mp4

# 图片序列转视频
ffmpeg -framerate 30 -i frames/frame_%04d.png -c:v libx264 -pix_fmt yuv420p output.mp4

# 音频 + 图片生成视频
ffmpeg -loop 1 -i image.jpg -i audio.mp3 -c:v libx264 -tune stillimage -c:a aac -shortest output.mp4

# 替换视频中的音频
ffmpeg -i video.mp4 -i new_audio.mp3 -c:v copy -map 0:v:0 -map 1:a:0 output.mp4

# 提取视频（无音频）
ffmpeg -i input.mp4 -an -c:v copy output.mp4
```

### 高级编码

```bash
# H.264 两遍编码（最佳质量/文件大小比）
ffmpeg -i input.mp4 -c:v libx264 -pass 1 -an -f null /dev/null
ffmpeg -i input.mp4 -c:v libx264 -pass 2 -c:a libmp3lame -b:a 128k output.mp4

# AV1 编码（SVT-AV1）
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 30 -preset 8 -c:a libopus output.mp4

# H.265/HEVC 编码
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset medium -c:a aac output.mp4

# 硬件加速编码（VideoToolbox H.264）
ffmpeg -i input.mp4 -c:v h264_videotoolbox -b:v 5M -c:a aac output.mp4

# 苹果 ProRes 编码
ffmpeg -i input.mp4 -c:v prores -profile:v 3 -c:a pcm_s24le output.mov

# 推流到 RTMP 服务器
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -c:a aac -f flv rtmp://server/live/stream_key

# 从摄像头/屏幕录制（macOS）
ffmpeg -f avfoundation -i "0:0" -c:v libx264 -preset ultrafast output.mp4

# 屏幕录制
ffmpeg -f avfoundation -i "1:none" -c:v libx264 -preset ultrafast output.mp4
```

---

## 参考资源

- 官方文档：https://ffmpeg.org/documentation.html
- FFmpeg Wiki：https://trac.ffmpeg.org/wiki
- 在线查询编解码器详情：`ffmpeg -h encoder=libx264`
- 在线查询滤镜详情：`ffmpeg -h filter=scale`
- 查看完整帮助：`ffmpeg -h full`
