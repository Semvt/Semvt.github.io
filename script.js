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
// ВСТАВЬ СЮДА СВОЙ ID (Цифры)
const DISCORD_ID = "749929485960216636"; 

const avatar = document.getElementById('avatar-img');
const statusBox = document.getElementById('discord-stat-box');

// Подключаемся к Lanyard через WebSocket (для живого обновления)
// Это работает быстрее и лучше, чем обычные запросы
const socket = new WebSocket("wss://api.lanyard.rest/socket");

socket.onopen = () => {
    // При подключении отправляем приветствие и подписываемся на твой ID
    socket.send(JSON.stringify({
        op: 2,
        d: { subscribe_to_id: DISCORD_ID }
    }));
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Обрабатываем два типа сообщений: INIT (первая загрузка) и PRESENCE_UPDATE (обновление)
    if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
        updateStatus(data.d);
    }
};

function updateStatus(discordData) {
    // 1. ОБНОВЛЯЕМ РАМКУ АВАТАРА
    // Lanyard возвращает статус: online, idle, dnd, offline
    const status = discordData.discord_status;
    
    // Сбрасываем старые классы
    avatar.className = "avatar"; 
    
    // Добавляем новый класс цвета
    if(status === 'online') avatar.classList.add('border-online');
    else if(status === 'idle') avatar.classList.add('border-idle');
    else if(status === 'dnd') avatar.classList.add('border-dnd');
    else avatar.classList.add('border-offline');

    // 2. ИЩЕМ АКТИВНОСТЬ (Игру или Spotify)
    let activityHTML = "";
    let isDoingSomething = false;

    // Сначала проверяем Spotify (у Lanyard есть отдельное поле для него)
    if (discordData.listening_to_spotify) {
        const spotify = discordData.spotify;
        isDoingSomething = true;
        activityHTML = `
            <i class="fab fa-spotify" style="color: #1DB954; font-size: 20px;"></i>
            <span>Listening to <strong>${spotify.song}</strong> by ${spotify.artist}</span>
        `;
    } 
    // Если музыки нет, проверяем Игры/Приложения
    else if (discordData.activities && discordData.activities.length > 0) {
        // Берем первую активность, которая НЕ является "Custom Status" (обычно это игра)
        const game = discordData.activities.find(act => act.type !== 4);
        
        if (game) {
            isDoingSomething = true;
            activityHTML = `
                <i class="fas fa-gamepad" style="color: #27C7FF; font-size: 20px;"></i>
                <span>Playing <strong>${game.name}</strong></span>
            `;
            // Если у игры есть картинка, можно усложнить код, но пока оставим текст для простоты
        }
    }

    // 3. ВЫВОДИМ РЕЗУЛЬТАТ
    if (isDoingSomething) {
        statusBox.innerHTML = activityHTML;
        statusBox.classList.add('visible'); // Показываем блок
    } else {
        // Если ничего не делаешь
        if(status === 'offline') {
             statusBox.innerHTML = `<span>Currently Offline 💤</span>`;
        } else {
             statusBox.innerHTML = `<span>Chilling Online</span>`;
        }
        statusBox.classList.add('visible');
    }
}
