// script.js (更新淘汰計數函數)

const TOTAL_PLAYERS = 456;
const STORAGE_KEY = 'squidGameStatus';

const DEFAULT_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGBgAAAABQAEAGBAAYnE8AAAAABJRU5ErkJggg==';

/**
 * 從 localStorage 載入玩家狀態，如果沒有則建立預設狀態 (全部生存)。
 * 玩家 ID 會從 1 到 456。
 * @returns {Array<Object>} 玩家資料陣列
 */
function initializePlayers() {
    const storedStatus = localStorage.getItem(STORAGE_KEY);
    if (storedStatus) {
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
 * (這個函數將被淘汰計數取代，但保留以防萬一需要最後淘汰者 ID)
 * @returns {Object} 最近淘汰的玩家資料或預設值
 */
function getRecentlyEliminated() {
    const players = getPlayersFromStorage();
    const eliminated = players
        .filter(p => !p.alive)
        .sort((a, b) => b.id - a.id)
        .shift();
        
    return eliminated || { id: '---', name: '全體生存' };
}

/**
 * 計算當前淘汰的玩家數量。
 * @returns {number} 淘汰玩家數量
 */
function getEliminatedCount() {
    const players = getPlayersFromStorage();
    return players.filter(p => !p.alive).length;
}
