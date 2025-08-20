// src/js/pages/chatPage.js

import { loadAIConfig, callAI } from '../utils/api.js';

let aiConfig = null;
let selectedCharacter = null;
let chatHistory = [];

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
            }, 1500);
        }

    } catch (error) {
        console.error("Error getting AI response:", error);
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
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initChatPage);