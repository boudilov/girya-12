const STORAGE_KEY = 'girya-12-progress-v1';
const CYCLE_LENGTH = 28;

const schedule = [
  {
    code: 'A',
    title: 'Силовая А',
    type: 'Сила',
    duration: '30–40 мин',
    description: 'Всё тело с акцентом на спину, грудь и мышцы кора. Движения спокойные, без работы до отказа.',
    exercises: [
      'Приседания с гирей у груди — 10–12',
      'Тяга гири одной рукой в наклоне — 10–12 на сторону',
      'Жим гири лёжа на полу — 8–12 на руку',
      'Румынская тяга с гирей — 12–15',
      'Планка на предплечьях — 30–45 секунд'
    ],
    volumes: ['2–3 круга', '3 круга', '3–4 круга', '3 круга · контроль техники']
  },
  {
    code: 'И',
    title: 'Интервалы',
    type: 'Выносливость',
    duration: '20–25 мин',
    description: '30 секунд работы и 30 секунд отдыха. Сохраняйте технику и не ускоряйтесь ценой положения спины.',
    exercises: [
      'Махи гирей или становые тяги — 30 секунд',
      'Отжимания — 30 секунд',
      'Приседания с гирей или без — 30 секунд',
      'Быстрый шаг или лёгкий бег на месте — 30 секунд'
    ],
    volumes: ['3 круга', '4 круга', '5 кругов', '4–5 кругов по самочувствию']
  },
  {
    code: 'Х',
    title: 'Ходьба + подвижность',
    type: 'Восстановление',
    duration: '40–60 мин',
    description: 'Активный день без интенсивной нагрузки. Ходите в спокойном темпе и завершите занятие лёгкой подвижностью.',
    exercises: [
      'Спокойная ходьба — 40–60 минут',
      'Подвижность плеч, таза и голеностопа — 10 минут',
      'Дыхание спокойное, без одышки'
    ],
    volumes: ['Спокойный темп', 'Спокойный темп', 'Спокойный темп', 'При усталости сократите прогулку']
  },
  {
    code: 'Б',
    title: 'Силовая Б',
    type: 'Сила',
    duration: '30–40 мин',
    description: 'Плечи, спина, грудь и ноги. При дискомфорте в плече замените жим над головой жимом лёжа.',
    exercises: [
      'Жим гири над головой — 8–10 на руку',
      'Отжимания с доступной высоты — 6–15',
      'Тяга гири к поясу в наклоне — 10–12 на руку',
      'Обратные выпады с гирей у груди — 6–8 на ногу',
      'Переноска гири в одной руке — 30–45 секунд на сторону'
    ],
    volumes: ['2–3 круга', '3 круга', '3–4 круга', '3 круга · контроль техники']
  },
  {
    code: 'И+',
    title: 'Интервалы + кор',
    type: 'Выносливость',
    duration: '25–30 мин',
    description: 'Интервальная работа и стабильность корпуса. После основных кругов добавьте два спокойных подхода на кор.',
    exercises: [
      'Махи гирей или становые тяги — 30 секунд',
      'Отжимания — 30 секунд',
      'Приседания — 30 секунд',
      'Быстрый шаг или бег на месте — 30 секунд',
      '«Мёртвый жук» и боковая планка — по 2 подхода'
    ],
    volumes: ['3 круга + кор', '4 круга + кор', '5 кругов + кор', '4–5 кругов по самочувствию + кор']
  },
  {
    code: 'В',
    title: 'Силовая В',
    type: 'Умеренная сила',
    duration: '25–35 мин',
    description: 'Умеренная силовая работа и кор. Заканчивайте каждый подход с запасом в 2–3 повторения.',
    exercises: [
      'Жим гири лёжа — 10–15 на руку',
      'Тяга гири в наклоне — 12–15 на руку',
      'Приседания с гирей у груди — 12–15',
      '«Мёртвый жук» — 8–10 на сторону',
      'Боковая планка — 20–30 секунд на сторону'
    ],
    volumes: ['2 круга', '2–3 круга', '3 круга', '2–3 круга · легче при усталости']
  },
  {
    code: 'О',
    title: 'Отдых или прогулка',
    type: 'Отдых',
    duration: '30–60 мин',
    description: 'День восстановления. Можно просто отдохнуть или спокойно прогуляться — интенсивная работа не нужна.',
    exercises: [
      'Спокойная прогулка по желанию — 30–60 минут',
      'Лёгкая подвижность без напряжения',
      'Сон и восстановление — часть плана'
    ],
    volumes: ['Без интенсивной нагрузки', 'Без интенсивной нагрузки', 'Без интенсивной нагрузки', 'Полное восстановление']
  }
];

