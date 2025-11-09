// script.js (重構版)

const TOTAL_PLAYERS = 456;
const STORAGE_KEY = 'squidGameStatus';

/**
 * 預設的空白 Base64 圖片 (這裡使用一個極小的透明圖作為佔位符)
 * 實際部署時，建議用一張 1x1 像素的黑色 Base64 圖片來保持氛圍。
 */
const DEFAULT_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGBgAAAABQAEAGBAAYnE8AAAAABJRU5ErkJggg==';

/**
 * 從 localStorage 載入玩家狀態，如果沒有則建立預設狀態 (全部生存)。
 * 玩家 ID 會從 1 到 456。
 * @returns {Array<Object>} 玩家資料陣列
 */
function initializePlayers() {
    const storedStatus = localStorage.getItem(STORAGE_KEY);
    if (storedStatus) {
        // 確保載入的資料結構包含 imageURL，如果沒有則補上預設值
        const players = JSON.parse(storedStatus);
        return players.map(p => ({
            ...p,
            imageURL: p.imageURL || DEFAULT_IMAGE_BASE64 
        }));
    }
    
    const players = [];
    for (let i = 1; i <= TOTAL_PLAYERS; i++) {
        players.push({
            id: i,
            name: `Player ${String(i).padStart(3, '0')}`,
            alive: true,
            // 初始使用空白圖片
            imageURL: DEFAULT_IMAGE_BASE64
        });
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    return players;
}

/**
 * 切換單個玩家的生存狀態並儲存到 localStorage。
 * @param {number} playerId - 玩家的 ID
 */
function togglePlayerStatus(playerId) {
    let players = getPlayersFromStorage();
    const player = players.find(p => p.id === playerId);
    
    if (player) {
        player.alive = !player.alive;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
        
        window.dispatchEvent(new Event('storageUpdate'));
    }
}

/**
 * 從 localStorage 取得最新的玩家狀態。
 * @returns {Array<Object>} 玩家資料陣列
 */
function getPlayersFromStorage() {
    const storedStatus = localStorage.getItem(STORAGE_KEY);
    return storedStatus ? JSON.parse(storedStatus) : initializePlayers(); 
}

/**
 * 取得最近被淘汰的玩家資料，用於中央顯示板。
 * @returns {Object} 最近淘汰的玩家資料或預設值
 */
function getRecentlyEliminated() {
    const players = getPlayersFromStorage();
    // 找到 ID 最大的且 alive: false 的玩家，模擬最近淘汰
    const eliminated = players
        .filter(p => !p.alive)
        .sort((a, b) => b.id - a.id)
        .shift();
        
    return eliminated || { id: '---', name: '全體生存' };
}
