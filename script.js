document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.vtuber-panel');

    panels.forEach(panel => {
        panel.addEventListener('click', (e) => {
            // Если кликнули по самой панели
            
            const isActive = panel.classList.contains('active');
            
            // 1. Сначала закроем все остальные открытые панели
            panels.forEach(p => {
                p.classList.remove('active');
                // Очищаем видео в закрытых панелях (чтобы звук не играл в фоне)
                const container = p.querySelector('.video-container');
                container.innerHTML = '';
            });

            // 2. Если панель не была активна - открываем её
            if (!isActive) {
                panel.classList.add('active');
                
                // Загружаем видео
                const videoId = panel.getAttribute('data-video');
                const container = panel.querySelector('.video-container');
                
                if (videoId && container.innerHTML === '') {
                    // Создаем iframe кодом
                    container.innerHTML = `
                        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                                allow="autoplay; encrypted-media" 
                                allowfullscreen>
                        </iframe>
                    `;
                }
            }
        });
    });
});
