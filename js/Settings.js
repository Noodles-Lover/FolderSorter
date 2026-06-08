/**
 * 设置管理类
 * 负责设置的本地存储和加载
 */
class Settings {
    /**
     * 构造函数
     * @param {string} storageKey - 本地存储的键名，默认'settings'
     */
    constructor(storageKey = 'settings') {
        this.storageKey = storageKey;
        this.defaultSettings = {
            deleteConfirm: true,
            loseFocusRename: false,
            sortStay: false,
            autoplay: true,
            folderRecursion: false,
            ignoreOtherFile: false,
            errorInfo: false,
            useDeleteFolder: true
        };
    }

    /**
     * 保存设置到本地存储
     * @param {Object} settings - 设置对象
     */
    save(settings) {
        try {
            const settingsToSave = {};
            // 只保存默认设置中存在的属性
            for (const key in this.defaultSettings) {
                if (settings.hasOwnProperty(key)) {
                    settingsToSave[key] = settings[key];
                }
            }
            localStorage.setItem(this.storageKey, JSON.stringify(settingsToSave));
            console.log('设置已保存到本地存储');
        } catch (e) {
            console.error('保存设置失败:', e);
        }
    }

    /**
     * 从本地存储加载设置
     * @returns {Object} 设置对象，如果本地存储中没有则返回默认设置
     */
    load() {
        try {
            const savedSettings = localStorage.getItem(this.storageKey);
            if (savedSettings) {
                const parsedSettings = JSON.parse(savedSettings);
                // 合并默认设置和保存的设置，确保所有默认属性都存在
                return { ...this.defaultSettings, ...parsedSettings };
            }
        } catch (e) {
            console.error('加载设置失败:', e);
        }
        return { ...this.defaultSettings };
    }

    /**
     * 重置设置为默认值
     */
    reset() {
        localStorage.removeItem(this.storageKey);
        console.log('设置已重置为默认值');
        return { ...this.defaultSettings };
    }

}
