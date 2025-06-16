// 詳細ポップアップを開く
function openDetailDialogFromTitle(tdElement) {
  const row = tdElement.closest('tr');

  const title = row.cells[2].textContent.trim();
  const detail = row.cells[3].textContent.trim();
  const deadline = row.cells[4].textContent.trim();

  document.getElementById('detailTitle').textContent = title;
  document.getElementById('detailDeadline').textContent = deadline;
  document.getElementById('detailContent').textContent = detail;

  document.getElementById('detailPopup').style.display = 'block';
}

// 値の保持
let currentDateFilter = {
  years: [],
  months: [],
  days: []
};

let currentPriorityFilter = [];

let currentStatusFilter = []; // '完了' or '未完了'

//フィルター
function applyFilters() {
  const rows = document.querySelectorAll('#taskTable tbody tr');

  rows.forEach(row => {
    const deadline = row.cells[4].textContent.trim(); // 期限は5列目(index=4)
    const priority = row.cells[6].textContent.trim(); // 優先度は7列目(index=6)
    const status = row.cells[7].textContent.trim();   // 状態は8列目(index=7)

    let dateMatch = false;
    if (deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [y, m, d] = deadline.split('-');
      const yearOk = currentDateFilter.years.length === 0 || currentDateFilter.years.includes(y);
      const monthOk = currentDateFilter.months.length === 0 || currentDateFilter.months.includes(m);
      const dayOk = currentDateFilter.days.length === 0 || currentDateFilter.days.includes(d);
      dateMatch = yearOk && monthOk && dayOk;
    }

    const priorityMatch = currentPriorityFilter.length === 0 || currentPriorityFilter.includes(priority);
    const statusMatch = currentStatusFilter.length === 0 || currentStatusFilter.includes(status);

    row.style.display = (dateMatch && priorityMatch && statusMatch) ? '' : 'none';
  });
}

// 期限フィルター用ユニーク日付取得
function getUniqueDates() {
  const rows = document.querySelectorAll('#taskTable tbody tr');
  const years = new Set();
  const months = new Set();
  const days = new Set();

  rows.forEach(row => {
    const deadline = row.cells[4].textContent.trim();  // 期限は5列目（index=4）
    if (!deadline.match(/^\d{4}-\d{2}-\d{2}$/)) return;
    const [y, m, d] = deadline.split('-');
    years.add(y);
    months.add(m);
    days.add(d);
  });

  return {
    years: Array.from(years).sort(),
    months: Array.from(months).sort(),
    days: Array.from(days).sort(),
  };
}

// チェックボックスを自動生成
function createCheckboxList(containerId, values, namePrefix) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // クリア

  values.forEach(value => {
    const id = `${namePrefix}_${value}`;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.style.marginRight = '10px';
    label.style.cursor = 'pointer';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.name = namePrefix;
    checkbox.value = value;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(value));
    container.appendChild(label);
  });
}

// 期限フィルター用ポップアップ表示切替
document.getElementById('filterDateBtn').addEventListener('click', () => {
  const popup = document.getElementById('dateFilterPopup');
  const btn = document.getElementById('filterDateBtn');

  if (popup.style.display === 'none' || popup.style.display === '') {
    const { years, months, days } = getUniqueDates();
    createCheckboxList('yearFilterContainer', years, 'year');
    createCheckboxList('monthFilterContainer', months, 'month');
    createCheckboxList('dayFilterContainer', days, 'day');

    const rect = btn.getBoundingClientRect();
    popup.style.position = 'absolute';
    popup.style.top = (rect.bottom + window.scrollY) + 'px';
    popup.style.left = (rect.left + window.scrollX) + 'px';

    popup.style.display = 'block';
  } else {
    popup.style.display = 'none';
  }
});

