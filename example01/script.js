// === 宣告變數區 ===
let countdownInterval;
let targetTime = null;
let isPaused = false;
let isRunning = false;

const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const datetimeInput = document.getElementById('datetime');
const timerEl = document.getElementById('timer');

// 初始化 Flatpickr
flatpickr("#datetime", {
    enableTime: true,         // 啟用時間選擇
    time_24hr: false,         // 使用 12 小時制（預設為 false，其實可以不寫）
    dateFormat: "Y-m-d h:i K", // 使用 12 小時格式（小時用 h，K 是 AM/PM）
    defaultHour: 12,
    defaultMinute: 0,
});

// 更新顯示時間
function updateTimerDisplay(hours, minutes, seconds) {
    timerEl.textContent =
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;
}

// 重置邏輯
function resetTimer() {
    clearInterval(countdownInterval);
    updateTimerDisplay(0, 0, 0);
    datetimeInput._flatpickr.clear(); // 清除輸入值
    startBtn.textContent = "開始";
    isRunning = false;
    isPaused = false;
    targetTime = null;
}

// 倒數主邏輯
function startCountdown() {
    countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = targetTime - now;

        if (diff <= 0) {
            alert("目標時間已到！");
            resetTimer();
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        updateTimerDisplay(hours, minutes, seconds);
    }, 1000);
}

// 開始/暫停按鈕
startBtn.addEventListener('click', () => {
    const input = datetimeInput.value;

    if (isRunning && !isPaused) {
        clearInterval(countdownInterval);
        isPaused = true;
        startBtn.textContent = "繼續";
        return;
    }

    if (isRunning && isPaused) {
        isPaused = false;
        startBtn.textContent = "暫停";
        startCountdown();
        return;
    }

    if (!input) {
        alert("請先設定目標時間！");
        return;
    }

    const selectedTime = new Date(input);
    const now = new Date();

    if (selectedTime <= now) {
        alert("時間已過，請重新設定！");
        return;
    }

    targetTime = selectedTime;
    isRunning = true;
    isPaused = false;
    startBtn.textContent = "暫停";
    startCountdown();
});

// 重置按鈕
resetBtn.addEventListener('click', resetTimer);
