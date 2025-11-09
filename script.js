// script.js

const TOTAL_PLAYERS = 16;
const STORAGE_KEY = 'squidGameStatus';

// 玩家初始資料：從 localStorage 載入，如果沒有則建立預設狀態 (全部生存)
function initializePlayers() {
    const storedStatus = localStorage.getItem(STORAGE_KEY);
    if (storedStatus) {
        return JSON.parse(storedStatus);
    }
    
    // 預設建立 16 個玩家，全部為 alive: true
    const players = [];
    for (let i = 1; i <= TOTAL_PLAYERS; i++) {
        players.push({
            id: i,
            name: `Player ${String(i).padStart(3, '0')}`,
            alive: true
        });
    }
    // 儲存初始狀態
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    return players;
}

// 核心功能：切換玩家狀態並儲存到 localStorage
function togglePlayerStatus(playerId) {
    let players = initializePlayers();
    const player = players.find(p => p.id === playerId);
    
    if (player) {
        player.alive = !player.alive; // 切換狀態
        localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
        console.log(`Player ${playerId} status toggled to: ${player.alive ? 'ALIVE' : 'ELIMINATED'}`);
        // 觸發一個自定義事件，讓控制端立即更新，避免依賴單純的頁面重載
        window.dispatchEvent(new Event('storageUpdate'));
    }
}

// 供其他頁面使用的工具函數
function getPlayersFromStorage() {
    const storedStatus = localStorage.getItem(STORAGE_KEY);
    return storedStatus ? JSON.parse(storedStatus) : initializePlayers();
}
