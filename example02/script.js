// 用來篩選圖片顯示的函數
function filterImages(type) {
    const allImages = document.querySelectorAll('.gallery img');
    allImages.forEach(img => {
        img.classList.remove('hidden');
        if (type !== 'all' && !img.classList.contains(type)) {
            img.classList.add('hidden');
        }
    });
}

// 設置按鈕的 active 樣式
document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', () => {
        // 取得要篩選的類型
        const type = button.getAttribute('data-type');

        // 切換圖片
        filterImages(type);

        // 移除其他按鈕的 active 類
        document.querySelectorAll('.buttons button').forEach(btn => {
            btn.classList.remove('active');
        });

        // 給目前按鈕加上 active 類
        button.classList.add('active');
    });
});

// 預設載入時顯示全部 & 設定 "全部" 為 active
document.addEventListener('DOMContentLoaded', () => {
    filterImages('all');
    document.querySelector('.buttons button[data-type="all"]').classList.add('active');
});
