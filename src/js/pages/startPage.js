// src/js/pages/startPage.js

import { loadAIConfig } from '../utils/api.js';

/**
 * 根据当前页面路径确定图片资源的相对路径
 * @returns {string} 图片资源的相对路径前缀
 */
function getImagePathPrefix() {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过start.html访问 (src/pages/start.html)
        return '../../public/assets/relics/';
    } else {
        // 通过index.html访问 (项目根目录下的index.html)
        return 'public/assets/relics/';
    }
}

/**
 * 根据当前页面路径确定页面跳转的基础路径
 * @returns {string} 页面跳转的基础路径
 */
function getBasePath() {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过start.html访问 (src/pages/start.html)
        return '';
    } else {
        // 通过index.html访问 (项目根目录下的index.html)
        return 'src/pages/';
    }
}

/**
 * 根据当前页面路径确定配置文件的相对路径
 * @returns {string} 配置文件的相对路径
 */
function getConfigPath() {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过start.html访问 (src/pages/start.html)
        return '../../config/ai_config.json';
    } else {
        // 通过index.html访问 (项目根目录下的index.html)
        return 'config/ai_config.json';
    }
}

/**
 * 根据当前页面路径确定音乐资源的相对路径
 * @returns {string} 音乐资源的相对路径
 */
function getMusicPath() {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过start.html访问 (src/pages/start.html)
        return '../../public/assets/music/1.mp3';
    } else {
        // 通过index.html访问 (项目根目录下的index.html)
        return 'public/assets/music/1.mp3';
    }
}

/**
 * 根据当前页面路径确定背景图片的相对路径
 * @returns {string} 背景图片的相对路径
 */
function getBackgroundImagePath() {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过start.html访问 (src/pages/start.html)
        return '../../public/assets/relics/start.jpg';
    } else {
        // 通过index.html访问 (项目根目录下的index.html)
        return 'public/assets/relics/start.jpg';
    }
}

// 背景故事文本
const backgroundStoryText = `
    你是一位穿梭于市井之间的平凡小商人，对古物有着天生的敏锐嗅觉。
    一日，你在整理一批刚从偏远山村收购来的旧货时，一件看似普通的青铜器吸引了你的注意。
    它的纹饰奇异，与你所知的任何朝代风格都略有不同。当你轻轻拂去表面的尘土，刹那间，青铜器上浮现出奇异的光芒。
    你只觉眼前一黑，再睁眼时，已置身于一个完全陌生的世界。
    古朴的建筑，穿着古装的行人，一切都显得那么真实又虚幻。
    你意识到，这件文物似乎拥有某种神奇的力量，将你带到了遥远的过去。
    在这个时空的交汇点，你遇到了几位神秘的“人”。他们或儒雅，或豪放，或深沉，似乎各自背负着不为人知的秘密。
    他们愿意与你交谈，但似乎有意隐藏了自己的身份。
    你的任务，就是通过与他们的对话，寻找线索，最终揭开他们的真实身份。
    你会选择与哪一位“人”开始这场跨越千年的对话呢？
`;

/**
 * 初始化开始页
 */