// 期限フィルター適用
document.getElementById('applyCheckboxFilterBtn').addEventListener('click', () => {
  currentDateFilter.years = Array.from(document.querySelectorAll('input[name=year]:checked')).map(cb => cb.value);
  currentDateFilter.months = Array.from(document.querySelectorAll('input[name=month]:checked')).map(cb => cb.value);
  currentDateFilter.days = Array.from(document.querySelectorAll('input[name=day]:checked')).map(cb => cb.value);

  applyFilters();
  //closeDateFilterPopup();
});

// 期限フィルタークリア
document.getElementById('clearCheckboxFilterBtn').addEventListener('click', () => {
  ['year', 'month', 'day'].forEach(name => {
    document.querySelectorAll(`input[name=${name}]`).forEach(cb => cb.checked = false);
  });

  currentDateFilter = { years: [], months: [], days: [] };
  applyFilters();
  //closeDateFilterPopup();
});

function closeDateFilterPopup() {
  document.getElementById('dateFilterPopup').style.display = 'none';
}

// ドラッグ対応関数（共通）
function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  el.addEventListener('mousedown', (e) => {
    isDragging = true;

    const rect = el.getBoundingClientRect();

    el.style.left = rect.left + 'px';
    el.style.top = rect.top + 'px';
    el.style.position = 'fixed';

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.position = 'fixed';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
    }
  });
}

// ページロード時にドラッグ有効化
window.addEventListener('load', () => {
  ['dateFilterPopup', 'priorityFilterPopup', 'statusFilterPopup'].forEach(id => {
    const popup = document.getElementById(id);
    if (popup) makeDraggable(popup);
  });
});

// 優先度フィルター設定
const priorities = ['高', '中', '低'];

function closePriorityFilterPopup() {
  document.getElementById('priorityFilterPopup').style.display = 'none';
}

document.getElementById('filterPriorityBtn').addEventListener('click', () => {
  const popup = document.getElementById('priorityFilterPopup');

  if (popup.style.display === 'none' || popup.style.display === '') {
    createCheckboxList('priorityFilterContainer', priorities, 'priority');

    const btn = document.getElementById('filterPriorityBtn');
    const rect = btn.getBoundingClientRect();
    popup.style.position = 'absolute';
    popup.style.top = (rect.bottom + window.scrollY) + 'px';
    popup.style.left = (rect.left + window.scrollX) + 'px';

    popup.style.display = 'block';
  } else {
    popup.style.display = 'none';
  }
});

document.getElementById('applyPriorityFilterBtn').addEventListener('click', () => {
  currentPriorityFilter = Array.from(document.querySelectorAll('input[name=priority]:checked')).map(cb => cb.value);
  applyFilters();
  //closePriorityFilterPopup();
});

document.getElementById('clearPriorityFilterBtn').addEventListener('click', () => {
  document.querySelectorAll('input[name=priority]').forEach(cb => cb.checked = false);
  currentPriorityFilter = [];
  applyFilters();
  //closePriorityFilterPopup();
});

// 状態フィルター設定
const statuses = ['完了', '未完了'];

function closeStatusFilterPopup() {
  document.getElementById('statusFilterPopup').style.display = 'none';
}

document.getElementById('filterDoneBtn').addEventListener('click', () => {
  const popup = document.getElementById('statusFilterPopup');

  if (popup.style.display === 'none' || popup.style.display === '') {
    createCheckboxList('statusFilterContainer', statuses, 'status');

    const btn = document.getElementById('filterDoneBtn');
    const rect = btn.getBoundingClientRect();
    popup.style.position = 'absolute';
    popup.style.top = (rect.bottom + window.scrollY) + 'px';
    popup.style.left = (rect.left + window.scrollX) + 'px';

    popup.style.display = 'block';
  } else {
    popup.style.display = 'none';
  }
});

document.getElementById('applyStatusFilterBtn').addEventListener('click', () => {
  currentStatusFilter = Array.from(document.querySelectorAll('input[name=status]:checked')).map(cb => cb.value);
  applyFilters();
});

document.getElementById('clearStatusFilterBtn').addEventListener('click', () => {
  document.querySelectorAll('input[name=status]').forEach(cb => cb.checked = false);
  currentStatusFilter = [];
  applyFilters();
});
