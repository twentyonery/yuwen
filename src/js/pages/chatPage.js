// src/js/pages/chatPage.js

import { loadAIConfig, callAI } from '../utils/api.js';

let aiConfig = null;
let selectedCharacter = null;
let chatHistory = [];

/**
 * 根据当前页面路径确定图片资源的相对路径
 * @returns {string} 图片资源的相对路径前缀
 */
function getImagePathPrefix() {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过chat.html访问
        return '../../public/assets/relics/';
    } else {
        // 通过其他路径访问
        return 'public/assets/relics/';
    }
}

/**
 * 根据当前页面路径确定音乐资源的相对路径
 * @param {string} musicFile - 音乐文件名
 * @returns {string} 音乐资源的相对路径
 */
function getMusicPath(musicFile) {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过chat.html访问
        return `../../public/assets/music/${musicFile}`;
    } else {
        // 通过其他路径访问
        return `public/assets/music/${musicFile}`;
    }
}

/**
 * 根据角色ID获取对应的背景音乐文件名
 * @param {string} characterId - 角色ID
 * @returns {string} 音乐文件名
 */
function getCharacterMusicFile(characterId) {
    const musicMap = {
        'zhang_heng': 'chat (1).mp3',
        'wang_zhihuan': 'chat (2).mp3',
        'jiang_kui': 'chat (3).mp3',
        'xipatiya': 'chat (4).mp3',
        'zhang_qian': 'chat (5).mp3',
        'cao_xueqin': 'chat (6).mp3',
        'wang_ximeng': 'chat (7).mp3'
    };
    
    return musicMap[characterId] || '1.mp3'; // 默认使用1.mp3
}

/**
 * 初始化交互页
 */
async function initChatPage() {
    try {
        // 从 sessionStorage 获取玩家选择的角色ID
        const characterId = sessionStorage.getItem('selectedCharacterId');
        if (!characterId) {
            // 如果没有选择角色，重定向到开始页
            alert('请先选择一个角色。');
            window.location.href = '../../index.html';
            return;
        }

        // 加载AI配置
        aiConfig = await loadAIConfig();
        
        // 获取所选角色的信息
        selectedCharacter = aiConfig.characters[characterId];
        if (!selectedCharacter) {
            alert('无效的角色选择。');
            window.location.href = '../../index.html';
            return;
        }

        // 设置背景图片
        const imagePathPrefix = getImagePathPrefix();
        const chatPage = document.querySelector('.chat-page');
        chatPage.style.backgroundImage = `url('${imagePathPrefix}start.jpg')`;
        chatPage.style.backgroundSize = 'cover';
        chatPage.style.backgroundPosition = 'center';
        chatPage.style.backgroundRepeat = 'no-repeat';
        chatPage.style.minHeight = '100vh';
        chatPage.style.padding = '20px';
        chatPage.style.boxSizing = 'border-box';

        // 获取角色对应的背景音乐
        const musicFile = getCharacterMusicFile(characterId);
        const musicPath = getMusicPath(musicFile);
        
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

        // 更新页面标题，隐藏真实姓名
        const titleText = `与神秘历史人物对话`;
        document.getElementById('chat-page-title').textContent = titleText;
        document.getElementById('chat-title').textContent = titleText;

        // 构造初始系统Prompt
        const initialSystemPrompt = aiConfig.system_prompt_template
            .replace(/{character_name}/g, selectedCharacter.display_name)
            .replace(/{character_background}/g, selectedCharacter.background);

        // 设置初始消息历史
        chatHistory = [
            { role: "system", content: initialSystemPrompt }
        ];

        // 获取AI的初始欢迎回复
        const initialAIResponse = await callAI(aiConfig, chatHistory);
        displayMessage(initialAIResponse, 'ai');
        chatHistory.push({ role: "assistant", content: initialAIResponse });

        // 设置发送按钮事件监听器
        document.getElementById('send-button').addEventListener('click', handleUserMessage);
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });

    } catch (error) {
        console.error("Failed to initialize chat page:", error);
        displayMessage("初始化对话失败，请检查配置和网络连接。", 'ai');
    }
}

/**
 * 处理用户发送的消息
 */
async function handleUserMessage() {
    const inputElement = document.getElementById('user-input');
    const message = inputElement.value.trim();

    if (!message) return;

    // 禁用输入和按钮，防止重复提交
    inputElement.disabled = true;
    document.getElementById('send-button').disabled = true;
    inputElement.value = ''; // 清空输入框

    // 显示用户消息
    displayMessage(message, 'user');
    chatHistory.push({ role: "user", content: message });

    // 显示等待提示
    const waitingMessageElement = displayMessage("古人低语，请耐心等待", 'ai waiting');

    try {
        // 创建要发送给AI的消息历史副本
        const messagesToSend = [...chatHistory];
        
        // 为AI提供完整上下文，包括正确的系统提示词
        if (messagesToSend[0] && messagesToSend[0].role === "system") {
            const systemPromptWithCharacter = aiConfig.system_prompt_template
                .replace(/{character_name}/g, selectedCharacter.display_name)
                .replace(/{character_background}/g, selectedCharacter.background);
            
            messagesToSend[0] = { 
                role: "system", 
                content: systemPromptWithCharacter
            };
        }

        // 调用AI获取回复
        const aiResponse = await callAI(aiConfig, messagesToSend);
        
        // 移除等待提示
        if (waitingMessageElement) {
            waitingMessageElement.remove();
        }
        
        // 显示AI回复
        displayMessage(aiResponse, 'ai');
        chatHistory.push({ role: "assistant", content: aiResponse });

        // 检查是否触发了正确的猜测
        if (aiResponse.startsWith('[[[CORRECT_GUESS]]]')) {
            // 去除触发词前缀，只显示核心内容
            const cleanResponse = aiResponse.substring('[[[CORRECT_GUESS]]]'.length).trim();
            if (cleanResponse) {
                // 更新最后一条AI消息的显示内容
                const lastAIMessageElement = document.querySelector('#chat-history .message.ai:last-child');
                if (lastAIMessageElement) {
                    lastAIMessageElement.textContent = cleanResponse;
                }
            }
            // 将角色信息存入 sessionStorage，供结果页使用
            sessionStorage.setItem('guessedCharacterId', selectedCharacter.id);
            // 延迟跳转，让用户看到最后的回复
            setTimeout(() => {
                window.location.href = '../pages/result.html';
            }, 5000);
        }

    } catch (error) {
        console.error("Error getting AI response:", error);
        // 移除等待提示
        if (waitingMessageElement) {
            waitingMessageElement.remove();
        }
        displayMessage("抱歉，与历史人物的连接似乎中断了。请稍后再试。", 'ai');
    } finally {
        // 重新启用输入和按钮
        inputElement.disabled = false;
        document.getElementById('send-button').disabled = false;
        inputElement.focus();
    }
}

/**
 * 在聊天历史记录区显示消息
 * @param {string} message - 消息内容
 * @param {string} sender - 发送者 ('user' 或 'ai')
 */
function displayMessage(message, sender) {
    const chatHistoryElement = document.getElementById('chat-history');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    chatHistoryElement.appendChild(messageElement);
    // 滚动到底部
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    
    // 返回消息元素，以便可以稍后移除
    return messageElement;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initChatPage);