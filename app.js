/* ============ CONFIG ============ */
const TG_BOT_TOKEN = '8605635560:AAHENbbYFZHRaEr6YlZob767mCb3uz83sk0';
const TG_CHAT_ID = '-1002794882456';
const ADMIN_PASSWORD = '1782';
const WA_NUMBER = '996552600311';

/* ============ STATE ============ */
let state = {
  cars: [],
  cart: [],
  users: [],
  paySettings: { bank: 'Mbank', card: '4169 7388 1234 5678', holder: 'АВТОДИЛЕР КГ' },
  selectedCar: null,
  adminLoggedIn: false,
  notifications: []
};

/* ============ DEFAULT CARS ============ */
const defaultCars = [
  { id: 1, name: 'Toyota Camry 2023', emoji: '🚗', price: 2500000, category: 'business', desc: 'Легендарная надёжность, просторный салон, экономичный двигатель 2.5L. Идеально для города и трасс.', specs: ['2.5L 181 л.с.', 'Автомат', '9.7 л/100км', 'Климат-контроль', 'Камера 360°'] },
  { id: 2, name: 'BMW X5 2022', emoji: '🚙', price: 6800000, category: 'premium', desc: 'Премиальный внедорожник с мощным 3.0L двигателем. Комфорт, статус и высокие технологии.', specs: ['3.0L 340 л.с.', 'Полный привод', 'Панорамная крыша', 'Кожаный салон', 'HUD'] },
  { id: 3, name: 'Hyundai Accent 2023', emoji: '🚕', price: 1200000, category: 'economy', desc: 'Экономичный и практичный седан для ежедневных поездок. Низкий расход, высокая надёжность.', specs: ['1.6L 123 л.с.', 'Механика', '6.5 л/100км', 'Apple CarPlay', 'Задние датчики'] },
  { id: 4, name: 'Land Cruiser 300', emoji: '🛻', price: 9500000, category: 'suv', desc: 'Легендарный внедорожник Toyota. Непобедимый на любом бездорожье Кыргызстана.', specs: ['3.5L V6 415 л.с.', '4WD', 'Air Suspension', 'Многозонный климат', '360 камер'] },
  { id: 5, name: 'Mercedes C-Class 2023', emoji: '🚘', price: 5200000, category: 'premium', desc: 'Воплощение немецкой инженерии. Роскошный интерьер, передовые технологии безопасности.', specs: ['2.0L 204 л.с.', 'MBUX интерфейс', 'Ambient Light', 'Адаптивный круиз', 'Massage сиденья'] },
  { id: 6, name: 'Chevrolet Nexia 2023', emoji: '🚗', price: 890000, category: 'economy', desc: 'Бюджетный и практичный автомобиль. Отличный выбор для начинающих водителей.', specs: ['1.5L 107 л.с.', 'Механика', '7.0 л/100км', 'Кондиционер', 'ABS'] },
  { id: 7, name: 'Kia Sportage 2023', emoji: '🚙', price: 3100000, category: 'suv', desc: 'Стильный кроссовер с современным дизайном. Просторный салон и отличная проходимость.', specs: ['2.0L 150 л.с.', 'AWD опция', 'Панорамный люк', 'Беспроводная зарядка', 'Lane Assist'] },
  { id: 8, name: 'Lexus ES 350', emoji: '🏎️', price: 7400000, category: 'premium', desc: 'Японская роскошь на каждом километре. Тихий, плавный, технологичный.', specs: ['3.5L V6 302 л.с.', 'Lexus Safety+', 'Mark Levinson Audio', 'Heads-Up Display', '12.3" экран'] },
];

/* ============ INIT ============ */
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  if (state.cars.length === 0) state.cars = defaultCars;
  renderCars(state.cars);
  updateCartUI();
  setupScrollNav();
  animateCounters();
  setupIntersectionObserver();
});

function loadState() {
  try {
    const saved = localStorage.getItem('autokg_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.cars = parsed.cars || [];
      state.cart = parsed.cart || [];
      state.users = parsed.users || [];
      state.paySettings = parsed.paySettings || state.paySettings;
    }
  } catch(e) { /* ignore */ }
}

function saveState() {
  try {
    localStorage.setItem('autokg_state', JSON.stringify({
      cars: state.cars,
      cart: state.cart,
      users: state.users,
      paySettings: state.paySettings
    }));
  } catch(e) { /* ignore */ }
}

