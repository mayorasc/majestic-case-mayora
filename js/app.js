// ============================================================
//  MAJESTIC CASES — Main Application Logic
// ============================================================

// ============ STATE ============
let balance = parseInt(localStorage.getItem('mj_balance')) || 10000;
let inventory = JSON.parse(localStorage.getItem('mj_inventory')) || [];
let totalOpened = parseInt(localStorage.getItem('mj_totalOpened')) || 156847;
let currentCase = null;
let isSpinning = false;
let soundEnabled = true;
let currentWinItem = null;

// ============ AUTH STATE ============
let currentUser = JSON.parse(localStorage.getItem('mj_user')) || null;

// ⚠️ ЗАМЕНИ на username своего бота (без @)
const TELEGRAM_BOT_USERNAME = 'mayoraclaude_bot';

// ============ AUTH FUNCTIONS ============

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        loadTelegramWidget();
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
}

function loadTelegramWidget() {
    const container = document.getElementById('telegramWidgetContainer');
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    container.appendChild(script);
}

function onTelegramAuth(user) {
    console.log('Telegram auth data:', user);

    currentUser = {
        id: user.id,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        username: user.username || '',
        photoUrl: user.photo_url || '',
        authDate: user.auth_date,
        hash: user.hash
    };

    localStorage.setItem('mj_user', JSON.stringify(currentUser));

    closeAuthModal();
    updateAuthUI();
    showNotification('✅', 'Добро пожаловать, ' + currentUser.firstName + '!');
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('mj_user');
    updateAuthUI();
    closeUserMenu();
    showNotification('👋', 'Вы вышли из аккаунта');
}

function updateAuthUI() {
    const btnLogin = document.getElementById('btnLogin');
    const userProfile = document.getElementById('userProfile');

    if (currentUser) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';

            const avatarImg = document.getElementById('userAvatarImg');
            const avatarFallback = document.getElementById('userAvatarFallback');
            const userName = document.getElementById('userName');

            if (currentUser.photoUrl && avatarImg) {
                avatarImg.src = currentUser.photoUrl;
                avatarImg.classList.add('loaded');
                avatarImg.onerror = function() {
                    avatarImg.classList.remove('loaded');
                };
            } else if (avatarImg) {
                avatarImg.classList.remove('loaded');
            }

            if (avatarFallback) {
                var initials = (currentUser.firstName.charAt(0) + (currentUser.lastName.charAt(0) || '')).toUpperCase();
                avatarFallback.textContent = initials || 'U';
            }

            if (userName) {
                userName.textContent = currentUser.firstName;
            }

            var menuAvatar = document.getElementById('menuAvatar');
            var menuName = document.getElementById('menuName');
            var menuUsername = document.getElementById('menuUsername');

            if (menuAvatar) {
                if (currentUser.photoUrl) {
                    menuAvatar.src = currentUser.photoUrl;
                    menuAvatar.style.display = 'block';
                } else {
                    menuAvatar.style.display = 'none';
                }
            }
            if (menuName) menuName.textContent = (currentUser.firstName + ' ' + currentUser.lastName).trim();
            if (menuUsername) {
                menuUsername.textContent = currentUser.username ? '@' + currentUser.username : 'ID: ' + currentUser.id;
            }
        }
    } else {
        if (btnLogin) btnLogin.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
}

function toggleUserMenu() {
    var menu = document.getElementById('userMenu');
    if (menu) menu.classList.toggle('open');
}

function closeUserMenu() {
    var menu = document.getElementById('userMenu');
    if (menu) menu.classList.remove('open');
}

