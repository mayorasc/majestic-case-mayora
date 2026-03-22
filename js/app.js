// ============================================================
//  MAJESTIC CASES — Main App (Profile + Bonuses + Promos)
// ============================================================

var balance = parseInt(localStorage.getItem('mj_balance')) || 10000;
var inventory = JSON.parse(localStorage.getItem('mj_inventory') || '[]');
var totalOpened = parseInt(localStorage.getItem('mj_totalOpened')) || 156847;
var currentCase = null;
var isSpinning = false;
var soundEnabled = true;
var currentWinItem = null;
var currentUser = JSON.parse(localStorage.getItem('mj_user') || 'null');

// Player stats
var playerStats = JSON.parse(localStorage.getItem('mj_playerStats') || 'null') || {
    totalSpent: 0,
    totalWon: 0,
    casesOpened: 0,
    bestDrop: null,
    bestDropValue: 0,
    rareDrops: 0,
    xp: 0,
    level: 1,
    dropHistory: [],
    usedPromos: [],
    claimedSocials: [],
    joinedDate: new Date().toISOString()
};

function savePlayerStats() { localStorage.setItem('mj_playerStats', JSON.stringify(playerStats)); }

// ============ ICON HELPERS ============
function isUrl(s) { return s && (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')); }
function iconHtml(icon, size) {
    if (!size) size = 48;
    if (isUrl(icon)) return '<img src="' + icon + '" style="width:' + size + 'px;height:' + size + 'px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'">';
    return icon;
}

// ============ LOAD CASES ============
function getCases() {
    var s = localStorage.getItem('mj_custom_cases');
    if (s) { try { return JSON.parse(s); } catch (e) { } }
    return getDefaultCases();
}

function getDefaultCases() {
    return [
        {id:1,name:"Стартовый кейс",description:"Идеальный для новичков.",price:500,icon:"📦",tag:"popular",badge:"",color:"rgba(59,130,246,0.3)",items:[{name:"Пистолет",icon:"🔫",rarity:"common",chance:30,value:200},{name:"Аптечка",icon:"💊",rarity:"common",chance:25,value:300},{name:"Бронежилет",icon:"🦺",rarity:"uncommon",chance:20,value:600},{name:"Рация",icon:"📻",rarity:"uncommon",chance:12,value:800},{name:"Телефон",icon:"📱",rarity:"rare",chance:8,value:1500},{name:"VIP 3 дня",icon:"⭐",rarity:"epic",chance:4,value:3000},{name:"Futo",icon:"🚗",rarity:"legendary",chance:1,value:10000}]},
        {id:2,name:"Автомобильный",description:"Шанс выиграть крутой автомобиль.",price:2000,icon:"🚗",tag:"popular",badge:"hot",color:"rgba(239,68,68,0.3)",items:[{name:"Blista",icon:"🚙",rarity:"common",chance:25,value:1000},{name:"Sultan",icon:"🚘",rarity:"common",chance:20,value:1500},{name:"Elegy",icon:"🏎️",rarity:"uncommon",chance:18,value:3000},{name:"Jester",icon:"🚕",rarity:"rare",chance:15,value:5000},{name:"Zentorno",icon:"🏎️",rarity:"rare",chance:10,value:8000},{name:"T20",icon:"🏁",rarity:"epic",chance:7,value:15000},{name:"Adder",icon:"💨",rarity:"legendary",chance:4,value:30000},{name:"Thrax",icon:"👑",rarity:"mythic",chance:1,value:100000}]},
        {id:3,name:"Оружейный",description:"Лучшее оружие для защиты.",price:1500,icon:"⚔️",tag:"popular",badge:"",color:"rgba(245,158,11,0.3)",items:[{name:"Нож",icon:"🔪",rarity:"common",chance:25,value:500},{name:"Пистолет",icon:"🔫",rarity:"common",chance:22,value:800},{name:"Дробовик",icon:"💥",rarity:"uncommon",chance:18,value:2000},{name:"SMG",icon:"🔫",rarity:"uncommon",chance:15,value:3000},{name:"Винтовка",icon:"🎯",rarity:"rare",chance:10,value:5000},{name:"Снайперка",icon:"🔭",rarity:"epic",chance:6,value:10000},{name:"RPG",icon:"🚀",rarity:"legendary",chance:3,value:25000},{name:"Миниган",icon:"⚡",rarity:"mythic",chance:1,value:50000}]},
        {id:4,name:"Бизнес кейс",description:"Шанс получить бизнес!",price:5000,icon:"🏢",tag:"premium",badge:"new",color:"rgba(124,58,237,0.3)",items:[{name:"Закусочная",icon:"🌮",rarity:"common",chance:25,value:3000},{name:"Автомойка",icon:"🚿",rarity:"uncommon",chance:20,value:5000},{name:"Заправка",icon:"⛽",rarity:"uncommon",chance:18,value:8000},{name:"Магазин",icon:"🏪",rarity:"rare",chance:15,value:12000},{name:"Автосалон",icon:"🏬",rarity:"rare",chance:10,value:20000},{name:"Клуб",icon:"🎵",rarity:"epic",chance:7,value:35000},{name:"Казино",icon:"🎰",rarity:"legendary",chance:4,value:75000},{name:"Небоскрёб",icon:"🏙️",rarity:"mythic",chance:1,value:200000}]},
        {id:5,name:"VIP Кейс",description:"Премиум привилегии.",price:3000,icon:"👑",tag:"premium",badge:"hot",color:"rgba(245,158,11,0.3)",items:[{name:"VIP 1 день",icon:"⭐",rarity:"common",chance:25,value:1500},{name:"VIP 3 дня",icon:"⭐",rarity:"common",chance:20,value:3000},{name:"VIP 7 дней",icon:"🌟",rarity:"uncommon",chance:18,value:6000},{name:"VIP 14 дней",icon:"🌟",rarity:"rare",chance:15,value:10000},{name:"VIP 30 дней",icon:"💫",rarity:"rare",chance:10,value:18000},{name:"Premium 30д",icon:"💎",rarity:"epic",chance:7,value:30000},{name:"Diamond 30д",icon:"💠",rarity:"legendary",chance:4,value:50000},{name:"Diamond 90д",icon:"👑",rarity:"mythic",chance:1,value:150000}]},
        {id:6,name:"Донат кейс",description:"Донат валюта и предметы.",price:1000,icon:"💰",tag:"new",badge:"new",color:"rgba(16,185,129,0.3)",items:[{name:"500 коинов",icon:"🪙",rarity:"common",chance:28,value:500},{name:"1000 коинов",icon:"🪙",rarity:"common",chance:22,value:1000},{name:"2500 коинов",icon:"💰",rarity:"uncommon",chance:18,value:2500},{name:"5000 коинов",icon:"💰",rarity:"rare",chance:14,value:5000},{name:"10000 коинов",icon:"💎",rarity:"rare",chance:9,value:10000},{name:"25000 коинов",icon:"💎",rarity:"epic",chance:5,value:25000},{name:"50000 коинов",icon:"👑",rarity:"legendary",chance:3,value:50000},{name:"100000 коинов",icon:"🏆",rarity:"mythic",chance:1,value:100000}]},
        {id:7,name:"Недвижимость",description:"Дома и особняки.",price:8000,icon:"🏠",tag:"premium",badge:"",color:"rgba(236,72,153,0.3)",items:[{name:"Трейлер",icon:"🏕️",rarity:"common",chance:25,value:4000},{name:"Квартира",icon:"🏢",rarity:"uncommon",chance:22,value:8000},{name:"Дом",icon:"🏠",rarity:"uncommon",chance:18,value:15000},{name:"Коттедж",icon:"🏡",rarity:"rare",chance:14,value:25000},{name:"Пентхаус",icon:"🌆",rarity:"rare",chance:10,value:40000},{name:"Вилла",icon:"🏖️",rarity:"epic",chance:6,value:80000},{name:"Особняк",icon:"🏰",rarity:"legendary",chance:4,value:150000},{name:"Остров",icon:"🏝️",rarity:"mythic",chance:1,value:500000}]},
        {id:8,name:"Мото кейс",description:"Мотоциклы всех видов.",price:1200,icon:"🏍️",tag:"new",badge:"new",color:"rgba(99,102,241,0.3)",items:[{name:"Faggio",icon:"🛵",rarity:"common",chance:28,value:500},{name:"Sanchez",icon:"🏍️",rarity:"common",chance:22,value:1000},{name:"PCJ-600",icon:"🏍️",rarity:"uncommon",chance:18,value:2000},{name:"Bati 801",icon:"🏍️",rarity:"uncommon",chance:14,value:3500},{name:"Hakuchou",icon:"🏍️",rarity:"rare",chance:9,value:6000},{name:"Shotaro",icon:"⚡",rarity:"epic",chance:5,value:12000},{name:"Deathbike",icon:"💀",rarity:"legendary",chance:3,value:25000},{name:"Oppressor",icon:"🚀",rarity:"mythic",chance:1,value:80000}]},
        {id:9,name:"Люкс кейс",description:"Самые дорогие предметы.",price:15000,icon:"💎",tag:"premium",badge:"hot",color:"rgba(168,85,247,0.4)",items:[{name:"Zentorno",icon:"🏎️",rarity:"common",chance:22,value:8000},{name:"T20",icon:"🏁",rarity:"uncommon",chance:20,value:15000},{name:"Пентхаус",icon:"🌆",rarity:"uncommon",chance:18,value:25000},{name:"Казино",icon:"🎰",rarity:"rare",chance:14,value:50000},{name:"Diamond VIP",icon:"💠",rarity:"rare",chance:10,value:75000},{name:"Яхта",icon:"🛥️",rarity:"epic",chance:8,value:120000},{name:"Особняк",icon:"🏰",rarity:"legendary",chance:5,value:250000},{name:"Мега-приз",icon:"🏆",rarity:"mythic",chance:3,value:1000000}]}
    ];
}

// ============ PROMOS & SOCIALS DATA ============
function getPromos() {
    var s = localStorage.getItem('mj_promos');
    if (s) { try { return JSON.parse(s); } catch (e) { } }
    return [
        { code: 'WELCOME', bonus: 5000, maxUses: 1000, usedCount: 0, active: true },
        { code: 'BONUS2024', bonus: 10000, maxUses: 500, usedCount: 0, active: true },
        { code: 'VIP', bonus: 25000, maxUses: 100, usedCount: 0, active: true }
    ];
}
function savePromos(promos) { localStorage.setItem('mj_promos', JSON.stringify(promos)); }

function getSocialBonuses() {
    var s = localStorage.getItem('mj_social_bonuses');
    if (s) { try { return JSON.parse(s); } catch (e) { } }
    return [
        { id: 'tg', name: 'Telegram', icon: '📱', url: 'https://t.me/majestic_cases', bonus: 2000 },
        { id: 'yt', name: 'YouTube', icon: '🎬', url: 'https://youtube.com/@majestic_cases', bonus: 3000 },
        { id: 'vk', name: 'ВКонтакте', icon: '💙', url: 'https://vk.com/majestic_cases', bonus: 1500 },
        { id: 'ds', name: 'Discord', icon: '🎮', url: 'https://discord.gg/majestic', bonus: 2500 }
    ];
}
function saveSocialBonuses(sb) { localStorage.setItem('mj_social_bonuses', JSON.stringify(sb)); }

// ============ UTILITY ============
function getRarityColor(r) { var c = { common: '#9ca3af', uncommon: '#10b981', rare: '#3b82f6', epic: '#8b5cf6', legendary: '#f59e0b', mythic: '#ef4444' }; return c[r] || '#9ca3af'; }
function getRarityName(r) { var n = { common: 'Обычный', uncommon: 'Необычный', rare: 'Редкий', epic: 'Эпический', legendary: 'Легендарный', mythic: 'Мифический' }; return n[r] || 'Обычный'; }
function getRarityOrder(r) { var o = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6 }; return o[r] || 0; }
function getRandomItem(c) { var rand = Math.random() * 100, cum = 0; for (var i = 0; i < c.items.length; i++) { cum += c.items[i].chance; if (rand <= cum) return Object.assign({}, c.items[i]); } return Object.assign({}, c.items[0]); }
function saveState() { localStorage.setItem('mj_balance', balance.toString()); localStorage.setItem('mj_inventory', JSON.stringify(inventory)); localStorage.setItem('mj_totalOpened', totalOpened.toString()); }
function formatNumber(n) { return n.toLocaleString('ru-RU'); }
function updateBalanceDisplay() { document.querySelectorAll('.balance-amount').forEach(function (el) { el.textContent = formatNumber(balance); }); }

// ============ LEVEL SYSTEM ============
function getXpForLevel(lvl) { return Math.floor(100 * Math.pow(1.5, lvl - 1)); }
function addXp(amount) {
    playerStats.xp += amount;
    var needed = getXpForLevel(playerStats.level);
    while (playerStats.xp >= needed) {
        playerStats.xp -= needed;
        playerStats.level++;
        needed = getXpForLevel(playerStats.level);
        showNotification('🎉', 'Уровень повышен! Теперь вы ' + playerStats.level + ' уровня!');
    }
    savePlayerStats();
}

// ============ AUTH ============
function openAuthModal() { var m = document.getElementById('authModal'); if (m) m.classList.add('active'); }
function closeAuthModal() { var m = document.getElementById('authModal'); if (m) m.classList.remove('active'); }
function switchAuthTab(tab, btn) {
    document.querySelectorAll('.auth-tab').forEach(function (t) { t.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('authLoginForm').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('authRegisterForm').style.display = tab === 'register' ? 'block' : 'none';
}
function registerUser() {
    var username = document.getElementById('regUsername').value.trim();
    var displayName = document.getElementById('regDisplayName').value.trim();
    var pass = document.getElementById('regPassword').value;
    var pass2 = document.getElementById('regPassword2').value;
    if (!username || !displayName) { showNotification('❌', 'Заполните все поля'); return; }
    if (pass.length < 4) { showNotification('❌', 'Пароль минимум 4 символа'); return; }
    if (pass !== pass2) { showNotification('❌', 'Пароли не совпадают'); return; }
    var users = JSON.parse(localStorage.getItem('mj_users') || '{}');
    if (users[username]) { showNotification('❌', 'Пользователь уже существует'); return; }
    users[username] = { password: pass, displayName: displayName, avatarUrl: '', joinedDate: new Date().toISOString() };
    localStorage.setItem('mj_users', JSON.stringify(users));
    currentUser = { username: username, displayName: displayName, avatarUrl: '', joinedDate: users[username].joinedDate };
    localStorage.setItem('mj_user', JSON.stringify(currentUser));
    playerStats.joinedDate = currentUser.joinedDate;
    savePlayerStats();
    updateAuthUI(); closeAuthModal();
    showNotification('✅', 'Добро пожаловать, ' + displayName + '!');
}
function loginUser() {
    var username = document.getElementById('loginUsername').value.trim();
    var pass = document.getElementById('loginPassword').value;
    if (!username || !pass) { showNotification('❌', 'Заполните все поля'); return; }
    var users = JSON.parse(localStorage.getItem('mj_users') || '{}');
    if (!users[username] || users[username].password !== pass) { showNotification('❌', 'Неверный логин или пароль'); return; }
    currentUser = { username: username, displayName: users[username].displayName, avatarUrl: users[username].avatarUrl || '', joinedDate: users[username].joinedDate };
    localStorage.setItem('mj_user', JSON.stringify(currentUser));
    updateAuthUI(); closeAuthModal();
    showNotification('✅', 'С возвращением, ' + currentUser.displayName + '!');
}
function logoutUser() { currentUser = null; localStorage.removeItem('mj_user'); updateAuthUI(); closeUserMenu(); showNotification('👋', 'Вы вышли из аккаунта'); }
function updateAuthUI() {
    var btnLogin = document.getElementById('btnLogin'), userProfile = document.getElementById('userProfile');
    if (currentUser) {
        if (btnLogin) btnLogin.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            var ai = document.getElementById('userAvatarImg'), af = document.getElementById('userAvatarFallback'), un = document.getElementById('userName');
            if (currentUser.avatarUrl && ai) { ai.src = currentUser.avatarUrl; ai.classList.add('loaded'); }
            else if (ai) { ai.classList.remove('loaded'); }
            if (af) af.textContent = (currentUser.displayName || 'U').charAt(0).toUpperCase();
            if (un) un.textContent = currentUser.displayName || 'User';
            var mn = document.getElementById('menuName'); if (mn) mn.textContent = currentUser.displayName;
            var mu = document.getElementById('menuUsername'); if (mu) mu.textContent = '@' + currentUser.username;
        }
    } else {
        if (btnLogin) btnLogin.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
}
function toggleUserMenu() { var m = document.getElementById('userMenu'); if (m) m.classList.toggle('open'); }
function closeUserMenu() { var m = document.getElementById('userMenu'); if (m) m.classList.remove('open'); }

// ============ PARTICLES ============
function createParticles() { var c = document.getElementById('particles'); if (!c) return; for (var i = 0; i < 30; i++) { var p = document.createElement('div'); p.className = 'particle'; p.style.left = Math.random() * 100 + '%'; p.style.animationDuration = (Math.random() * 10 + 10) + 's'; p.style.animationDelay = (Math.random() * 10) + 's'; p.style.width = (Math.random() * 3 + 1) + 'px'; p.style.height = p.style.width; c.appendChild(p); } }

// ============ NOTIFICATION ============
function showNotification(icon, text) { var n = document.getElementById('notification'); if (!n) return; document.getElementById('notifIcon').textContent = icon; document.getElementById('notifText').textContent = text; n.classList.add('show'); setTimeout(function () { n.classList.remove('show'); }, 3500); }

// ============ CONFETTI ============
function createConfetti() { var c = document.getElementById('confettiContainer'); if (!c) return; c.innerHTML = ''; var colors = ['#7c3aed', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899']; for (var i = 0; i < 100; i++) { var p = document.createElement('div'); p.className = 'confetti-piece'; p.style.left = Math.random() * 100 + '%'; p.style.background = colors[Math.floor(Math.random() * colors.length)]; p.style.animationDuration = (Math.random() * 2 + 1.5) + 's'; p.style.animationDelay = (Math.random() * 0.8) + 's'; p.style.width = (Math.random() * 10 + 4) + 'px'; p.style.height = (Math.random() * 10 + 4) + 'px'; p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'; c.appendChild(p); } setTimeout(function () { c.innerHTML = ''; }, 4500); }

// ============ HEADER ============
function initHeaderScroll() { window.addEventListener('scroll', function () { var h = document.getElementById('header'); if (h) h.classList.toggle('scrolled', window.scrollY > 50); }); }
function toggleMobileNav() { var n = document.querySelector('.nav'); if (n) n.classList.toggle('mobile-open'); }
function toggleSound() { soundEnabled = !soundEnabled; var el = document.getElementById('soundToggle'); if (el) el.textContent = soundEnabled ? '🔊' : '🔇'; }

// ============ DEPOSIT ============
function openDeposit() { var m = document.getElementById('depositModal'); if (m) m.classList.add('active'); }
function closeDeposit() { var m = document.getElementById('depositModal'); if (m) m.classList.remove('active'); }
function setDepositAmount(a) { var i = document.getElementById('depositInput'); if (i) i.value = a; }
function confirmDeposit() { var i = document.getElementById('depositInput'); var a = parseInt(i ? i.value : 0); if (a > 0) { balance += a; updateBalanceDisplay(); saveState(); showNotification('✅', 'Баланс пополнен на ' + formatNumber(a) + ' 💎'); closeDeposit(); } }

// ============ LIVE DROPS ============
function initLiveDrops() {
    var track = document.getElementById('liveDropsTrack'); if (!track) return;
    var allCases = getCases();
    var fakeNames = ['Alex_Pro', 'NightRider', 'GTA_King', 'Majestic_VIP', 'DarkSoul', 'SpeedDemon', 'CityBoss', 'ProGamer', 'Lucky_One', 'DiamondHand', 'Shadow_X', 'Neon_Wolf', 'Cyber_Punk', 'Gold_Rush', 'Star_Player', 'Thunder', 'Ice_Cold', 'Fire_Fox', 'Moon_Light', 'Sun_Rise'];
    var drops = [];
    for (var i = 0; i < 30; i++) { var c = allCases[Math.floor(Math.random() * allCases.length)]; var item = getRandomItem(c); drops.push({ item: item, user: fakeNames[Math.floor(Math.random() * fakeNames.length)], caseName: c.name }); }
    var html = '';
    for (var j = 0; j < 2; j++) { drops.forEach(function (d) { html += '<div class="live-drop-card"><div class="live-drop-icon">' + iconHtml(d.item.icon, 28) + '</div><div class="live-drop-info"><div class="live-drop-name rarity-' + d.item.rarity + '">' + d.item.name + '</div><div class="live-drop-user">' + d.user + '</div><div class="live-drop-value">💎 ' + formatNumber(d.item.value) + '</div></div></div>'; }); }
    track.innerHTML = html;
}

// ============ RENDER CASES ============
function renderCases(filter) {
    if (!filter) filter = 'all';
    var grid = document.getElementById('casesGrid'); if (!grid) return; grid.innerHTML = '';
    var allCases = getCases();
    var filtered = filter === 'all' ? allCases : allCases.filter(function (c) { return c.tag === filter; });
    filtered.forEach(function (c) {
        var card = document.createElement('div'); card.className = 'case-card'; card.style.setProperty('--card-color', c.color);
        var badge = '';
        if (c.badge === 'hot') badge = '<div class="case-card-badge hot">🔥 HOT</div>';
        if (c.badge === 'new') badge = '<div class="case-card-badge new">✨ NEW</div>';
        var dots = c.items.map(function (it) { return '<div class="item-dot rarity-bg-' + it.rarity + '"></div>'; }).join('');
        card.innerHTML = badge + '<div class="case-image"><div class="case-glow"></div><div class="case-icon">' + iconHtml(c.icon, 64) + '</div></div><div class="case-name">' + c.name + '</div><div class="case-description">' + c.description + '</div><div class="case-items-preview">' + dots + '</div><div class="case-footer"><div class="case-price"><span class="case-price-icon">💎</span><span class="case-price-amount">' + formatNumber(c.price) + '</span></div><button class="case-open-btn" onclick="event.stopPropagation();goToCase(' + c.id + ')">Открыть</button></div>';
        card.onclick = function () { goToCase(c.id); };
        grid.appendChild(card);
    });
}
function filterCases(f, btn) { document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); }); btn.classList.add('active'); renderCases(f); }
function goToCase(id) { window.location.href = 'open.html?id=' + id; }

