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

const cards = document.querySelectorAll('.tcg-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
});
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 60; // Количество частиц

// Цвета твоих витуберов
const vTuberColors = ['#cf2e2e', '#20b2aa', '#0056b3', '#f06292'];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Размер от 1 до 4 пикселей
        this.speedX = Math.random() * 0.5 - 0.25; // Медленное движение по X
        this.speedY = Math.random() * 0.5 - 0.25; // Медленное движение по Y
        this.color = vTuberColors[Math.floor(Math.random() * vTuberColors.length)];
        this.opacity = Math.random() * 0.5 + 0.1; // Прозрачность
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Если частица улетела за экран, возвращаем её с другой стороны
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        // Рисуем маленькие квадратики (инженерный/цифровой стиль)
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

function createParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

createParticles();
animate();
