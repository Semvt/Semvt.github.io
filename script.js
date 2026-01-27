console.log("Script loaded!"); // Проверка работы

document.addEventListener('DOMContentLoaded', () => {
    // Ищем все панели
    const panels = document.querySelectorAll('.vtuber-panel');

    panels.forEach(panel => {
        // Ищем заголовок внутри панели
        const header = panel.querySelector('.panel-header');
        
        if (header) {
            header.addEventListener('click', (e) => {
                console.log("Clicked!"); // Проверка клика
                
                // Проверяем, открыта ли уже эта панель
                const isActive = panel.classList.contains('active');
                
                // Закрываем ВСЕ панели
                panels.forEach(p => {
                    p.classList.remove('active');
                });

                // Если нажатая панель была закрыта - открываем её
                if (!isActive) {
                    panel.classList.add('active');
                }
            });
        }
    });
});
