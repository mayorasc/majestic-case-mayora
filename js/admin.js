// ============================================================
//  MAJESTIC CASES — Admin Panel (with Promos + Social Bonuses)
// ============================================================

var adminCases = [];

function isUrl(s) { return s && (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')); }

function previewIcon(value, previewId) {
    var el = document.getElementById(previewId); if (!el) return;
    if (isUrl(value)) el.innerHTML = '<img src="' + value + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.parentElement.textContent=\'❌\'">';
    else el.textContent = value || '📦';
}

function previewItemIcon(input, previewId) {
    var el = document.getElementById(previewId); if (!el) return; var val = input.value;
    if (isUrl(val)) el.innerHTML = '<img src="' + val + '" style="width:36px;height:36px;object-fit:cover;border-radius:4px;" onerror="this.parentElement.textContent=\'❌\'">';
    else el.textContent = val || '❓';
}

function loadCases() {
    var saved = localStorage.getItem('mj_custom_cases');
    if (saved) { try { adminCases = JSON.parse(saved); } catch (e) { adminCases = getDefaultCases(); } }
    else adminCases = getDefaultCases();
}

function saveCases() { localStorage.setItem('mj_custom_cases', JSON.stringify(adminCases)); }

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

// ============ TABS ============
function switchTab(tab, btn) {
    document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
    document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('active'); });
    btn.classList.add('active');
    var panel = document.getElementById('panel-' + tab); if (panel) panel.classList.add('active');
    if (tab === 'cases') renderCasesList();
    if (tab === 'stats') updateAdminStats();
    if (tab === 'settings') { document.getElementById('settingsBalance').value = localStorage.getItem('mj_balance') || '10000'; }
    if (tab === 'create') initCreateForm();
    if (tab === 'promos') renderPromosList();
    if (tab === 'socials') renderSocialsList();
}

// ============ CASES LIST ============
function renderCasesList() {
    var list = document.getElementById('casesList'); if (!list) return; list.innerHTML = '';
    adminCases.forEach(function (c) {
        var card = document.createElement('div'); card.className = 'case-edit-card';
        var iconContent = isUrl(c.icon) ? '<img src="' + c.icon + '" onerror="this.textContent=\'📦\'">' : c.icon;
        card.innerHTML = '<div class="case-edit-icon">' + iconContent + '</div><div class="case-edit-info"><div class="case-edit-name">' + c.name + '</div><div class="case-edit-meta">💎 ' + c.price + ' • ' + c.items.length + ' предметов • ' + c.tag + (c.badge ? ' • ' + c.badge : '') + '</div></div><div class="case-edit-actions"><button class="btn btn-primary btn-sm" data-edit-id="' + c.id + '">✏️ Редакт.</button><button class="btn btn-danger btn-sm" data-delete-id="' + c.id + '">🗑️</button></div>';
        list.appendChild(card);
    });
    list.querySelectorAll('[data-edit-id]').forEach(function (btn) { btn.addEventListener('click', function () { openEditModal(parseInt(this.getAttribute('data-edit-id'))); }); });
    list.querySelectorAll('[data-delete-id]').forEach(function (btn) { btn.addEventListener('click', function () { deleteCase(parseInt(this.getAttribute('data-delete-id'))); }); });
}

function deleteCase(id) { if (!confirm('Удалить этот кейс?')) return; adminCases = adminCases.filter(function (c) { return c.id !== id; }); saveCases(); renderCasesList(); }

// ============ EDIT MODAL ============
function openEditModal(id) {
    var c = adminCases.find(function (x) { return x.id === id; }); if (!c) return;
    document.getElementById('editCaseId').value = c.id;
    document.getElementById('editCaseName').value = c.name;
    document.getElementById('editCasePrice').value = c.price;
    document.getElementById('editCaseDesc').value = c.description;
    document.getElementById('editCaseIcon').value = c.icon;
    document.getElementById('editCaseTag').value = c.tag;
    document.getElementById('editCaseBadge').value = c.badge || '';
    document.getElementById('editCaseColor').value = c.color;
    document.getElementById('editModalTitle').textContent = '✏️ ' + c.name;
    previewIcon(c.icon, 'editCaseIconPreview');
    var editor = document.getElementById('editItemsEditor'); editor.innerHTML = '';
    c.items.forEach(function (item) { addEditItemRow(item); });
    document.getElementById('editCaseModal').classList.add('active');
}

function closeEditModal() { document.getElementById('editCaseModal').classList.remove('active'); }

