document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.talent_list li');

    items.forEach(item => {
        // Обработчик клика на саму карточку
        item.addEventListener('click', (e) => {
            // Если кликнули по ссылке (кнопке Youtube/Twitter), не закрываем карточку
            if(e.target.closest('a')) return;

            // Проверяем, открыт ли текущий элемент
            const isActive = item.classList.contains('active');

            // 1. Закрываем все карточки
            items.forEach(el => el.classList.remove('active'));

            // 2. Если карточка была закрыта, открываем её
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});