// ============ CASES DATA ============
const cases = [
    {
        id: 1,
        name: "Стартовый кейс",
        description: "Идеальный для новичков. Базовые предметы для начала игры на сервере.",
        price: 500,
        icon: "📦",
        tag: "popular",
        badge: null,
        color: "rgba(59, 130, 246, 0.3)",
        items: [
            { name: "Пистолет", icon: "🔫", rarity: "common", chance: 30, value: 200 },
            { name: "Аптечка", icon: "💊", rarity: "common", chance: 25, value: 300 },
            { name: "Бронежилет", icon: "🦺", rarity: "uncommon", chance: 20, value: 600 },
            { name: "Рация", icon: "📻", rarity: "uncommon", chance: 12, value: 800 },
            { name: "Телефон", icon: "📱", rarity: "rare", chance: 8, value: 1500 },
            { name: "VIP 3 дня", icon: "⭐", rarity: "epic", chance: 4, value: 3000 },
            { name: "Futo", icon: "🚗", rarity: "legendary", chance: 1, value: 10000 }
        ]
    },
    {
        id: 2,
        name: "Автомобильный",
        description: "Шанс выиграть крутой автомобиль для поездок по городу.",
        price: 2000,
        icon: "🚗",
        tag: "popular",
        badge: "hot",
        color: "rgba(239, 68, 68, 0.3)",
        items: [
            { name: "Blista", icon: "🚙", rarity: "common", chance: 25, value: 1000 },
            { name: "Sultan", icon: "🚘", rarity: "common", chance: 20, value: 1500 },
            { name: "Elegy", icon: "🏎️", rarity: "uncommon", chance: 18, value: 3000 },
            { name: "Jester", icon: "🚕", rarity: "rare", chance: 15, value: 5000 },
            { name: "Zentorno", icon: "🏎️", rarity: "rare", chance: 10, value: 8000 },
            { name: "T20", icon: "🏁", rarity: "epic", chance: 7, value: 15000 },
            { name: "Adder", icon: "💨", rarity: "legendary", chance: 4, value: 30000 },
            { name: "Thrax", icon: "👑", rarity: "mythic", chance: 1, value: 100000 }
        ]
    },
    {
        id: 3,
        name: "Оружейный",
        description: "Лучшее оружие для защиты территории и выполнения заданий.",
        price: 1500,
        icon: "⚔️",
        tag: "popular",
        badge: null,
        color: "rgba(245, 158, 11, 0.3)",
        items: [
            { name: "Нож", icon: "🔪", rarity: "common", chance: 25, value: 500 },
            { name: "Пистолет", icon: "🔫", rarity: "common", chance: 22, value: 800 },
            { name: "Дробовик", icon: "💥", rarity: "uncommon", chance: 18, value: 2000 },
            { name: "SMG", icon: "🔫", rarity: "uncommon", chance: 15, value: 3000 },
            { name: "Винтовка", icon: "🎯", rarity: "rare", chance: 10, value: 5000 },
            { name: "Снайперка", icon: "🔭", rarity: "epic", chance: 6, value: 10000 },
            { name: "RPG", icon: "🚀", rarity: "legendary", chance: 3, value: 25000 },
            { name: "Миниган", icon: "⚡", rarity: "mythic", chance: 1, value: 50000 }
        ]
    },
    {
        id: 4,
        name: "Бизнес кейс",
        description: "Шанс получить собственный бизнес в городе! От закусочной до казино.",
        price: 5000,
        icon: "🏢",
        tag: "premium",
        badge: "new",
        color: "rgba(124, 58, 237, 0.3)",
        items: [
            { name: "Закусочная", icon: "🌮", rarity: "common", chance: 25, value: 3000 },
            { name: "Автомойка", icon: "🚿", rarity: "uncommon", chance: 20, value: 5000 },
            { name: "Заправка", icon: "⛽", rarity: "uncommon", chance: 18, value: 8000 },
            { name: "Магазин", icon: "🏪", rarity: "rare", chance: 15, value: 12000 },
            { name: "Автосалон", icon: "🏬", rarity: "rare", chance: 10, value: 20000 },
            { name: "Клуб", icon: "🎵", rarity: "epic", chance: 7, value: 35000 },
            { name: "Казино", icon: "🎰", rarity: "legendary", chance: 4, value: 75000 },
            { name: "Небоскрёб", icon: "🏙️", rarity: "mythic", chance: 1, value: 200000 }
        ]
    },
    {
        id: 5,
        name: "VIP Кейс",
        description: "Премиум привилегии и эксклюзивные бонусы для вашего аккаунта.",
        price: 3000,
        icon: "👑",
        tag: "premium",
        badge: "hot",
        color: "rgba(245, 158, 11, 0.3)",
        items: [
            { name: "VIP 1 день", icon: "⭐", rarity: "common", chance: 25, value: 1500 },
            { name: "VIP 3 дня", icon: "⭐", rarity: "common", chance: 20, value: 3000 },
            { name: "VIP 7 дней", icon: "🌟", rarity: "uncommon", chance: 18, value: 6000 },
            { name: "VIP 14 дней", icon: "🌟", rarity: "rare", chance: 15, value: 10000 },
            { name: "VIP 30 дней", icon: "💫", rarity: "rare", chance: 10, value: 18000 },
            { name: "Premium 30д", icon: "💎", rarity: "epic", chance: 7, value: 30000 },
            { name: "Diamond 30д", icon: "💠", rarity: "legendary", chance: 4, value: 50000 },
            { name: "Diamond 90д", icon: "👑", rarity: "mythic", chance: 1, value: 150000 }
        ]
    },
    {
        id: 6,
        name: "Донат кейс",
        description: "Донат валюта и уникальные предметы для прокачки аккаунта.",
        price: 1000,
        icon: "💰",
        tag: "new",
        badge: "new",
        color: "rgba(16, 185, 129, 0.3)",
        items: [
            { name: "500 коинов", icon: "🪙", rarity: "common", chance: 28, value: 500 },
            { name: "1000 коинов", icon: "🪙", rarity: "common", chance: 22, value: 1000 },
            { name: "2500 коинов", icon: "💰", rarity: "uncommon", chance: 18, value: 2500 },
            { name: "5000 коинов", icon: "💰", rarity: "rare", chance: 14, value: 5000 },
            { name: "10000 коинов", icon: "💎", rarity: "rare", chance: 9, value: 10000 },
            { name: "25000 коинов", icon: "💎", rarity: "epic", chance: 5, value: 25000 },
            { name: "50000 коинов", icon: "👑", rarity: "legendary", chance: 3, value: 50000 },
            { name: "100000 коинов", icon: "🏆", rarity: "mythic", chance: 1, value: 100000 }
        ]
    },
    {
        id: 7,
        name: "Недвижимость",
        description: "Дома, квартиры и особняки в лучших районах города.",
        price: 8000,
        icon: "🏠",
        tag: "premium",
        badge: null,
        color: "rgba(236, 72, 153, 0.3)",
        items: [
            { name: "Трейлер", icon: "🏕️", rarity: "common", chance: 25, value: 4000 },
            { name: "Квартира", icon: "🏢", rarity: "uncommon", chance: 22, value: 8000 },
            { name: "Дом", icon: "🏠", rarity: "uncommon", chance: 18, value: 15000 },
            { name: "Коттедж", icon: "🏡", rarity: "rare", chance: 14, value: 25000 },
            { name: "Пентхаус", icon: "🌆", rarity: "rare", chance: 10, value: 40000 },
            { name: "Вилла", icon: "🏖️", rarity: "epic", chance: 6, value: 80000 },
            { name: "Особняк", icon: "🏰", rarity: "legendary", chance: 4, value: 150000 },
            { name: "Остров", icon: "🏝️", rarity: "mythic", chance: 1, value: 500000 }
        ]
    },
    {
        id: 8,
        name: "Мото кейс",
        description: "Мотоциклы от классики до спортбайков и футуристичных моделей.",
        price: 1200,
        icon: "🏍️",
        tag: "new",
        badge: "new",
        color: "rgba(99, 102, 241, 0.3)",
        items: [
            { name: "Faggio", icon: "🛵", rarity: "common", chance: 28, value: 500 },
            { name: "Sanchez", icon: "🏍️", rarity: "common", chance: 22, value: 1000 },
            { name: "PCJ-600", icon: "🏍️", rarity: "uncommon", chance: 18, value: 2000 },
            { name: "Bati 801", icon: "🏍️", rarity: "uncommon", chance: 14, value: 3500 },
            { name: "Hakuchou", icon: "🏍️", rarity: "rare", chance: 9, value: 6000 },
            { name: "Shotaro", icon: "⚡", rarity: "epic", chance: 5, value: 12000 },
            { name: "Deathbike", icon: "💀", rarity: "legendary", chance: 3, value: 25000 },
            { name: "Oppressor", icon: "🚀", rarity: "mythic", chance: 1, value: 80000 }
        ]
    },
    {
        id: 9,
        name: "Люкс кейс",
        description: "Самые дорогие и эксклюзивные предметы сервера.",
        price: 15000,
        icon: "💎",
        tag: "premium",
        badge: "hot",
        color: "rgba(168, 85, 247, 0.4)",
        items: [
            { name: "Zentorno", icon: "🏎️", rarity: "common", chance: 22, value: 8000 },
            { name: "T20", icon: "🏁", rarity: "uncommon", chance: 20, value: 15000 },
            { name: "Пентхаус", icon: "🌆", rarity: "uncommon", chance: 18, value: 25000 },
            { name: "Казино", icon: "🎰", rarity: "rare", chance: 14, value: 50000 },
            { name: "Diamond VIP", icon: "💠", rarity: "rare", chance: 10, value: 75000 },
            { name: "Яхта", icon: "🛥️", rarity: "epic", chance: 8, value: 120000 },
            { name: "Особняк", icon: "🏰", rarity: "legendary", chance: 5, value: 250000 },
            { name: "Мега-приз", icon: "🏆", rarity: "mythic", chance: 3, value: 1000000 }
        ]
    }
];