function buildItemRow(container, item, prefix) {
    var row = document.createElement('div'); row.className = 'item-edit-row';
    var iconId = prefix + '_icon_' + Date.now() + Math.random();
    var iconContent = isUrl(item.icon) ? '<img src="' + item.icon + '" style="width:36px;height:36px;object-fit:cover;border-radius:4px;">' : item.icon;
    row.innerHTML = '<div class="icon-cell" id="' + iconId + '">' + iconContent + '</div>' +
        '<input type="text" class="item-icon-input" value="' + (item.icon || '') + '" placeholder="🔫 или URL" oninput="previewItemIcon(this,\'' + iconId + '\')" style="width:100%">' +
        '<input type="text" class="item-name" value="' + (item.name || '') + '" placeholder="Название">' +
        '<input type="number" class="item-chance" value="' + (item.chance || 10) + '" placeholder="%" style="width:70px">' +
        '<input type="number" class="item-value" value="' + (item.value || 100) + '" placeholder="Цена" style="width:80px">' +
        '<select class="item-rarity">' +
        '<option value="common"' + (item.rarity === 'common' ? ' selected' : '') + '>Обычный</option>' +
        '<option value="uncommon"' + (item.rarity === 'uncommon' ? ' selected' : '') + '>Необычный</option>' +
        '<option value="rare"' + (item.rarity === 'rare' ? ' selected' : '') + '>Редкий</option>' +
        '<option value="epic"' + (item.rarity === 'epic' ? ' selected' : '') + '>Эпический</option>' +
        '<option value="legendary"' + (item.rarity === 'legendary' ? ' selected' : '') + '>Легендарный</option>' +
        '<option value="mythic"' + (item.rarity === 'mythic' ? ' selected' : '') + '>Мифический</option>' +
        '</select>' +
        '<button class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">✕</button>';
    container.appendChild(row);
}

function addEditItemRow(item) { if (!item) item = { name: '', icon: '❓', rarity: 'common', chance: 10, value: 100 }; buildItemRow(document.getElementById('editItemsEditor'), item, 'edit'); }
function addNewItemRow(item) { if (!item) item = { name: '', icon: '❓', rarity: 'common', chance: 10, value: 100 }; buildItemRow(document.getElementById('newItemsEditor'), item, 'new'); }

function getItemsFromEditor(editorId) {
    var editor = document.getElementById(editorId); var rows = editor.querySelectorAll('.item-edit-row'); var items = [];
    rows.forEach(function (row) {
        var icon = row.querySelector('.item-icon-input').value.trim();
        var name = row.querySelector('.item-name').value.trim();
        var chance = parseFloat(row.querySelector('.item-chance').value) || 0;
        var value = parseInt(row.querySelector('.item-value').value) || 0;
        var rarity = row.querySelector('.item-rarity').value;
        if (name) items.push({ name: name, icon: icon || '❓', rarity: rarity, chance: chance, value: value });
    });
    return items;
}

function saveCase() {
    var id = parseInt(document.getElementById('editCaseId').value);
    var c = adminCases.find(function (x) { return x.id === id; }); if (!c) return;
    c.name = document.getElementById('editCaseName').value.trim();
    c.price = parseInt(document.getElementById('editCasePrice').value) || 100;
    c.description = document.getElementById('editCaseDesc').value.trim();
    c.icon = document.getElementById('editCaseIcon').value.trim() || '📦';
    c.tag = document.getElementById('editCaseTag').value;
    c.badge = document.getElementById('editCaseBadge').value;
    c.color = document.getElementById('editCaseColor').value.trim();
    c.items = getItemsFromEditor('editItemsEditor');
    saveCases(); closeEditModal(); renderCasesList(); alert('✅ Кейс сохранён!');
}

// ============ CREATE CASE ============
function initCreateForm() { var editor = document.getElementById('newItemsEditor'); if (editor && editor.children.length === 0) for (var i = 0; i < 4; i++) addNewItemRow(); }