/* ============ NAVBAR SCROLL ============ */
function setupScrollNav() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ============ MOBILE MENU ============ */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham = document.getElementById('hamburger');
  menu.classList.toggle('open');
  ham.classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ============ COUNTER ANIMATION ============ */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current = Math.min(current + step, target);
      counter.textContent = Math.floor(current).toLocaleString();
      if (current < target) requestAnimationFrame(update);
    };
    setTimeout(update, 600);
  });
}

/* ============ INTERSECTION OBSERVER ============ */
function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.city-card, .car-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/* ============ CITIES ============ */
function selectCity(cityName) {
  document.querySelectorAll('.city-card').forEach(c => c.classList.remove('active'));
  event.currentTarget.classList.add('active');
  showNotification(`📍 Выбран город: ${cityName}`, 'success');
  document.querySelector('#catalog').scrollIntoView({ behavior: 'smooth' });
}

/* ============ CARS RENDERING ============ */
function renderCars(cars) {
  const grid = document.getElementById('carsGrid');
  if (!cars.length) {
    grid.innerHTML = '<p style="color:var(--text2);text-align:center;grid-column:1/-1;padding:40px">Автомобили не найдены</p>';
    return;
  }
  grid.innerHTML = cars.map(car => `
    <div class="car-card" onclick="openCarModal(${car.id})" data-category="${car.category}">
      <div class="car-card-img">
        ${car.emoji}
        <span class="car-category-badge cat-${car.category}">${categoryLabel(car.category)}</span>
      </div>
      <div class="car-card-body">
        <div class="car-card-name">${car.name}</div>
        <div class="car-card-desc">${car.desc.substring(0, 80)}${car.desc.length > 80 ? '...' : ''}</div>
        <div class="car-card-footer">
          <div class="car-card-price">${formatPrice(car.price)} <span>сом</span></div>
          <button class="btn-select" onclick="event.stopPropagation(); openCarModal(${car.id})">Выбрать</button>
        </div>
      </div>
    </div>
  `).join('');
  setupIntersectionObserver();
}

function categoryLabel(cat) {
  const labels = { economy: 'Эконом', business: 'Бизнес', premium: 'Премиум', suv: 'Внедорожник' };
  return labels[cat] || cat;
}

function formatPrice(price) {
  return Number(price).toLocaleString('ru-RU');
}

function filterCars(category, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = category === 'all' ? state.cars : state.cars.filter(c => c.category === category);
  renderCars(filtered);
}

/* ============ CAR MODAL ============ */
function openCarModal(carId) {
  const car = state.cars.find(c => c.id === carId);
  if (!car) return;
  state.selectedCar = car;
  document.getElementById('carModalTitle').textContent = car.name;
  document.getElementById('carModalEmoji').textContent = car.emoji;
  document.getElementById('carModalCategory').textContent = categoryLabel(car.category);
  document.getElementById('carModalDesc').textContent = car.desc;
  document.getElementById('carModalPrice').textContent = `${formatPrice(car.price)} сом`;
  const specsEl = document.getElementById('carModalSpecs');
  specsEl.innerHTML = (car.specs || []).map(s => `<span class="spec-tag">${s}</span>`).join('');
  openModal('carModal');
}

function addToCart() {
  if (!state.selectedCar) return;
  const exists = state.cart.find(c => c.id === state.selectedCar.id);
  if (exists) { showNotification('🛒 Уже в корзине!'); return; }
  state.cart.push({ ...state.selectedCar });
  saveState();
  updateCartUI();
  closeModal('carModal');
  showNotification('✅ Добавлено в корзину!', 'success');
}

function openPayModal() {
  closeModal('carModal');
  const ps = state.paySettings;
  document.getElementById('payBankName').textContent = ps.bank;
  document.getElementById('payCardNumber').textContent = ps.card;
  document.getElementById('payCardHolder').textContent = ps.holder;
  document.getElementById('paySuccess').classList.add('hidden');
  document.querySelector('#payModal .modal-form').classList.remove('hidden');
  openModal('payModal');
}

