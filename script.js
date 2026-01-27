document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('youtubeFrame');
    const closeBtn = document.querySelector('.close-btn');
    // Обновили класс для поиска: ищем .vtuber-panel
    const panels = document.querySelectorAll('.vtuber-panel');

    panels.forEach(panel => {
        panel.addEventListener('click', () => {
            const videoId = panel.getAttribute('data-video');
            if (videoId) {
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                modal.style.display = 'flex';
            }
        });
    });

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.style.display = 'none';
        iframe.src = '';
    }
});
