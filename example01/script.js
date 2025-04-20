// 取得 HTML 元素
const countdownEl = document.getElementById('countdown');
const datetimeInput = document.getElementById('datetime');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// 計時器控制變數
let targetTime = null;     // 使用者選擇的目標時間（timestamp）
let interval = null;       // setInterval 控制器
let pausedAt = null;       // 按下暫停當下的時間（timestamp）
let totalPausedDuration = 0; // 暫停所累積的總時長（ms）

// 初始化 flatpickr 日期時間選擇器
flatpickr("#datetime", {
    enableTime: true,
    time_24hr: false,
    seconds: true,
    dateFormat: "Y-m-d h:i:S K",
    defaultHour: 12,
    defaultMinute: 0,
    defaultSeconds: 0,
    position: "auto right",
    locale: "default",
    monthSelectorType: "static"
});

// 更新倒數顯示邏輯
function updateCountdown() {
    const now = Date.now();
    const adjustedTarget = targetTime - totalPausedDuration; // 扣除暫停總時長
    const distance = adjustedTarget - now;

    // 如果時間已到
    if (distance <= 0) {
        clearInterval(interval);
        countdownEl.textContent = "00:00:00";
        alert("目標日期及時間已到，計時結束！");
        reset();
        return;
    }

    // 計算 hh:mm:ss 格式
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // 顯示在頁面上
    countdownEl.textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 重置功能
function reset() {
    clearInterval(interval);
    countdownEl.textContent = "00:00:00";
    startBtn.textContent = "開始";
    targetTime = null;
    pausedAt = null;
    totalPausedDuration = 0;

    // 清除時間選擇器
    if (datetimeInput._flatpickr) {
        datetimeInput._flatpickr.clear();
    }
}

// 處理開始 / 暫停 / 繼續按鈕邏輯
startBtn.addEventListener('click', () => {
    if (startBtn.textContent === "開始") {
        // 點擊「開始」
        if (!datetimeInput._flatpickr || !datetimeInput._flatpickr.selectedDates.length) {
            alert("請先設定目標日期及時間");
            return;
        }

        const selectedDate = datetimeInput._flatpickr.selectedDates[0];
        if (!selectedDate || isNaN(selectedDate.getTime())) {
            alert("目標時間無效，請重新設定");
            return;
        }

        targetTime = selectedDate.getTime();
        const now = Date.now();

        if (targetTime <= now) {
            alert("目標時間已過，請重新設定");
            return;
        }

        totalPausedDuration = 0; // 開始時清除累計暫停
        interval = setInterval(updateCountdown, 1000);
        startBtn.textContent = "暫停";

    } else if (startBtn.textContent === "暫停") {
        // 點擊「暫停」
        clearInterval(interval);
        pausedAt = Date.now(); // 記錄暫停當下時間
        startBtn.textContent = "繼續";

    } else if (startBtn.textContent === "繼續") {
        // 點擊「繼續」
        if (!pausedAt) {
            alert("錯誤：找不到暫停時間");
            return;
        }

        const now = Date.now();
        const pauseDuration = now - pausedAt; // 計算暫停時間
        totalPausedDuration += pauseDuration; // 累加暫停時間
        pausedAt = null;

        interval = setInterval(updateCountdown, 1000);
        startBtn.textContent = "暫停";
    }
});

// 重置按鈕邏輯
resetBtn.addEventListener('click', () => {
    reset();
});