/* ============ CART ============ */
function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = state.cart.length;
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!state.cart.length) {
    itemsEl.innerHTML = '<div class="cart-empty">🛒 Корзина пуста</div>';
    footerEl.style.display = 'none';
    return;
  }
  footerEl.style.display = 'block';
  const total = state.cart.reduce((sum, c) => sum + c.price, 0);
  document.getElementById('cartTotal').textContent = formatPrice(total);
  itemsEl.innerHTML = state.cart.map((car, i) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${car.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${car.name}</div>
        <div class="cart-item-price">${formatPrice(car.price)} сом</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
    </div>
  `).join('');
}

function removeFromCart(idx) {
  state.cart.splice(idx, 1);
  saveState();
  updateCartUI();
  showNotification('🗑 Удалено из корзины');
}

function checkoutCart() {
  if (!state.cart.length) return;
  state.selectedCar = state.cart[0];
  toggleCart();
  openPayModal();
}

/* ============ REGISTRATION ============ */
async function submitRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const phone = document.getElementById('regPhone').value;
  const city = document.getElementById('regCity').value;
  const pass = document.getElementById('regPassword').value;
  if (!name || !phone || !city || !pass) return;

  const user = { id: Date.now(), name, phone, city, date: new Date().toLocaleDateString('ru-RU') };
  state.users.push(user);
  saveState();

  // Send to Telegram
  const text = `🆕 *Новая регистрация*\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📍 Город: ${city}\n🕐 Дата: ${user.date}`;
  await sendTelegramMessage(text);

  document.querySelector('#registerModal .modal-form').classList.add('hidden');
  document.getElementById('registerSuccess').classList.remove('hidden');
  setTimeout(() => closeModal('registerModal'), 3000);
  showNotification('✅ Регистрация успешна!', 'success');
}

/* ============ PAYMENT ============ */
async function submitPayment(e) {
  e.preventDefault();
  const name = document.getElementById('payName').value;
  const phone = document.getElementById('payPhone').value;
  const fileInput = document.getElementById('checkFile');
  const carName = state.selectedCar ? state.selectedCar.name : 'Не выбрана';
  const carPrice = state.selectedCar ? formatPrice(state.selectedCar.price) : '0';

  if (!name || !phone) { showNotification('❗ Заполните все поля', 'error'); return; }

  const text = `💳 *Новая оплата*\n\n👤 Клиент: ${name}\n📞 Телефон: ${phone}\n🚗 Автомобиль: ${carName}\n💰 Сумма: ${carPrice} сом\n🕐 Дата: ${new Date().toLocaleString('ru-RU')}`;

  if (fileInput.files[0]) {
    await sendTelegramPhoto(fileInput.files[0], text);
  } else {
    await sendTelegramMessage(text + '\n📎 Чек не прикреплён');
  }

  document.querySelector('#payModal .modal-form').classList.add('hidden');
  document.getElementById('paySuccess').classList.remove('hidden');
  state.cart = [];
  saveState();
  updateCartUI();
  setTimeout(() => closeModal('payModal'), 3500);
  showNotification('✅ Заявка отправлена!', 'success');
}

function previewCheck(input) {
  if (input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('checkPreview').src = e.target.result;
      document.getElementById('checkPreview').classList.remove('hidden');
      document.getElementById('uploadPlaceholder').classList.add('hidden');
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/* ============ TELEGRAM API ============ */
async function sendTelegramMessage(text) {
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'Markdown' })
    });
  } catch(e) { console.log('TG message error:', e); }
}

async function sendTelegramPhoto(file, caption) {
  try {
    const formData = new FormData();
    formData.append('chat_id', TG_CHAT_ID);
    formData.append('photo', file);
    formData.append('caption', caption);
    formData.append('parse_mode', 'Markdown');
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendPhoto`, {
      method: 'POST', body: formData
    });
  } catch(e) {
    await sendTelegramMessage(caption + '\n📎 Ошибка загрузки фото');
  }
}

/* ============ WHATSAPP ============ */
function openWhatsApp() {
  window.open(`https://wa.me/${WA_NUMBER}?text=Здравствуйте! Хочу узнать об автомобиле.`, '_blank');
}

/* ============ MODAL HELPERS ============ */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

