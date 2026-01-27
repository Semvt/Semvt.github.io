document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('youtubeFrame');
    const closeBtn = document.querySelector('.close-btn');
    const cards = document.querySelectorAll('.vtuber-card');

    // Открытие модального окна
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.getAttribute('data-video');
            if (videoId) {
                // Формируем ссылку для embed (автозапуск включен)
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                modal.style.display = 'flex';
            }
        });
    });

    // Закрытие по крестику
    closeBtn.addEventListener('click', closeModal);

    // Закрытие по клику вне видео
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        // Очищаем src, чтобы остановить видео
        iframe.src = '';
    }
});