function createCase() {
    var name = document.getElementById('newCaseName').value.trim();
    var price = parseInt(document.getElementById('newCasePrice').value);
    var desc = document.getElementById('newCaseDesc').value.trim();
    var icon = document.getElementById('newCaseIcon').value.trim() || '📦';
    var tag = document.getElementById('newCaseTag').value;
    var badge = document.getElementById('newCaseBadge').value;
    var color = document.getElementById('newCaseColor').value.trim();
    var items = getItemsFromEditor('newItemsEditor');
    if (!name) { alert('Введите название кейса'); return; }
    if (!price || price <= 0) { alert('Введите корректную цену'); return; }
    if (items.length === 0) { alert('Добавьте хотя бы один предмет'); return; }
    var maxId = 0; adminCases.forEach(function (c) { if (c.id > maxId) maxId = c.id; });
    adminCases.push({ id: maxId + 1, name: name, description: desc, price: price, icon: icon, tag: tag, badge: badge, color: color || 'rgba(124,58,237,0.3)', items: items });
    saveCases(); alert('✅ Кейс "' + name + '" создан!');
    document.getElementById('newCaseName').value = ''; document.getElementById('newCasePrice').value = ''; document.getElementById('newCaseDesc').value = '';
    document.getElementById('newCaseIcon').value = '📦'; previewIcon('📦', 'newCaseIconPreview');
    document.getElementById('newItemsEditor').innerHTML = ''; for (var i = 0; i < 4; i++) addNewItemRow();
}

// ============ PROMOS MANAGEMENT ============
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