function pad(value) {
  return String(value).padStart(2, '0');
}

function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseISO(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function dayDifference(fromISO, toISODate) {
  const from = parseISO(fromISO);
  const to = parseISO(toISODate);
  return Math.round((to - from) / 86400000);
}

function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseISO(value);
  return !Number.isNaN(date.getTime()) && toISO(date) === value;
}

function formatFullDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(parseISO(iso));
}

function formatShortDate(iso) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short'
  }).format(parseISO(iso));
}

const todayISO = toISO(new Date());
const DEFAULT_START_DATE = '2026-11-09';
const PREVIOUS_DEFAULT_START_DATE = '2026-11-08';

function loadState() {
  const defaultStart = parseISO(DEFAULT_START_DATE);
  const fallback = {
    startDate: DEFAULT_START_DATE,
    completed: new Set(),
    selectedDate: DEFAULT_START_DATE,
    viewMonth: new Date(defaultStart.getFullYear(), defaultStart.getMonth(), 1, 12)
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || !isValidISODate(saved.startDate)) return fallback;

    const startDate = saved.startDate === PREVIOUS_DEFAULT_START_DATE ? DEFAULT_START_DATE : saved.startDate;
    const offset = dayDifference(startDate, todayISO);
    const selectedDate = offset >= 0 && offset < CYCLE_LENGTH ? todayISO : startDate;
    const selected = parseISO(selectedDate);

    return {
      startDate,
      completed: new Set(Array.isArray(saved.completed) ? saved.completed.filter(isValidISODate) : []),
      selectedDate,
      viewMonth: new Date(selected.getFullYear(), selected.getMonth(), 1, 12)
    };
  } catch {
    return fallback;
  }
}

const state = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      startDate: state.startDate,
      completed: [...state.completed]
    }));
  } catch {
    showToast('Не удалось сохранить отметку в браузере');
  }
}

function getPlanForDate(iso) {
  const offset = dayDifference(state.startDate, iso);
  if (offset < 0 || offset >= CYCLE_LENGTH) return null;
  const dayIndex = offset % 7;
  const week = Math.floor(offset / 7) + 1;
  const workout = schedule[dayIndex];
  return {
    ...workout,
    dayIndex,
    dayNumber: offset + 1,
    week,
    volume: workout.volumes[week - 1],
    rest: dayIndex === 6
  };
}

function cycleDates() {
  return Array.from({ length: CYCLE_LENGTH }, (_, index) => toISO(addDays(parseISO(state.startDate), index)));
}