const liveDropUsers = [
    "Alex_M", "Dmitry_K", "Sasha_V", "Nikita_P", "Ivan_S",
    "Artem_L", "Max_R", "Vlad_G", "Kirill_N", "Roma_T",
    "Dima_F", "Andrey_B", "Pavel_Z", "Sergey_M", "Oleg_K",
    "Denis_H", "Egor_Y", "Timur_A", "Ruslan_C", "Ilya_D"
];

// ============ UTILITY FUNCTIONS ============
function getRarityColor(rarity) {
    var colors = {
        common: '#9ca3af',
        uncommon: '#10b981',
        rare: '#3b82f6',
        epic: '#8b5cf6',
        legendary: '#f59e0b',
        mythic: '#ef4444'
    };
    return colors[rarity] || '#9ca3af';
}

function getRarityName(rarity) {
    var names = {
        common: 'Обычный',
        uncommon: 'Необычный',
        rare: 'Редкий',
        epic: 'Эпический',
        legendary: 'Легендарный',
        mythic: 'Мифический'
    };
    return names[rarity] || 'Обычный';
}

function getRandomItem(caseData) {
    var rand = Math.random() * 100;
    var cumulative = 0;
    for (var i = 0; i < caseData.items.length; i++) {
        cumulative += caseData.items[i].chance;
        if (rand <= cumulative) return Object.assign({}, caseData.items[i]);
    }
    return Object.assign({}, caseData.items[0]);
}

