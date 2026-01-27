document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.vtuber-panel');

    panels.forEach(panel => {
        // Добавляем слушатель только на заголовок, чтобы клики по кнопкам внутри не закрывали панель
        const header = panel.querySelector('.panel-header');
        
        header.addEventListener('click', () => {
            const isActive = panel.classList.contains('active');
            
            // Закрываем остальные
            panels.forEach(p => {
                p.classList.remove('active');
            });

            // Открываем текущую, если она была закрыта
            if (!isActive) {
                panel.classList.add('active');
            }
        });
    });
});
