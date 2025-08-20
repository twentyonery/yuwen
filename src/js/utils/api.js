// src/js/utils/api.js

/**
 * 根据当前页面路径确定配置文件的相对路径
 * @returns {string} 配置文件的相对路径
 */
function getConfigPath() {
    // 检查当前页面URL是否包含src/pages路径
    if (window.location.pathname.includes('src/pages')) {
        // 通过start.html/chat.html/result.html访问
        return '../../config/ai_config.json';
    } else {
        // 通过index.html访问
        return 'config/ai_config.json';
    }
}

/**
 * 从配置文件加载AI配置
 * @returns {Promise<Object>} 解析后的配置对象
 */
export async function loadAIConfig() {
    try {
        const response = await fetch(getConfigPath());
        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.status}`);
        }
        const config = await response.json();
        return config;
    } catch (error) {
        console.error('Error loading AI config:', error);
        // 在实际应用中，这里可能需要更优雅的错误处理
        throw error;
    }
}

/**
 * 调用AI服务API
 * @param {Object} config - AI配置对象
 * @param {Array} messages - 聊天消息历史数组
 * @returns {Promise<string>} AI的回复文本
 */
export async function callAI(config, messages) {
    // 为OpenAI兼容接口准备请求体
    const payload = {
        model: "qwen-plus",
        messages: messages,
        // 可以根据需要添加其他参数，如 temperature, max_tokens 等
    };

    try {
        const response = await fetch(config.api_settings.endpoint, {
            method: 'POST',
            headers: config.api_settings.headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`AI API request failed: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        // 根据OpenAI兼容接口的响应格式处理
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error calling AI API:', error);
        // 在实际应用中，这里可能需要向用户显示错误信息
        throw error; // 重新抛出错误，让调用者处理
    }
}