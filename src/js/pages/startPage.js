// src/js/pages/startPage.js

import { loadAIConfig } from '../utils/api.js';

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
        const config = await loadAIConfig();
        const characters = config.characters;

        // 获取文物容器并清空占位符
        const relicsContainer = document.getElementById('relics-container');
        relicsContainer.innerHTML = ''; // 清空占位符

        // 动态生成文物图标
        for (const charId in characters) {
            if (characters.hasOwnProperty(charId)) {
                const character = characters[charId];
                
                const relicDiv = document.createElement('div');
                relicDiv.className = 'relic';
                relicDiv.dataset.characterId = character.id; // 使用data属性存储角色ID

                // 假设文物图片路径为 public/assets/relics/{character_id}.png
                // 注意：需要确保这些图片文件实际存在
                const img = document.createElement('img');
                // 使用相对路径从 start.html (src/pages/) 到 public/assets/
                // 对于 index.html 入口，路径是 ../../public/assets/relics/
                // 对于 src/pages/start.html 入口，路径是 ../../public/assets/relics/
                // 为了统一，我们使用一个更通用的相对路径，从项目根目录开始
                img.src = `public/assets/relics/${character.id}.jpg`;
                img.alt = `文物: ${character.display_name}`;
                img.onerror = function() {
                    console.error(`图片加载失败: ${this.src}`);
                    this.src = 'public/assets/relics/placeholder.jpg'; // 可选：设置默认图片
                };

                relicDiv.appendChild(img);
                relicsContainer.appendChild(relicDiv);

                // 添加点击事件监听器
                relicDiv.addEventListener('click', () => {
                    // 将选择的角色ID存储在 sessionStorage 中，供其他页面使用
                    sessionStorage.setItem('selectedCharacterId', character.id);
                    // 跳转到交互页
                    window.location.href = 'src/pages/chat.html';
                });
            }
        }

    } catch (error) {
        console.error("Failed to initialize start page:", error);
        // 在实际应用中，这里可以显示一个错误消息给用户
        document.getElementById('relics-container').innerHTML = '<p>加载失败，请检查配置文件和网络连接。</p>';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initStartPage);