/* ============ NOTIFICATION ============ */
function showNotification(msg, type = '') {
  const el = document.getElementById('notification');
  el.textContent = msg;
  el.className = `notification ${type} show`;
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ============ ADMIN ============ */
function openAdmin() {
  state.adminLoggedIn = false;
  document.getElementById('adminLogin').classList.remove('hidden');
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('adminPass').value = '';
  openModal('adminModal');
}

function checkAdminPass() {
  const pass = document.getElementById('adminPass').value;
  if (pass === ADMIN_PASSWORD) {
    state.adminLoggedIn = true;
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    renderAdminCars();
    renderAdminUsers();
    loadPaySettings();
  } else {
    showNotification('❌ Неверный пароль', 'error');
    document.getElementById('adminPass').style.borderColor = '#ef4444';
    setTimeout(() => document.getElementById('adminPass').style.borderColor = '', 1500);
  }
}

function switchAdminTab(tab, btn) {
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.admin-content').forEach(c => c.classList.add('hidden'));
  document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.remove('hidden');
}

function showAddCarForm() {
  document.getElementById('addCarForm').classList.toggle('hidden');
}

function addCar() {
  const name = document.getElementById('newCarName').value.trim();
  const emoji = document.getElementById('newCarEmoji').value.trim() || '🚗';
  const price = parseInt(document.getElementById('newCarPrice').value);
  const category = document.getElementById('newCarCategory').value;
  const desc = document.getElementById('newCarDesc').value.trim();
  const specsRaw = document.getElementById('newCarSpecs').value.trim();
  if (!name || !price) { showNotification('❗ Заполните обязательные поля', 'error'); return; }
  const specs = specsRaw ? specsRaw.split(',').map(s => s.trim()) : [];
  const newCar = { id: Date.now(), name, emoji, price, category, desc: desc || 'Отличный автомобиль', specs };
  state.cars.push(newCar);
  saveState();
  renderCars(state.cars);
  renderAdminCars();
  document.getElementById('addCarForm').classList.add('hidden');
  ['newCarName','newCarEmoji','newCarPrice','newCarDesc','newCarSpecs'].forEach(id => document.getElementById(id).value = '');
  showNotification('✅ Автомобиль добавлен!', 'success');
}

function deleteCar(id) {
  if (!confirm('Удалить этот автомобиль?')) return;
  state.cars = state.cars.filter(c => c.id !== id);
  saveState();
  renderCars(state.cars);
  renderAdminCars();
  showNotification('🗑 Автомобиль удалён');
}

function renderAdminCars() {
  const list = document.getElementById('adminCarsList');
  if (!state.cars.length) { list.innerHTML = '<p style="color:var(--text2);font-size:13px">Нет автомобилей</p>'; return; }
  list.innerHTML = state.cars.map(car => `
    <div class="admin-car-item">
      <span style="font-size:24px">${car.emoji}</span>
      <div class="admin-car-info">
        <div class="admin-car-name">${car.name}</div>
        <div class="admin-car-price">${formatPrice(car.price)} сом · ${categoryLabel(car.category)}</div>
      </div>
      <div class="admin-car-actions">
        <button class="btn-admin-del" onclick="deleteCar(${car.id})">Удалить</button>
      </div>
    </div>
  `).join('');
}

function renderAdminUsers() {
  const list = document.getElementById('adminUsersList');
  if (!state.users.length) { list.innerHTML = '<p style="color:var(--text2);font-size:13px">Нет регистраций</p>'; return; }
  list.innerHTML = state.users.map(u => `
    <div class="admin-user-item">
      <div class="admin-user-info">
        <div class="admin-user-name">${u.name} · ${u.city}</div>
        <div class="admin-user-phone">${u.phone} · ${u.date}</div>
      </div>
    </div>
  `).join('');
}

function loadPaySettings() {
  const ps = state.paySettings;
  document.getElementById('settBankName').value = ps.bank;
  document.getElementById('settCardNum').value = ps.card;
  document.getElementById('settCardHolder').value = ps.holder;
}

function savePaySettings() {
  state.paySettings.bank = document.getElementById('settBankName').value;
  state.paySettings.card = document.getElementById('settCardNum').value;
  state.paySettings.holder = document.getElementById('settCardHolder').value;
  saveState();
  showNotification('✅ Реквизиты сохранены!', 'success');
}

/* ============ KEYBOARD CLOSE ============ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['registerModal','carModal','payModal','adminModal'].forEach(id => closeModal(id));
    const drawer = document.getElementById('cartDrawer');
    if (drawer.classList.contains('open')) toggleCart();
  }
});