// ============ OPEN PAGE ============
function initOpenPage() {
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'));
    var allCases = getCases();
    currentCase = allCases.find(function (c) { return c.id === id; });
    if (!currentCase) { window.location.href = 'index.html'; return; }
    var iconEl = document.getElementById('openCaseIcon'); if (iconEl) iconEl.innerHTML = iconHtml(currentCase.icon, 64);
    var titleEl = document.getElementById('openCaseTitle'); if (titleEl) titleEl.textContent = currentCase.name;
    var descEl = document.getElementById('openCaseDesc'); if (descEl) descEl.textContent = currentCase.description;
    var priceEl = document.getElementById('openCasePrice'); if (priceEl) priceEl.textContent = '💎 ' + formatNumber(currentCase.price);
    var btnPrice = document.getElementById('btnOpenCase');
    if (btnPrice) btnPrice.innerHTML = '🎰 Открыть кейс <span class="price-tag">💎 ' + formatNumber(currentCase.price) + '</span>';
    renderCaseContents(); buildRoulette();
}

function renderCaseContents() {
    var grid = document.getElementById('caseContentsGrid'); if (!grid || !currentCase) return; grid.innerHTML = '';
    var rarities = ['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
    var grouped = {};
    currentCase.items.forEach(function (item) { if (!grouped[item.rarity]) grouped[item.rarity] = []; grouped[item.rarity].push(item); });
    rarities.forEach(function (rarity) {
        if (!grouped[rarity] || grouped[rarity].length === 0) return;
        var section = document.createElement('div'); section.className = 'content-rarity-section';
        var header = document.createElement('div'); header.className = 'content-rarity-header';
        header.innerHTML = '<span class="content-rarity-dot rarity-bg-' + rarity + '"></span><span class="content-rarity-label">' + getRarityName(rarity) + '</span><span class="content-rarity-count">' + grouped[rarity].length + ' шт.</span>';
        section.appendChild(header);
        var wrap = document.createElement('div'); wrap.className = 'content-rarity-items';
        grouped[rarity].forEach(function (item) {
            var div = document.createElement('div'); div.className = 'content-item';
            div.innerHTML = '<div class="content-item-icon">' + iconHtml(item.icon, 36) + '</div><div class="content-item-name rarity-' + item.rarity + '">' + item.name + '</div><div class="content-item-chance">' + item.chance + '%</div><div class="content-item-value">💎 ' + formatNumber(item.value) + '</div><div class="content-item-bar rarity-bg-' + item.rarity + '"></div>';
            wrap.appendChild(div);
        });
        section.appendChild(wrap); grid.appendChild(section);
    });
}

function buildRoulette() {
    var track = document.getElementById('rouletteTrack'); if (!track || !currentCase) return;
    track.innerHTML = ''; track.style.transition = 'none'; track.style.transform = 'translateX(0)';
    for (var i = 0; i < 70; i++) {
        var item = getRandomItem(currentCase);
        var div = document.createElement('div'); div.className = 'roulette-item';
        div.innerHTML = '<div class="roulette-item-icon">' + iconHtml(item.icon, 40) + '</div><div class="roulette-item-name rarity-' + item.rarity + '">' + item.name + '</div><div class="roulette-item-rarity rarity-bg-' + item.rarity + '"></div>';
        track.appendChild(div);
    }
}

function spinRoulette(fast) {
    if (isSpinning || !currentCase) return;
    if (balance < currentCase.price) { showNotification('❌', 'Недостаточно средств!'); return; }
    isSpinning = true; balance -= currentCase.price; totalOpened++;
    playerStats.totalSpent += currentCase.price;
    playerStats.casesOpened++;
    updateBalanceDisplay(); saveState();
    var btnOpen = document.getElementById('btnOpenCase'), btnFast = document.getElementById('btnFastOpen');
    if (btnOpen) { btnOpen.disabled = true; btnOpen.innerHTML = '🎰 Крутим...'; }
    if (btnFast) btnFast.disabled = true;
    var winItem = getRandomItem(currentCase); currentWinItem = winItem;
    var track = document.getElementById('rouletteTrack'); var items = track.children; var winIndex = 50;
    items[winIndex].querySelector('.roulette-item-icon').innerHTML = iconHtml(winItem.icon, 40);
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
    var easing = fast ? 'cubic-bezier(0.25,0.8,0.25,1)' : 'cubic-bezier(0.15,0.85,0.25,1)';
    track.style.transition = 'transform ' + duration + 's ' + easing;
    track.style.transform = 'translateX(' + distance + 'px)';
    setTimeout(function () { isSpinning = false; showWinResult(winItem); }, (duration + 0.5) * 1000);
}

function showWinResult(item) {
    // Track stats
    playerStats.totalWon += item.value;
    if (item.value > playerStats.bestDropValue) { playerStats.bestDrop = item.name; playerStats.bestDropValue = item.value; }
    if (['rare', 'epic', 'legendary', 'mythic'].indexOf(item.rarity) !== -1) playerStats.rareDrops++;
    playerStats.dropHistory.unshift({ name: item.name, icon: item.icon, rarity: item.rarity, value: item.value, caseName: currentCase ? currentCase.name : '?', date: new Date().toISOString() });
    if (playerStats.dropHistory.length > 50) playerStats.dropHistory = playerStats.dropHistory.slice(0, 50);
    addXp(Math.floor(item.value / 10));
    savePlayerStats();

    var rs = document.getElementById('rouletteSection'), as = document.getElementById('actionsSection'), cs = document.getElementById('contentsSection'), ws = document.getElementById('winScreen');
    if (rs) rs.style.display = 'none'; if (as) as.style.display = 'none'; if (cs) cs.style.display = 'none';
    if (ws) {
        ws.classList.add('active');
        document.getElementById('winIcon').innerHTML = iconHtml(item.icon, 80);
        document.getElementById('winRarity').textContent = getRarityName(item.rarity);
        document.getElementById('winRarity').style.color = getRarityColor(item.rarity);
        document.getElementById('winItemName').textContent = item.name;
        document.getElementById('winItemName').style.color = getRarityColor(item.rarity);
        document.getElementById('winItemValue').textContent = '💎 ' + formatNumber(item.value);
        document.getElementById('winGlowBg').style.background = getRarityColor(item.rarity);
    }
    if (['rare', 'epic', 'legendary', 'mythic'].indexOf(item.rarity) !== -1) createConfetti();
    showNotification('🎉', 'Вы выиграли: ' + item.name + '!');
}

function sellWinItem() { if (!currentWinItem) return; balance += currentWinItem.value; updateBalanceDisplay(); saveState(); showNotification('💰', 'Продано за ' + formatNumber(currentWinItem.value) + ' 💎'); resetOpenPage(); }
function takeWinItem() { if (!currentWinItem) return; inventory.push({ name: currentWinItem.name, icon: currentWinItem.icon, rarity: currentWinItem.rarity, chance: currentWinItem.chance, value: currentWinItem.value, id: Date.now() + Math.random(), date: new Date().toISOString() }); saveState(); showNotification('✅', currentWinItem.name + ' добавлен в инвентарь!'); resetOpenPage(); }
function playAgain() { if (!currentWinItem) return; inventory.push({ name: currentWinItem.name, icon: currentWinItem.icon, rarity: currentWinItem.rarity, chance: currentWinItem.chance, value: currentWinItem.value, id: Date.now() + Math.random(), date: new Date().toISOString() }); saveState(); resetOpenPage(); }

function resetOpenPage() {
    currentWinItem = null;
    var rs = document.getElementById('rouletteSection'), as = document.getElementById('actionsSection'), cs = document.getElementById('contentsSection'), ws = document.getElementById('winScreen');
    if (ws) ws.classList.remove('active'); if (rs) rs.style.display = 'block'; if (as) as.style.display = 'flex'; if (cs) cs.style.display = 'block';
    buildRoulette();
    var btnOpen = document.getElementById('btnOpenCase'), btnFast = document.getElementById('btnFastOpen');
    if (btnOpen) { btnOpen.disabled = false; btnOpen.innerHTML = '🎰 Открыть кейс <span class="price-tag">💎 ' + formatNumber(currentCase.price) + '</span>'; }
    if (btnFast) btnFast.disabled = false;
}

// ============ INVENTORY ============
function initInventoryPage() { renderInventory(); updateInventoryStats(); }
function renderInventory(searchTerm, sortBy) {
    if (!searchTerm) searchTerm = ''; if (!sortBy) sortBy = 'date';
    var grid = document.getElementById('inventoryGrid'); if (!grid) return;
    var items = inventory.slice();
    if (searchTerm) items = items.filter(function (it) { return it.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1; });
    switch (sortBy) { case 'value-desc': items.sort(function (a, b) { return b.value - a.value; }); break; case 'value-asc': items.sort(function (a, b) { return a.value - b.value; }); break; case 'rarity': items.sort(function (a, b) { return getRarityOrder(b.rarity) - getRarityOrder(a.rarity); }); break; case 'name': items.sort(function (a, b) { return a.name.localeCompare(b.name); }); break; default: items.reverse(); }
    grid.innerHTML = '';
    if (items.length === 0) { grid.innerHTML = '<div class="inventory-empty"><div class="inventory-empty-icon">📦</div><div class="inventory-empty-text">Инвентарь пуст</div><div class="inventory-empty-hint">' + (searchTerm ? 'Ничего не найдено' : 'Откройте кейсы, чтобы получить предметы') + '</div>' + (!searchTerm ? '<a href="index.html" class="btn-go-cases">📦 Перейти к кейсам</a>' : '') + '</div>'; return; }
    items.forEach(function (item) {
        var itemId = String(item.id); var div = document.createElement('div'); div.className = 'inv-item';
        div.innerHTML = '<div class="inv-item-bar rarity-bg-' + item.rarity + '"></div><div class="inv-item-icon">' + iconHtml(item.icon, 36) + '</div><div class="inv-item-name rarity-' + item.rarity + '">' + item.name + '</div><div class="inv-item-rarity-tag rarity-' + item.rarity + '">' + getRarityName(item.rarity) + '</div><div class="inv-item-value">💎 ' + formatNumber(item.value) + '</div><div class="inv-item-actions"><button class="inv-item-btn sell" data-sell-id="' + itemId + '">💰 Продать</button><button class="inv-item-btn use" data-use-id="' + itemId + '">✅ Забрать</button></div>';
        grid.appendChild(div);
    });
    grid.querySelectorAll('[data-sell-id]').forEach(function (btn) { btn.addEventListener('click', function (e) { e.stopPropagation(); sellInventoryItem(this.getAttribute('data-sell-id')); }); });
    grid.querySelectorAll('[data-use-id]').forEach(function (btn) { btn.addEventListener('click', function (e) { e.stopPropagation(); useInventoryItem(this.getAttribute('data-use-id')); }); });
}
function sellInventoryItem(itemId) {
    var index = -1; for (var i = 0; i < inventory.length; i++) { if (String(inventory[i].id) === String(itemId)) { index = i; break; } }
    if (index === -1) return; var item = inventory[index]; balance += item.value; inventory.splice(index, 1);
    updateBalanceDisplay(); saveState(); renderInventory(); updateInventoryStats();
    showNotification('💰', item.name + ' продан за ' + formatNumber(item.value) + ' 💎');
}
function useInventoryItem(itemId) {
    var index = -1; for (var i = 0; i < inventory.length; i++) { if (String(inventory[i].id) === String(itemId)) { index = i; break; } }
    if (index === -1) return; var item = inventory[index]; inventory.splice(index, 1);
    saveState(); renderInventory(); updateInventoryStats();
    showNotification('✅', item.name + ' использован!');
}
function sellAllInventory() {
    if (!inventory || inventory.length === 0) { showNotification('❌', 'Инвентарь пуст'); return; }
    var count = inventory.length, totalValue = 0; for (var i = 0; i < inventory.length; i++) totalValue += inventory[i].value;
    if (!confirm('Продать все предметы (' + count + ' шт.) за ' + formatNumber(totalValue) + ' 💎?')) return;
    balance += totalValue; inventory = []; updateBalanceDisplay(); saveState(); renderInventory(); updateInventoryStats();
    showNotification('💰', 'Все предметы проданы за ' + formatNumber(totalValue) + ' 💎');
}
function updateInventoryStats() {
    var el1 = document.getElementById('statTotalItems'), el2 = document.getElementById('statTotalValue'), el3 = document.getElementById('statBestItem'), el4 = document.getElementById('statTotalCases');
    if (el1) el1.textContent = inventory.length;
    if (el2) { var v = 0; for (var i = 0; i < inventory.length; i++) v += inventory[i].value; el2.textContent = formatNumber(v); }
    if (el3) { if (inventory.length > 0) { var best = inventory[0]; for (var i = 1; i < inventory.length; i++) if (inventory[i].value > best.value) best = inventory[i]; el3.textContent = best.name; } else el3.textContent = '—'; }
    if (el4) el4.textContent = formatNumber(totalOpened);
}
function searchInventory(v) { var s = document.getElementById('invSort'); renderInventory(v, s ? s.value : 'date'); }
function sortInventory(v) { var s = document.getElementById('invSearch'); renderInventory(s ? s.value : '', v); }

// ============ PROFILE PAGE ============
function initProfilePage() {
    // Profile card
    var dn = document.getElementById('profileDisplayName');
    var un = document.getElementById('profileUsername');
    var jd = document.getElementById('profileJoined');
    var al = document.getElementById('profileAvatarLetter');
    var av = document.getElementById('profileAvatar');
    if (currentUser) {
        if (dn) dn.textContent = currentUser.displayName || 'Игрок';
        if (un) un.textContent = '@' + currentUser.username;
        if (al) al.textContent = (currentUser.displayName || 'U').charAt(0).toUpperCase();
        if (currentUser.avatarUrl && av) { av.innerHTML = '<img src="' + currentUser.avatarUrl + '" onerror="this.style.display=\'none\'">'; }
        if (jd) { var d = new Date(currentUser.joinedDate || playerStats.joinedDate); jd.textContent = 'Зарегистрирован: ' + d.toLocaleDateString('ru-RU'); }
        var sdn = document.getElementById('settingDisplayName'); if (sdn) sdn.value = currentUser.displayName || '';
        var sau = document.getElementById('settingAvatarUrl'); if (sau) sau.value = currentUser.avatarUrl || '';
    } else {
        if (dn) dn.textContent = 'Гость';
        if (un) un.textContent = 'Войдите для сохранения прогресса';
        if (jd) jd.textContent = '';
    }

    // Quick stats
    var pqb = document.getElementById('pqBalance'); if (pqb) pqb.textContent = formatNumber(balance);
    var pqc = document.getElementById('pqCases'); if (pqc) pqc.textContent = formatNumber(playerStats.casesOpened);
    var pqi = document.getElementById('pqItems'); if (pqi) pqi.textContent = inventory.length;
    var pqbe = document.getElementById('pqBest'); if (pqbe) pqbe.textContent = playerStats.bestDrop || '—';

    // Level
    var lvl = document.getElementById('lvlCurrent'); if (lvl) lvl.textContent = playerStats.level;
    var plvl = document.getElementById('profileLevel'); if (plvl) plvl.textContent = playerStats.level;
    var needed = getXpForLevel(playerStats.level);
    var pct = Math.min((playerStats.xp / needed) * 100, 100);
    var bar = document.getElementById('lvlBarFill'); if (bar) bar.style.width = pct + '%';
    var xpt = document.getElementById('lvlXpText'); if (xpt) xpt.textContent = playerStats.xp + ' / ' + needed + ' XP';

    // Detail stats
    var ds1 = document.getElementById('dsCasesOpened'); if (ds1) ds1.textContent = formatNumber(playerStats.casesOpened);
    var ds2 = document.getElementById('dsTotalSpent'); if (ds2) ds2.textContent = formatNumber(playerStats.totalSpent);
    var ds3 = document.getElementById('dsTotalWon'); if (ds3) ds3.textContent = formatNumber(playerStats.totalWon);
    var ds4 = document.getElementById('dsProfit'); if (ds4) { var profit = playerStats.totalWon - playerStats.totalSpent; ds4.textContent = (profit >= 0 ? '+' : '') + formatNumber(profit); ds4.style.color = profit >= 0 ? '#10b981' : '#ef4444'; }
    var ds5 = document.getElementById('dsBestDrop'); if (ds5) ds5.textContent = playerStats.bestDrop || '—';
    var ds6 = document.getElementById('dsRareDrop'); if (ds6) ds6.textContent = playerStats.rareDrops;

    // Drop history
    renderDropHistory();
    // Promo history
    renderPromoHistory();
    // Social bonuses
    renderSocialBonuses();
}

function renderDropHistory() {
    var container = document.getElementById('dropHistory'); if (!container) return;
    if (!playerStats.dropHistory || playerStats.dropHistory.length === 0) {
        container.innerHTML = '<div class="drop-history-empty">📦 Пока нет дропов. Откройте кейс!</div>'; return;
    }
    var html = '';
    playerStats.dropHistory.slice(0, 20).forEach(function (d) {
        var date = new Date(d.date);
        html += '<div class="drop-history-item"><div class="drop-history-icon">' + iconHtml(d.icon, 24) + '</div><div class="drop-history-info"><div class="drop-history-name rarity-' + d.rarity + '">' + d.name + '</div><div class="drop-history-case">из ' + d.caseName + '</div></div><div class="drop-history-value">💎 ' + formatNumber(d.value) + '</div><div class="drop-history-date">' + date.toLocaleDateString('ru-RU') + '</div></div>';
    });
    container.innerHTML = html;
}

function renderPromoHistory() {
    var container = document.getElementById('promoHistory'); if (!container) return;
    if (!playerStats.usedPromos || playerStats.usedPromos.length === 0) {
        container.innerHTML = '<div style="color:#64748b;font-size:13px;padding:8px 0;">Вы ещё не использовали промокоды</div>'; return;
    }
    var html = '';
    playerStats.usedPromos.forEach(function (p) {
        var date = new Date(p.date);
        html += '<div class="promo-history-item"><span class="promo-history-code">' + p.code + '</span><span class="promo-history-bonus">+' + formatNumber(p.bonus) + ' 💎</span><span class="promo-history-date">' + date.toLocaleDateString('ru-RU') + '</span></div>';
    });
    container.innerHTML = html;
}

function activatePromo() {
    var input = document.getElementById('promoInput'); if (!input) return;
    var code = input.value.trim().toUpperCase();
    if (!code) { showNotification('❌', 'Введите промокод'); return; }
    // Check if already used
    var alreadyUsed = playerStats.usedPromos.some(function (p) { return p.code === code; });
    if (alreadyUsed) { showNotification('❌', 'Вы уже использовали этот промокод'); return; }
    var promos = getPromos();
    var promo = promos.find(function (p) { return p.code === code && p.active; });
    if (!promo) { showNotification('❌', 'Промокод не найден или неактивен'); return; }
    if (promo.usedCount >= promo.maxUses) { showNotification('❌', 'Промокод исчерпан'); return; }
    // Apply
    promo.usedCount++;
    savePromos(promos);
    balance += promo.bonus;
    playerStats.usedPromos.push({ code: code, bonus: promo.bonus, date: new Date().toISOString() });
    savePlayerStats(); updateBalanceDisplay(); saveState();
    input.value = '';
    showNotification('🎉', 'Промокод активирован! +' + formatNumber(promo.bonus) + ' 💎');
    createConfetti();
    renderPromoHistory();
    // Update balance display on profile
    var pqb = document.getElementById('pqBalance'); if (pqb) pqb.textContent = formatNumber(balance);
}

function renderSocialBonuses() {
    var container = document.getElementById('socialBonuses'); if (!container) return;
    var socials = getSocialBonuses();
    var html = '';
    socials.forEach(function (s) {
        var claimed = playerStats.claimedSocials.indexOf(s.id) !== -1;
        html += '<div class="social-bonus-card' + (claimed ? ' claimed' : '') + '">' +
            '<div class="social-bonus-icon">' + s.icon + '</div>' +
            '<div class="social-bonus-info"><div class="social-bonus-name">' + s.name + '</div><div class="social-bonus-reward">+' + formatNumber(s.bonus) + ' 💎</div></div>' +
            '<div class="social-bonus-actions">';
        if (claimed) {
            html += '<div class="social-claimed-badge">✅ Получено</div>';
        } else {
            html += '<a href="' + s.url + '" target="_blank" class="social-sub-btn">🔗 Подписаться</a>' +
                '<button class="social-claim-btn" onclick="claimSocialBonus(\'' + s.id + '\')">🎁 Получить бонус</button>';
        }
        html += '</div></div>';
    });
    container.innerHTML = html;
}

function claimSocialBonus(socialId) {
    if (playerStats.claimedSocials.indexOf(socialId) !== -1) { showNotification('❌', 'Бонус уже получен'); return; }
    var socials = getSocialBonuses();
    var social = socials.find(function (s) { return s.id === socialId; });
    if (!social) return;
    playerStats.claimedSocials.push(socialId);
    balance += social.bonus;
    savePlayerStats(); updateBalanceDisplay(); saveState();
    showNotification('🎉', 'Бонус за ' + social.name + ': +' + formatNumber(social.bonus) + ' 💎');
    createConfetti();
    renderSocialBonuses();
    var pqb = document.getElementById('pqBalance'); if (pqb) pqb.textContent = formatNumber(balance);
}

function saveProfileSettings() {
    if (!currentUser) { showNotification('❌', 'Войдите в аккаунт'); return; }
    var newName = document.getElementById('settingDisplayName').value.trim();
    var newAvatar = document.getElementById('settingAvatarUrl').value.trim();
    if (newName) currentUser.displayName = newName;
    currentUser.avatarUrl = newAvatar;
    localStorage.setItem('mj_user', JSON.stringify(currentUser));
    // Update users db
    var users = JSON.parse(localStorage.getItem('mj_users') || '{}');
    if (users[currentUser.username]) {
        users[currentUser.username].displayName = currentUser.displayName;
        users[currentUser.username].avatarUrl = currentUser.avatarUrl;
        localStorage.setItem('mj_users', JSON.stringify(users));
    }
    showNotification('✅', 'Профиль обновлён!');
    initProfilePage();
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', function () {
    createParticles(); updateBalanceDisplay(); updateAuthUI(); initHeaderScroll();
    var page = document.body.dataset.page;
    if (page === 'index') { renderCases(); initLiveDrops(); var t = document.getElementById('totalOpened'); if (t) t.textContent = formatNumber(totalOpened); }
    if (page === 'open') initOpenPage();
    if (page === 'inventory') initInventoryPage();
    if (page === 'profile') initProfilePage();
    document.addEventListener('click', function (e) { var p = document.getElementById('userProfile'), m = document.getElementById('userMenu'); if (p && m && !p.contains(e.target)) m.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDeposit(); closeAuthModal(); closeUserMenu(); } });
});