function calculateStats() {
  const dates = cycleDates();
  const completed = dates.filter(date => state.completed.has(date)).length;
  let bestStreak = 0;
  let currentStreak = 0;

  dates.forEach(date => {
    if (state.completed.has(date)) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return {
    completed,
    bestStreak,
    percent: Math.round((completed / CYCLE_LENGTH) * 100)
  };
}

function completionButton(date, id) {
  const complete = state.completed.has(date);
  const plan = getPlanForDate(date);
  const label = complete
    ? 'Выполнено — снять отметку'
    : plan?.rest ? 'Отметить день отдыха' : 'Отметить выполненным';
  return `<button type="button" id="${id}" class="primary-button${complete ? ' is-complete' : ''}" data-complete-date="${date}">${label}</button>`;
}

function renderStats() {
  const stats = calculateStats();
  document.getElementById('completed-stat').innerHTML = `${stats.completed}<span>/28</span>`;
  document.getElementById('streak-stat').textContent = stats.bestStreak;
  document.getElementById('percent-stat').textContent = `${stats.percent}%`;
  document.getElementById('progress-fill').style.transform = `scaleX(${stats.percent / 100})`;
}

function renderToday() {
  const container = document.getElementById('today-card');
  const plan = getPlanForDate(todayISO);

  if (!plan) {
    const beforeStart = dayDifference(state.startDate, todayISO) < 0;
    container.innerHTML = `
      <div class="card-date"><span>${formatShortDate(todayISO)}</span><span>${beforeStart ? 'До старта' : 'Цикл завершён'}</span></div>
      <div class="today-empty">
        <h2>${beforeStart ? 'План ещё впереди' : '28 дней позади'}</h2>
        <p>${beforeStart ? 'Сегодня занятие не назначено. Дату начала можно изменить выше или открыть календарь, чтобы посмотреть программу.' : 'Проверьте прогресс в календаре. Новый цикл можно начать, изменив дату старта.'}</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="card-date"><span>${formatShortDate(todayISO)}</span><span>День ${plan.dayNumber} · Неделя ${plan.week}</span></div>
    <h2>${plan.title}</h2>
    <p class="card-description">${plan.description}</p>
    <div class="card-meta"><span>${plan.type}</span><span>${plan.duration}</span><span>${plan.volume}</span></div>
    <ul class="today-exercises">
      ${plan.exercises.slice(0, 4).map((exercise, index) => `<li><span>0${index + 1}</span>${exercise}</li>`).join('')}
    </ul>
    ${completionButton(todayISO, 'toggle-today')}`;
}

function renderCalendar() {
  const focusedDate = document.activeElement?.dataset?.date;
  const year = state.viewMonth.getFullYear();
  const month = state.viewMonth.getMonth();
  const firstDay = new Date(year, month, 1, 12);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -mondayOffset);

  document.getElementById('month-title').textContent = new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric'
  }).format(firstDay);

  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    const iso = toISO(date);
    const plan = getPlanForDate(iso);
    const complete = state.completed.has(iso);
    const classes = [
      'day-cell',
      date.getMonth() !== month ? 'is-outside' : '',
      complete ? 'is-complete' : '',
      iso === todayISO ? 'is-today' : '',
      iso === state.selectedDate ? 'is-selected' : '',
      plan?.rest ? 'is-rest' : ''
    ].filter(Boolean).join(' ');
    const label = `${formatFullDate(iso)}, ${plan ? plan.title : 'вне 28-дневного цикла'}${complete ? ', выполнено' : ''}`;

    return `<button type="button" class="${classes}" data-date="${iso}" aria-label="${label}" aria-pressed="${iso === state.selectedDate}">
      <span class="date-number">${date.getDate()}</span>
      <span class="day-type">${plan ? plan.title : ''}</span>
      <span class="day-number">${plan ? `День ${plan.dayNumber}` : ''}</span>
    </button>`;
  });

  document.getElementById('calendar-grid').innerHTML = cells.join('');

  if (focusedDate) {
    const replacement = document.querySelector(`.day-cell[data-date="${focusedDate}"]`);
    replacement?.focus({ preventScroll: true });
  }
}