function saveState() {
    localStorage.setItem('mj_balance', balance);
    localStorage.setItem('mj_inventory', JSON.stringify(inventory));
    localStorage.setItem('mj_totalOpened', totalOpened);
}

function formatNumber(num) {
    return num.toLocaleString('ru-RU');
}

// ============ BALANCE ============
function updateBalanceDisplay() {
    var els = document.querySelectorAll('.balance-amount');
    els.forEach(function(el) {
        el.textContent = formatNumber(balance);
    });
}

// ============ PARTICLES ============
function createParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    for (var i = 0; i < 30; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ============ NOTIFICATION ============
function showNotification(icon, text) {
    var notif = document.getElementById('notification');
    if (!notif) return;
    document.getElementById('notifIcon').textContent = icon;
    document.getElementById('notifText').textContent = text;
    notif.classList.add('show');
    setTimeout(function() { notif.classList.remove('show'); }, 3500);
}

// ============ CONFETTI ============
function createConfetti() {
    var container = document.getElementById('confettiContainer');
    if (!container) return;
    container.innerHTML = '';
    var colors = ['#7c3aed', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#fbbf24'];
    for (var i = 0; i < 100; i++) {
        var piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        piece.style.animationDelay = (Math.random() * 0.8) + 's';
        piece.style.width = (Math.random() * 10 + 4) + 'px';
        piece.style.height = (Math.random() * 10 + 4) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        container.appendChild(piece);
    }
    setTimeout(function() { container.innerHTML = ''; }, 4500);
}

// ============ LIVE DROPS ============
function initLiveDrops() {
    var track = document.getElementById('liveDrops');
    if (!track) return;
    for (var i = 0; i < 8; i++) {
        addLiveDropElement(track, false);
    }
}

function addLiveDropElement(track, prepend, specificItem) {
    if (prepend === undefined) prepend = true;
    var randomCase = cases[Math.floor(Math.random() * cases.length)];
    var item = specificItem || randomCase.items[Math.floor(Math.random() * randomCase.items.length)];
    var user = liveDropUsers[Math.floor(Math.random() * liveDropUsers.length)];

    var div = document.createElement('div');
    div.className = 'live-drop-item';
    div.innerHTML =
        '<div class="live-drop-avatar">' + user.charAt(0) + '</div>' +
        '<div class="live-drop-info">' +
            '<span class="live-drop-user">' + user + '</span>' +
            '<span class="live-drop-item-name rarity-' + item.rarity + '">' + item.name + '</span>' +
        '</div>' +
        '<span class="live-drop-icon">' + item.icon + '</span>';

    if (prepend) {
        track.insertBefore(div, track.firstChild);
        if (track.children.length > 12) {
            track.removeChild(track.lastChild);
        }
    } else {
        track.appendChild(div);
    }
}

function startLiveDropsInterval() {
    setInterval(function() {
        var track = document.getElementById('liveDrops');
        if (track) addLiveDropElement(track, true);
    }, 3000 + Math.random() * 4000);
}

// ============ HEADER SCROLL ============
function initHeaderScroll() {
    window.addEventListener('scroll', function() {
        var header = document.getElementById('header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
}

// ============ MOBILE NAV ============
function toggleMobileNav() {
    var nav = document.querySelector('.nav');
    if (nav) nav.classList.toggle('mobile-open');
}

// ============ SOUND ============
function toggleSound() {
    soundEnabled = !soundEnabled;
    var el = document.getElementById('soundToggle');
    if (el) el.textContent = soundEnabled ? '🔊' : '🔇';
}

// ============ DEPOSIT ============
function openDeposit() {
    var modal = document.getElementById('depositModal');
    if (modal) modal.classList.add('active');
}

function closeDeposit() {
    var modal = document.getElementById('depositModal');
    if (modal) modal.classList.remove('active');
}

function setDepositAmount(amount) {
    var input = document.getElementById('depositInput');
    if (input) input.value = amount;
}

function confirmDeposit() {
    var input = document.getElementById('depositInput');
    var amount = parseInt(input ? input.value : 0);
    if (amount > 0) {
        balance += amount;
        updateBalanceDisplay();
        saveState();
        showNotification('✅', 'Баланс пополнен на ' + formatNumber(amount) + ' 💎');
        closeDeposit();
    }
}

// ============ RENDER CASES (index.html) ============
function renderCases(filter) {
    if (!filter) filter = 'all';
    var grid = document.getElementById('casesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    var filtered = filter === 'all' ? cases : cases.filter(function(c) { return c.tag === filter; });

    filtered.forEach(function(c) {
        var card = document.createElement('div');
        card.className = 'case-card';
        card.style.setProperty('--card-color', c.color);

        var badgeHTML = '';
        if (c.badge === 'hot') badgeHTML = '<div class="case-card-badge hot">🔥 HOT</div>';
        if (c.badge === 'new') badgeHTML = '<div class="case-card-badge new">✨ NEW</div>';

        var dots = c.items.map(function(item) {
            return '<div class="item-dot rarity-bg-' + item.rarity + '"></div>';
        }).join('');

        card.innerHTML =
            badgeHTML +
            '<div class="case-image">' +
                '<div class="case-glow"></div>' +
                '<div class="case-icon">' + c.icon + '</div>' +
            '</div>' +
            '<div class="case-name">' + c.name + '</div>' +
            '<div class="case-description">' + c.description + '</div>' +
            '<div class="case-items-preview">' + dots + '</div>' +
            '<div class="case-footer">' +
                '<div class="case-price">' +
                    '<span class="case-price-icon">💎</span>' +
                    '<span class="case-price-amount">' + formatNumber(c.price) + '</span>' +
                '</div>' +
                '<button class="case-open-btn" onclick="event.stopPropagation(); goToCase(' + c.id + ')">Открыть</button>' +
            '</div>';

        card.onclick = function() { goToCase(c.id); };
        grid.appendChild(card);
    });
}

function filterCases(filter, btn) {
    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderCases(filter);
}

function goToCase(id) {
    window.location.href = 'open.html?id=' + id;
}

// ============ CASE OPENING PAGE (open.html) ============
function initOpenPage() {
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));
    currentCase = cases.find(function(c) { return c.id === id; });

    if (!currentCase) {
        window.location.href = 'index.html';
        return;
    }

    var iconEl = document.getElementById('openCaseIcon');
    var titleEl = document.getElementById('openCaseTitle');
    var descEl = document.getElementById('openCaseDesc');
    var priceEl = document.getElementById('openCasePrice');

    if (iconEl) iconEl.textContent = currentCase.icon;
    if (titleEl) titleEl.textContent = currentCase.name;
    if (descEl) descEl.textContent = currentCase.description;
    if (priceEl) priceEl.textContent = '💎 ' + formatNumber(currentCase.price);

    renderCaseContents();
    buildRoulette();
}

function renderCaseContents() {
    var grid = document.getElementById('caseContentsGrid');
    if (!grid || !currentCase) return;
    grid.innerHTML = '';

    currentCase.items.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'content-item';
        div.innerHTML =
            '<div class="content-item-icon">' + item.icon + '</div>' +
            '<div class="content-item-name rarity-' + item.rarity + '">' + item.name + '</div>' +
            '<div class="content-item-chance">' + item.chance + '%</div>' +
            '<div class="content-item-value">💎 ' + formatNumber(item.value) + '</div>' +
            '<div class="content-item-bar rarity-bg-' + item.rarity + '"></div>';
        grid.appendChild(div);
    });
}

function buildRoulette() {
    var track = document.getElementById('rouletteTrack');
    if (!track || !currentCase) return;

    track.innerHTML = '';
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';

    for (var i = 0; i < 70; i++) {
        var item = getRandomItem(currentCase);
        var div = document.createElement('div');
        div.className = 'roulette-item';
        div.innerHTML =
            '<div class="roulette-item-icon">' + item.icon + '</div>' +
            '<div class="roulette-item-name rarity-' + item.rarity + '">' + item.name + '</div>' +
            '<div class="roulette-item-rarity rarity-bg-' + item.rarity + '"></div>';
        track.appendChild(div);
    }
}

function spinRoulette(fast) {
    if (isSpinning || !currentCase) return;

    if (balance < currentCase.price) {
        showNotification('❌', 'Недостаточно средств! Пополните баланс.');
        return;
    }

    isSpinning = true;
    balance -= currentCase.price;
    totalOpened++;
    updateBalanceDisplay();
    saveState();

    var btnOpen = document.getElementById('btnOpenCase');
    var btnFast = document.getElementById('btnFastOpen');
    if (btnOpen) { btnOpen.disabled = true; btnOpen.innerHTML = '🎰 Крутим... <span class="price-tag">💎 ' + formatNumber(currentCase.price) + '</span>'; }
    if (btnFast) btnFast.disabled = true;

    var winItem = getRandomItem(currentCase);
    currentWinItem = winItem;

    var track = document.getElementById('rouletteTrack');
    var items = track.children;
    var winIndex = 50;

    items[winIndex].querySelector('.roulette-item-icon').textContent = winItem.icon;
    items[winIndex].querySelector('.roulette-item-name').textContent = winItem.name;
    items[winIndex].querySelector('.roulette-item-name').className = 'roulette-item-name rarity-' + winItem.rarity;
    items[winIndex].querySelector('.roulette-item-rarity').className = 'roulette-item-rarity rarity-bg-' + winItem.rarity;

    var itemWidth = items[0].offsetWidth || 150;
    var containerWidth = track.parentElement.offsetWidth;
    var centerOffset = containerWidth / 2;
    var targetPosition = winIndex * itemWidth + itemWidth / 2;
    var randomOffset = (Math.random() - 0.5) * (itemWidth * 0.6);
    var distance = -(targetPosition - centerOffset + randomOffset);

    var duration = fast ? 1.5 : 5;
    var easing = fast ? 'cubic-bezier(0.25, 0.8, 0.25, 1)' : 'cubic-bezier(0.15, 0.85, 0.25, 1)';

    track.style.transition = 'transform ' + duration + 's ' + easing;
    track.style.transform = 'translateX(' + distance + 'px)';

    setTimeout(function() {
        isSpinning = false;
        showWinResult(winItem);

        var liveTrack = document.getElementById('liveDrops');
        if (liveTrack) addLiveDropElement(liveTrack, true, winItem);
    }, (duration + 0.5) * 1000);
}

function showWinResult(item) {
    var rouletteSection = document.getElementById('rouletteSection');
    var actionsSection = document.getElementById('actionsSection');
    var contentsSection = document.getElementById('contentsSection');
    var winScreen = document.getElementById('winScreen');

    if (rouletteSection) rouletteSection.style.display = 'none';
    if (actionsSection) actionsSection.style.display = 'none';
    if (contentsSection) contentsSection.style.display = 'none';

    if (winScreen) {
        winScreen.classList.add('active');
        document.getElementById('winIcon').textContent = item.icon;
        document.getElementById('winRarity').textContent = getRarityName(item.rarity);
        document.getElementById('winRarity').style.color = getRarityColor(item.rarity);
        document.getElementById('winItemName').textContent = item.name;
        document.getElementById('winItemName').style.color = getRarityColor(item.rarity);
        document.getElementById('winItemValue').textContent = '💎 ' + formatNumber(item.value);
        document.getElementById('winGlowBg').style.background = getRarityColor(item.rarity);
    }

    if (['rare', 'epic', 'legendary', 'mythic'].indexOf(item.rarity) !== -1) {
        createConfetti();
    }

    showNotification('🎉', 'Вы выиграли: ' + item.name + '!');
}

function sellWinItem() {
    if (!currentWinItem) return;
    balance += currentWinItem.value;
    updateBalanceDisplay();
    saveState();
    showNotification('💰', 'Продано за ' + formatNumber(currentWinItem.value) + ' 💎');
    resetOpenPage();
}

function takeWinItem() {
    if (!currentWinItem) return;
    inventory.push({
        name: currentWinItem.name,
        icon: currentWinItem.icon,
        rarity: currentWinItem.rarity,
        chance: currentWinItem.chance,
        value: currentWinItem.value,
        id: Date.now() + Math.random(),
        date: new Date().toISOString()
    });
    saveState();
    showNotification('✅', currentWinItem.name + ' добавлен в инвентарь!');
    resetOpenPage();
}

function playAgain() {
    if (!currentWinItem) return;
    inventory.push({
        name: currentWinItem.name,
        icon: currentWinItem.icon,
        rarity: currentWinItem.rarity,
        chance: currentWinItem.chance,
        value: currentWinItem.value,
        id: Date.now() + Math.random(),
        date: new Date().toISOString()
    });
    saveState();
    resetOpenPage();
}

function resetOpenPage() {
    currentWinItem = null;

    var rouletteSection = document.getElementById('rouletteSection');
    var actionsSection = document.getElementById('actionsSection');
    var contentsSection = document.getElementById('contentsSection');
    var winScreen = document.getElementById('winScreen');

    if (winScreen) winScreen.classList.remove('active');
    if (rouletteSection) rouletteSection.style.display = 'block';
    if (actionsSection) actionsSection.style.display = 'flex';
    if (contentsSection) contentsSection.style.display = 'block';

    buildRoulette();

    var btnOpen = document.getElementById('btnOpenCase');
    var btnFast = document.getElementById('btnFastOpen');
    if (btnOpen) {
        btnOpen.disabled = false;
        btnOpen.innerHTML = '🎰 Открыть кейс <span class="price-tag">💎 ' + formatNumber(currentCase.price) + '</span>';
    }
    if (btnFast) btnFast.disabled = false;
}

// ============ INVENTORY PAGE (inventory.html) ============
function initInventoryPage() {
    renderInventory();
    updateInventoryStats();
}

function renderInventory(searchTerm, sortBy) {
    if (!searchTerm) searchTerm = '';
    if (!sortBy) sortBy = 'date';

    var grid = document.getElementById('inventoryGrid');
    if (!grid) return;

    var items = inventory.slice();

    if (searchTerm) {
        items = items.filter(function(item) {
            return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });
    }

    switch (sortBy) {
        case 'value-desc':
            items.sort(function(a, b) { return b.value - a.value; });
            break;
        case 'value-asc':
            items.sort(function(a, b) { return a.value - b.value; });
            break;
        case 'rarity':
            var rarityOrder = { mythic: 6, legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
            items.sort(function(a, b) { return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0); });
            break;
        case 'name':
            items.sort(function(a, b) { return a.name.localeCompare(b.name); });
            break;
        default:
            items.reverse();
    }

    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML =
            '<div class="inventory-empty">' +
                '<div class="inventory-empty-icon">📦</div>' +
                '<div class="inventory-empty-text">Инвентарь пуст</div>' +
                '<div class="inventory-empty-hint">' + (searchTerm ? 'Ничего не найдено' : 'Откройте кейсы, чтобы получить предметы') + '</div>' +
                (!searchTerm ? '<a href="index.html" class="btn-go-cases">📦 Перейти к кейсам</a>' : '') +
            '</div>';
        return;
    }

    items.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'inv-item';
        div.innerHTML =
            '<div class="inv-item-bar rarity-bg-' + item.rarity + '"></div>' +
            '<div class="inv-item-icon">' + item.icon + '</div>' +
            '<div class="inv-item-name rarity-' + item.rarity + '">' + item.name + '</div>' +
            '<div class="inv-item-rarity-tag rarity-' + item.rarity + '">' + getRarityName(item.rarity) + '</div>' +
            '<div class="inv-item-value">💎 ' + formatNumber(item.value) + '</div>' +
            '<div class="inv-item-actions">' +
                '<button class="inv-item-btn sell" onclick="event.stopPropagation(); sellInventoryItem(\'' + item.id + '\')">💰 Продать</button>' +
                '<button class="inv-item-btn use" onclick="event.stopPropagation(); useInventoryItem(\'' + item.id + '\')">✅ Забрать</button>' +
            '</div>';
        grid.appendChild(div);
    });
}

