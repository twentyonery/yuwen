# 语闻 (Yuwen)

一个以历史人物为主题的单页互动解谜Web游戏。

## 项目概述

玩家扮演一位现代小商人，因接触神秘古文物而穿越，必须通过与由外部AI服务扮演的不同历史人物进行对话来猜测其身份。项目是一个纯前端应用，通过前端JavaScript直接与**单一**外部AI服务进行通信。

## 核心功能模块

1.  **前端 (Frontend - HTML/CSS/JavaScript)**:
    *   **开始页 (Start Page)**: 展示游戏标题和背景故事，提供七件代表不同历史人物的文物图标供玩家选择。
    *   **交互页 (Interaction Page)**: 实现一个实时聊天界面，玩家可以与AI扮演的历史人物对话并猜测其身份。
    *   **结果页 (Result Page)**: 当玩家猜对身份后，展示该历史人物的详细介绍。

2.  **AI服务集成与配置**:
    *   项目只与一个外部AI服务通信。
    *   所有AI服务信息、系统Prompt模板和角色数据都应该存放在 `config/ai_config.json` 文件中。
    *   线上的代码库中只存放了 `config/ai_config.json.example` 文件，在运行前请把它copy到 `config/ai_config.json` 文件中，替换其中的API Key。
    *   同义词处理由外部AI服务全权负责。

## 运行/部署指南

### 本地运行

由于浏览器的CORS策略，直接打开 `index.html` 文件可能无法正常工作。请使用本地服务器运行项目。

**方法一: 使用 VSCode Live Server 插件**

1.  安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件。
2.  在 VSCode 中打开项目文件夹。
3.  右键点击 `index.html` 文件，选择 "Open with Live Server"。

**方法二: 使用 Python 内置 HTTP 服务器**

1.  打开终端，进入项目根目录。
2.  运行以下命令启动服务器 (Python 3):
    ```bash
    python -m http.server 8000
    ```
3.  在浏览器中访问 `http://localhost:8000`。

### 配置AI服务

1.  获取您选择的AI服务的API Key。
2.  在运行前请把`config/ai_config.json.example`复制到 `config/ai_config.json` 文件中
    *   将 `sk-xxxxxx` 替换为您获取到的真实API Key。
3.  注意：由于是纯前端应用，API Key会暴露在客户端代码中，这是此架构的固有风险。

## 项目文件夹结构

```
yuwen/
├── config/
│   └── ai_config.json       # AI服务配置和角色数据
├── public/
│   └── assets/              # 静态资源 (图片等)
│       ├── start-bg.jpg     # 开始页背景图 (需自行添加)
│       └── relics/          # 文物图标文件夹 (需自行添加)
│           ├── zhang_heng.png
│           ├── wang_zhihuan.png
│           ├── jiang_kui.png
│           ├── xipatiya.png
│           ├── zhang_qian.png
│           ├── cao_xueqin.png
│           └── wang_ximeng.png
├── src/
│   ├── css/
│   │   └── styles.css       # 全局样式
│   ├── js/
│   │   ├── main.js          # 主应用逻辑
│   │   ├── pages/
│   │   │   ├── startPage.js # 开始页逻辑
│   │   │   ├── chatPage.js  # 交互页逻辑
│   │   │   └── resultPage.js# 结果页逻辑
│   │   └── utils/
│   │       └── api.js       # AI API 调用工具
│   └── pages/
│       ├── start.html       # 开始页 HTML
│       ├── chat.html        # 交互页 HTML
│       └── result.html      # 结果页 HTML
├── index.html               # 应用入口文件
├── CHAT.md                  # AI服务交互说明
└── README.md                # 项目说明文档
```

## 在线演示

(暂无，部署时请更新此部分，并确保配置文件中不包含真实API Key)