function renderDayDetails() {
  const container = document.getElementById('day-details');
  const iso = state.selectedDate;
  const plan = getPlanForDate(iso);

  if (!plan) {
    container.innerHTML = `
      <div class="detail-topline"><span>${formatFullDate(iso)}</span><span>Вне цикла</span></div>
      <div class="detail-empty">
        <h3>Свободный день</h3>
        <p>Эта дата находится за пределами выбранного 28-дневного цикла. Измените дату старта или выберите день с назначенным занятием.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="detail-topline"><span>${formatFullDate(iso)}</span><span>${state.completed.has(iso) ? 'Выполнено' : `День ${plan.dayNumber} / 28`}</span></div>
    <h3>${plan.title}</h3>
    <p class="detail-description">${plan.description}</p>
    <div class="detail-rounds">Неделя ${plan.week} · ${plan.volume} · ${plan.duration}</div>
    <ul class="detail-list">${plan.exercises.map(exercise => `<li>${exercise}</li>`).join('')}</ul>
    ${completionButton(iso, 'toggle-selected')}`;
}

function renderAll() {
  document.getElementById('start-date').value = state.startDate;
  renderStats();
  renderToday();
  renderCalendar();
  renderDayDetails();
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function toggleCompletion(date, sourceId) {
  if (!getPlanForDate(date)) return;
  const wasComplete = state.completed.has(date);
  if (wasComplete) {
    state.completed.delete(date);
  } else {
    state.completed.add(date);
  }
  saveState();
  renderAll();
  showToast(wasComplete ? 'Отметка снята' : 'Отлично! День отмечен');
  document.getElementById(sourceId)?.focus({ preventScroll: true });
}

document.getElementById('start-date').addEventListener('change', event => {
  const value = event.target.value;
  if (!isValidISODate(value)) {
    event.target.value = state.startDate;
    showToast('Выберите корректную дату');
    return;
  }
  state.startDate = value;
  state.selectedDate = value;
  const start = parseISO(value);
  state.viewMonth = new Date(start.getFullYear(), start.getMonth(), 1, 12);
  saveState();
  renderAll();
  showToast('Дата старта обновлена');
});

document.getElementById('prev-month').addEventListener('click', () => {
  state.viewMonth = new Date(state.viewMonth.getFullYear(), state.viewMonth.getMonth() - 1, 1, 12);
  renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  state.viewMonth = new Date(state.viewMonth.getFullYear(), state.viewMonth.getMonth() + 1, 1, 12);
  renderCalendar();
});

document.getElementById('calendar-grid').addEventListener('click', event => {
  const button = event.target.closest('.day-cell');
  if (!button) return;
  const iso = button.dataset.date;
  state.selectedDate = iso;
  const date = parseISO(iso);
  if (date.getMonth() !== state.viewMonth.getMonth() || date.getFullYear() !== state.viewMonth.getFullYear()) {
    state.viewMonth = new Date(date.getFullYear(), date.getMonth(), 1, 12);
  }
  renderCalendar();
  renderDayDetails();
  document.querySelector(`.day-cell[data-date="${iso}"]`)?.focus({ preventScroll: true });
});

document.addEventListener('click', event => {
  const button = event.target.closest('[data-complete-date]');
  if (!button) return;
  toggleCompletion(button.dataset.completeDate, button.id);
});

const resetDialog = document.getElementById('reset-dialog');
document.getElementById('reset-progress').addEventListener('click', () => resetDialog.showModal());
document.getElementById('cancel-reset').addEventListener('click', () => resetDialog.close());
document.getElementById('confirm-reset').addEventListener('click', () => {
  state.completed.clear();
  saveState();
  renderAll();
  resetDialog.close();
  showToast('Все отметки сброшены');
  document.getElementById('reset-progress').focus({ preventScroll: true });
});

let scrollTicking = false;
function updateScrollIndicator() {
  const rail = document.querySelector('.scroll-rail');
  const dot = document.getElementById('scroll-dot');
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  const travel = Math.max(0, rail.clientHeight - dot.offsetHeight);
  dot.style.transform = `translateY(${progress * travel}px)`;
  scrollTicking = false;
}

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateScrollIndicator);
    scrollTicking = true;
  }
}, { passive: true });
window.addEventListener('resize', updateScrollIndicator);

renderAll();
updateScrollIndicator();
