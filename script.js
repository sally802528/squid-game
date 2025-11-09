// script.js

const TOTAL_PLAYERS = 456;
const STORAGE_KEY = 'squidGameStatus';

/**
 * 從 localStorage 載入玩家狀態，如果沒有則建立預設狀態 (全部生存)。
 * @returns {Array<Object>} 玩家資料陣列
 */
function initializePlayers() {
    const storedStatus = localStorage.getItem(STORAGE_KEY);
    if (storedStatus) {
        return JSON.parse(storedStatus);
    }
    
    // 預設建立 456 個玩家，全部為 alive: true
    const players = [];
    for (let i = 1; i <= TOTAL_PLAYERS; i++) {
        players.push({
            id: i,
            name: `Player ${String(i).padStart(3, '0')}`,
            alive: true,
            // 由於靜態網站無法存放大量圖片，這裡使用一個預設圖片路徑
            imageURL: `images/player_default.jpg` 
        });
    }
    // 儲存初始狀態
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    return players;
}

/**
 * 切換單個玩家的生存狀態並儲存到 localStorage。
 * @param {number} playerId - 玩家的 ID
 */
function togglePlayerStatus(playerId) {
    let players = getPlayersFromStorage(); // 使用 getPlayersFromStorage 確保拿到最新的狀態
    const player = players.find(p => p.id === playerId);
    
    if (player) {
        player.alive = !player.alive; // 切換狀態
        localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
        
        // 觸發一個自定義事件，讓所有打開的頁面（包括控制端和顯示端）可以立即更新
        window.dispatchEvent(new Event('storageUpdate'));
        
        // 為了跨瀏覽器同步，也要觸發原生的 storage 事件
        const event = new Event('storage');
        window.dispatchEvent(event);
    }
}

/**
 * 從 localStorage 取得最新的玩家狀態。
 * @returns {Array<Object>} 玩家資料陣列
 */
function getPlayersFromStorage() {
    const storedStatus = localStorage.getItem(STORAGE_KEY);
    // 如果 localStorage 為空，則初始化
    return storedStatus ? JSON.parse(storedStatus) : initializePlayers(); 
}

/**
 * 取得最近被淘汰的玩家資料，用於中央顯示板。
 * @returns {Object} 最近淘汰的玩家資料或預設值
 */
function getRecentlyEliminated() {
    const players = getPlayersFromStorage();
    // 找到 ID 最大的且 alive: false 的玩家，模擬最近淘汰（這是一個簡化邏輯）
    const eliminated = players
        .filter(p => !p.alive)
        .sort((a, b) => b.id - a.id) // 按 ID 降序排列
        .shift(); // 取出第一個
        
    return eliminated || { id: '---', name: '全體生存' };
}
