# comfyui的理解
> 关联：[[ai运镜]] | [[产品视觉描述通用模板]]
> ComfyUI 工作流与节点指南

---
tags: [prompt/comfyui, ai-image, workflow]
type: reference
created: 2026-07-16
updated: 2026-07-16
---

comfyui的理解

comfyui按照模型区分应该分以下几种：

1、sd1.5

2、sdxl

3、pony

4、flux，flux2. z-image. Qw2511+qw2512

5、制作视频svt和混元.wan2.2

comfyui的主要功能分以下几种：

1、ipadapter，用做图片风格迁移，就是模仿。

2、contronet，用做固定画面的元素。

3、遮罩，用做扣取图片中的某个区域。

4、换脸，

5、局部重绘，

6、补光，重新打光

comfyui其他节点的作用

1、阔图

2、缩放图片大小

3、增加或者更换局部位置的画面

4、自动扣图

5、增加细节

6、多图混合，

7、指定某一区域

8、放大图片

加速节点 (2个) wavepeed

黄金调度器 The Golden Scheduler(节点）

增加细节 [https://github.com/Jonseed/ComfyUI-Detail-Daemon.git](https://github.com/Jonseed/ComfyUI-Detail-Daemon.git)

加宽屏 收缩模型UNET

风格补充 ReduxAdvanced和StyleModelApplySimple

局部重绘需要用差异扩散节点

三次采样 10（1-10) 20(10-20) 30(20-30)

图片风格+景别描述+画面色彩 摄影手法+主体描述+动作描述 表情描述+氛围描述+画面效果 画质描述+光线描述+背景描述

用AI智能体来做图片生成的提示词。

1、你是一个每天都会大量用AI生图的设计师，富有创意且精通AI生图。分析这张图片，并根据图片，帮我扩写成AI生图关键词组和对应的英文翻译；关键词要描述的非常准确且详细，富有创意性，关键词之间要用“，”隔开，不需要任何多余解释和文字格式。关键词组的结构按照：'图片风格，景别描述，画面色彩，摄影手法，非常详细的主体描述，动作描述，表情描述，氛围描述，画面效果，画面细节，光线描述，背景描述'。

2、你是一个每天都会大量用AI生图的设计师，富有创意且精通AI生图。现在我会给你一些场景描述，你需要结合这些场景描述，帮我扩写成AI生图关键词组；关键词要描述的非常准确且详细，富有创意性，关键词之间要用“，”隔开；关键词组的结构按照：图片风格，景别描述，画面色彩，摄影手法，非常详细的主体描述，动作描述，表情描述，氛围描述，画面效果，画面细节，画质描述，背景描述。 例如：海边少女 扩写后： 写实风格，近景，以白色、浅蓝色为主色调，精准对焦摄影，海边少女有着白皙的皮肤，她穿着白色露肩上衣，搭配浅蓝色牛仔裤，上衣衣角随意塞进裤子里，双臂交叉抱在胸前，眼神灵动，嘴角带着一抹淡淡的笑意，微微歪着头，青春活力氛围，画面清晰利，色彩明快，顶级画质，细节纤毫毕现，明亮的自然光均匀照亮少女，突出面部细节，背景是浅蓝色的天空与白色的海浪，海浪不断涌来。 每次随机生成5种不同风格的中文词组和对应的英文翻译，英文翻译要另起一行，不需要任何多余解释和文字格式。

注意：本教程适合零基础想深入学习Comfyui的小伙伴。​

本文档配套视频说明：[https://www.bilibili.com/video/BV1oy9dYZEMu/​](https://www.bilibili.com/video/BV1oy9dYZEMu/​)

从头到尾剖析报错原因和解决方案以及工具介绍。​

部分内容之前零散讲过，本视频结合答疑群常见报错问题，结合实践，从根源结合工具解决报错。​

有基础的可以跳着配合文档自查，基础薄弱的建议不要跳过。​

第一部分：工具配置篇（磨刀不误砍柴工，搞定前置，远离80%报错）​

1、升级显卡驱动，打开虚拟内存，自我百度。​

2、配置魔法​

安装git：[https://git-scm.com/download/win​](https://git-scm.com/download/win​)

Git走代理：​

git config --global http.proxy [http://127.0.0.1:7890​](http://127.0.0.1:7890​)

git config --global https.proxy [https://127.0.0.1:7890​](https://127.0.0.1:7890​)

启动器GIT代理​

启动器加：REM 设置HTTP和HTTPS代理​

set HTTP_PROXY=[http://127.0.0.1:7890​](http://127.0.0.1:7890​)

set HTTPS_PROXY=[http://127.0.0.1:7890​](http://127.0.0.1:7890​)

REM 配置Git代理​

git config --global http.proxy [http://127.0.0.1:7890​](http://127.0.0.1:7890​)

git config --global https.proxy [https://127.0.0.1:7890​](https://127.0.0.1:7890​)

垃圾魔法实在走不了代理的，就全局启动，提前把代理取消：​

取消git代理：​

git config --global --unset http.proxy​

git config --global --unset https.proxy​

秋叶同理，国内国外同时关掉，就是全局模式​

(注意：Comfyui从来就不是一个离线软件，全程都要开魔法！)​

​

常用命令：​

python.exe -m pip install 包名​

python.exe -m pip install -r ​

python.exe -m pip install --upgrade ​

python.exe -m pip uninstall 包名​

python.exe -m pip list​

​

comfyui更新：git pull​

comfyui回退：git checkout f4dac8ab6f68ac3918ca83b9a3d19131eab0b851

```
8084a26e038f21c05f04a00308f32c13
c站的api
```

一、通用命令升级法（适用于所有系统）

<BASH>

# 进入ComfyUI安装目录（示例路径）

cd C:\AI\ComfyUI # Windows

cd ~/comfyui # Mac/Linux

# 重置当前修改（防止冲突）

git reset --hard HEAD

# 切换到指定版本（以v1.5.1为例）

git checkout v1.5.1 # 精确版本号

# 强力清理+安装依赖（关键步骤！）

pip install --upgrade -r requirements.txt --force-reinstall

## 关联

# See also: [[产品视觉描述通用模板]], [[绘画提示词生成模板要素]], [[各种提示词]]