function sellInventoryItem(itemId) {
    var index = inventory.findIndex(function(i) { return String(i.id) === String(itemId); });
    if (index === -1) return;

    var item = inventory[index];
    balance += item.value;
    inventory.splice(index, 1);
    updateBalanceDisplay();
    saveState();
    renderInventory();
    updateInventoryStats();
    showNotification('💰', item.name + ' продан за ' + formatNumber(item.value) + ' 💎');
}

function useInventoryItem(itemId) {
    var index = inventory.findIndex(function(i) { return String(i.id) === String(itemId); });
    if (index === -1) return;

    var item = inventory[index];
    inventory.splice(index, 1);
    saveState();
    renderInventory();
    updateInventoryStats();
    showNotification('✅', item.name + ' использован!');
}

function sellAllInventory() {
    if (inventory.length === 0) return;
    if (!confirm('Продать все предметы (' + inventory.length + ' шт.)?')) return;

    var totalValue = 0;
    inventory.forEach(function(item) { totalValue += item.value; });
    balance += totalValue;
    inventory = [];
    updateBalanceDisplay();
    saveState();
    renderInventory();
    updateInventoryStats();
    showNotification('💰', 'Все предметы проданы за ' + formatNumber(totalValue) + ' 💎');
}

function updateInventoryStats() {
    var totalItems = document.getElementById('statTotalItems');
    var totalValue = document.getElementById('statTotalValue');
    var bestItem = document.getElementById('statBestItem');
    var totalCases = document.getElementById('statTotalCases');

    if (totalItems) totalItems.textContent = inventory.length;

    if (totalValue) {
        var val = 0;
        inventory.forEach(function(i) { val += i.value; });
        totalValue.textContent = formatNumber(val);
    }

    if (bestItem) {
        if (inventory.length > 0) {
            var best = inventory.reduce(function(a, b) { return a.value > b.value ? a : b; });
            bestItem.textContent = best.name;
        } else {
            bestItem.textContent = '—';
        }
    }

    if (totalCases) {
        totalCases.textContent = formatNumber(totalOpened);
    }
}

function searchInventory(value) {
    var sort = document.getElementById('invSort');
    renderInventory(value, sort ? sort.value : 'date');
}

function sortInventory(value) {
    var search = document.getElementById('invSearch');
    renderInventory(search ? search.value : '', value);
}

// ============ GLOBAL INIT ============
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    updateBalanceDisplay();
    updateAuthUI();
    initHeaderScroll();
    initLiveDrops();
    startLiveDropsInterval();

    var page = document.body.dataset.page;

    if (page === 'index') {
        renderCases();
        var totalEl = document.getElementById('totalOpened');
        if (totalEl) totalEl.textContent = formatNumber(totalOpened);
    }

    if (page === 'open') {
        initOpenPage();
    }

    if (page === 'inventory') {
        initInventoryPage();
    }

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeDeposit();
                closeAuthModal();
            }
        });
    });

    // Close user menu on outside click
    document.addEventListener('click', function(e) {
        var profile = document.getElementById('userProfile');
        var menu = document.getElementById('userMenu');
        if (profile && menu && !profile.contains(e.target)) {
            menu.classList.remove('open');
        }
    });

    // Keyboard
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDeposit();
            closeAuthModal();
            closeUserMenu();
        }
    });
});
