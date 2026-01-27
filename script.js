document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.talent_item');

    items.forEach(item => {
        item.addEventListener('click', (e) => {
            // Если кликнули по ссылке внутри открытой карточки - не закрываем её
            if(e.target.closest('a')) return;

            // Проверяем, активен ли текущий элемент
            const isActive = item.classList.contains('active');

            // 1. Убираем класс 'active' у ВСЕХ элементов
            items.forEach(el => el.classList.remove('active'));

            // 2. Если элемент НЕ был активен, добавляем ему класс (открываем)
            // Если был активен - он просто закроется (логика тогла)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