async function initStartPage() {
    // 插入背景故事
    document.getElementById('background-story').textContent = backgroundStoryText;

    try {
        // 加载AI配置
        const response = await fetch(getConfigPath());
        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.status}`);
        }
        const config = await response.json();
        const characters = config.characters;
        
        // 获取路径前缀
        const imagePathPrefix = getImagePathPrefix();
        const basePath = getBasePath();
        const musicPath = getMusicPath();
        const backgroundImagePath = getBackgroundImagePath();

        // 设置背景图片
        const startPage = document.querySelector('.start-page');
        startPage.style.backgroundImage = `url('${backgroundImagePath}')`;
        startPage.style.backgroundSize = 'cover';
        startPage.style.backgroundPosition = 'center';
        startPage.style.backgroundRepeat = 'no-repeat';
        startPage.style.minHeight = '100vh';
        startPage.style.padding = '20px';
        startPage.style.boxSizing = 'border-box';

        // 创建背景音乐元素
        const bgMusic = new Audio(musicPath);
        bgMusic.loop = true; // 循环播放
        let isPlaying = false;

        // 创建音乐控制按钮
        const musicControl = document.createElement('div');
        musicControl.className = 'music-control';
        musicControl.innerHTML = `
            <button class="music-button" id="music-toggle">🔊</button>
        `;
        document.body.appendChild(musicControl);

        // 添加音乐控制逻辑
        const musicButton = document.getElementById('music-toggle');
        
        // 尝试自动播放背景音乐
        bgMusic.play().then(() => {
            isPlaying = true;
            musicButton.textContent = '🔊';
        }).catch(error => {
            // 自动播放失败，可能是因为浏览器策略限制
            console.warn('自动播放背景音乐失败，需要用户交互:', error);
            musicButton.textContent = '🔇'; // 显示为暂停状态
        });

        musicButton.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicButton.textContent = '🔇';
                isPlaying = false;
            } else {
                bgMusic.play().then(() => {
                    musicButton.textContent = '🔊';
                    isPlaying = true;
                }).catch(error => {
                    console.error('播放背景音乐失败:', error);
                });
            }
        });

        // 获取文物容器并清空占位符
        const relicsContainer = document.getElementById('relics-container');
        relicsContainer.innerHTML = ''; // 清空占位符

        // 创建两行文物容器
        const firstRow = document.createElement('div');
        firstRow.className = 'relics-row';
        
        const secondRow = document.createElement('div');
        secondRow.className = 'relics-row';

        // 将文物分为两行显示
        const characterIds = Object.keys(characters);
        
        // 第一行放前4个文物
        for (let i = 0; i < Math.min(4, characterIds.length); i++) {
            const charId = characterIds[i];
            const character = characters[charId];
            
            const relicDiv = document.createElement('div');
            relicDiv.className = 'relic';
            relicDiv.dataset.characterId = character.id;

            const img = document.createElement('img');
            img.src = `${imagePathPrefix}${character.id}.jpg`;
            img.alt = `文物: ${character.display_name}`;
            img.onerror = function() {
                console.error(`图片加载失败: ${this.src}`);
                this.src = `${imagePathPrefix}placeholder.jpg`;
            };

            relicDiv.appendChild(img);
            firstRow.appendChild(relicDiv);

            // 添加点击事件监听器
            relicDiv.addEventListener('click', () => {
                // 暂停背景音乐
                bgMusic.pause();
                // 将选择的角色ID存储在 sessionStorage 中，供其他页面使用
                sessionStorage.setItem('selectedCharacterId', character.id);
                // 跳转到交互页
                window.location.href = `${basePath}chat.html`;
            });
        }

        // 第二行放剩余的文物（3个）
        for (let i = 4; i < characterIds.length; i++) {
            const charId = characterIds[i];
            const character = characters[charId];
            
            const relicDiv = document.createElement('div');
            relicDiv.className = 'relic';
            relicDiv.dataset.characterId = character.id;

            const img = document.createElement('img');
            img.src = `${imagePathPrefix}${character.id}.jpg`;
            img.alt = `文物: ${character.display_name}`;
            img.onerror = function() {
                console.error(`图片加载失败: ${this.src}`);
                this.src = `${imagePathPrefix}placeholder.jpg`;
            };

            relicDiv.appendChild(img);
            secondRow.appendChild(relicDiv);

            // 添加点击事件监听器
            relicDiv.addEventListener('click', () => {
                // 暂停背景音乐
                bgMusic.pause();
                // 将选择的角色ID存储在 sessionStorage 中，供其他页面使用
                sessionStorage.setItem('selectedCharacterId', character.id);
                // 跳转到交互页
                window.location.href = `${basePath}chat.html`;
            });
        }

        // 将两行添加到文物容器中
        relicsContainer.appendChild(firstRow);
        relicsContainer.appendChild(secondRow);

    } catch (error) {
        console.error("Failed to initialize start page:", error);
        // 在实际应用中，这里可以显示一个错误消息给用户
        document.getElementById('relics-container').innerHTML = '<p>加载失败，请检查配置文件和网络连接。</p>';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initStartPage);