function renderPromosList() {
    var container = document.getElementById('promosList'); if (!container) return;
    var promos = getPromos();
    if (promos.length === 0) { container.innerHTML = '<p style="color:#64748b">Нет промокодов</p>'; return; }
    var html = '<table class="promo-table"><thead><tr><th>Код</th><th>Бонус 💎</th><th>Использований</th><th>Макс.</th><th>Статус</th><th>Действия</th></tr></thead><tbody>';
    promos.forEach(function (p, i) {
        html += '<tr><td><strong>' + p.code + '</strong></td><td>' + p.bonus.toLocaleString('ru-RU') + '</td><td>' + p.usedCount + '</td><td>' + p.maxUses + '</td><td class="' + (p.active ? 'promo-status-active' : 'promo-status-inactive') + '">' + (p.active ? '✅ Активен' : '❌ Неактивен') + '</td><td><button class="btn btn-warning btn-sm" onclick="togglePromo(' + i + ')">' + (p.active ? '⏸️' : '▶️') + '</button> <button class="btn btn-danger btn-sm" onclick="deletePromo(' + i + ')">🗑️</button></td></tr>';
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

function createPromo() {
    var code = document.getElementById('newPromoCode').value.trim().toUpperCase();
    var bonus = parseInt(document.getElementById('newPromoBonus').value);
    var maxUses = parseInt(document.getElementById('newPromoMaxUses').value) || 100;
    if (!code) { alert('Введите код промокода'); return; }
    if (!bonus || bonus <= 0) { alert('Введите корректный бонус'); return; }
    var promos = getPromos();
    if (promos.some(function (p) { return p.code === code; })) { alert('Промокод с таким кодом уже существует'); return; }
    promos.push({ code: code, bonus: bonus, maxUses: maxUses, usedCount: 0, active: true });
    savePromos(promos);
    document.getElementById('newPromoCode').value = '';
    document.getElementById('newPromoBonus').value = '';
    document.getElementById('newPromoMaxUses').value = '100';
    renderPromosList();
    alert('✅ Промокод ' + code + ' создан!');
}

function togglePromo(index) {
    var promos = getPromos();
    if (promos[index]) { promos[index].active = !promos[index].active; savePromos(promos); renderPromosList(); }
}

function deletePromo(index) {
    if (!confirm('Удалить этот промокод?')) return;
    var promos = getPromos(); promos.splice(index, 1); savePromos(promos); renderPromosList();
}

// ============ SOCIAL BONUSES MANAGEMENT ============
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

function renderSocialsList() {
    var container = document.getElementById('socialsList'); if (!container) return;
    var socials = getSocialBonuses();
    if (socials.length === 0) { container.innerHTML = '<p style="color:#64748b">Нет соц.бонусов</p>'; return; }
    var html = '';
    socials.forEach(function (s, i) {
        html += '<div class="social-admin-card"><div class="social-admin-icon">' + s.icon + '</div><div class="social-admin-info"><div class="social-admin-name">' + s.name + '</div><div class="social-admin-meta">💎 ' + s.bonus.toLocaleString('ru-RU') + ' • <a href="' + s.url + '" target="_blank" style="color:#3b82f6">' + s.url + '</a></div></div><div><button class="btn btn-danger btn-sm" onclick="deleteSocial(' + i + ')">🗑️ Удалить</button></div></div>';
    });
    container.innerHTML = html;
}

function createSocialBonus() {
    var name = document.getElementById('newSocialName').value.trim();
    var icon = document.getElementById('newSocialIcon').value.trim() || '🔗';
    var url = document.getElementById('newSocialUrl').value.trim();
    var bonus = parseInt(document.getElementById('newSocialBonus').value);
    if (!name) { alert('Введите название'); return; }
    if (!url) { alert('Введите ссылку'); return; }
    if (!bonus || bonus <= 0) { alert('Введите корректный бонус'); return; }
    var socials = getSocialBonuses();
    var id = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now();
    socials.push({ id: id, name: name, icon: icon, url: url, bonus: bonus });
    saveSocialBonuses(socials);
    document.getElementById('newSocialName').value = '';
    document.getElementById('newSocialIcon').value = '📱';
    document.getElementById('newSocialUrl').value = '';
    document.getElementById('newSocialBonus').value = '';
    renderSocialsList();
    alert('✅ Соц.бонус "' + name + '" добавлен!');
}

function deleteSocial(index) {
    if (!confirm('Удалить этот бонус?')) return;
    var socials = getSocialBonuses(); socials.splice(index, 1); saveSocialBonuses(socials); renderSocialsList();
}

// ============ STATS ============
function updateAdminStats() {
    var totalItems = 0; adminCases.forEach(function (c) { totalItems += c.items.length; });
    var e1 = document.getElementById('adminStatCases'), e2 = document.getElementById('adminStatItems'), e3 = document.getElementById('adminStatBalance'), e4 = document.getElementById('adminStatInventory'), e5 = document.getElementById('adminStatOpened'), e6 = document.getElementById('adminStatPromos');
    if (e1) e1.textContent = adminCases.length; if (e2) e2.textContent = totalItems;
    if (e3) e3.textContent = localStorage.getItem('mj_balance') || '10000';
    if (e4) { var inv = JSON.parse(localStorage.getItem('mj_inventory') || '[]'); e4.textContent = inv.length; }
    if (e5) e5.textContent = localStorage.getItem('mj_totalOpened') || '0';
    if (e6) { var promos = getPromos(); e6.textContent = promos.length; }
}

// ============ SETTINGS ============
function updateBalance() { var v = parseInt(document.getElementById('settingsBalance').value); if (v >= 0) { localStorage.setItem('mj_balance', v.toString()); alert('✅ Баланс обновлён: ' + v); } }
function resetInventory() { if (!confirm('Очистить инвентарь?')) return; localStorage.setItem('mj_inventory', '[]'); alert('✅ Инвентарь очищен'); }
function resetAllData() {
    if (!confirm('⚠️ Сбросить ВСЕ данные?')) return;
    localStorage.removeItem('mj_custom_cases'); localStorage.removeItem('mj_balance'); localStorage.removeItem('mj_inventory');
    localStorage.removeItem('mj_totalOpened'); localStorage.removeItem('mj_promos'); localStorage.removeItem('mj_social_bonuses');
    localStorage.removeItem('mj_playerStats'); localStorage.removeItem('mj_user'); localStorage.removeItem('mj_users');
    alert('✅ Все данные сброшены.'); location.reload();
}

function exportData() {
    var data = { cases: adminCases, balance: localStorage.getItem('mj_balance'), inventory: localStorage.getItem('mj_inventory'), totalOpened: localStorage.getItem('mj_totalOpened'), promos: localStorage.getItem('mj_promos'), socialBonuses: localStorage.getItem('mj_social_bonuses'), playerStats: localStorage.getItem('mj_playerStats'), users: localStorage.getItem('mj_users') };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'majestic_backup_' + Date.now() + '.json'; a.click();
}

function importDataPrompt() {
    var input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = function (e) {
        var file = e.target.files[0]; if (!file) return;
        var reader = new FileReader();
        reader.onload = function (ev) {
            try {
                var data = JSON.parse(ev.target.result);
                if (data.cases) { adminCases = data.cases; saveCases(); }
                if (data.balance) localStorage.setItem('mj_balance', data.balance);
                if (data.inventory) localStorage.setItem('mj_inventory', data.inventory);
                if (data.totalOpened) localStorage.setItem('mj_totalOpened', data.totalOpened);
                if (data.promos) localStorage.setItem('mj_promos', data.promos);
                if (data.socialBonuses) localStorage.setItem('mj_social_bonuses', data.socialBonuses);
                if (data.playerStats) localStorage.setItem('mj_playerStats', data.playerStats);
                if (data.users) localStorage.setItem('mj_users', data.users);
                alert('✅ Данные импортированы!'); location.reload();
            } catch (err) { alert('❌ Ошибка: неверный формат файла'); }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', function () { loadCases(); renderCasesList(); });
