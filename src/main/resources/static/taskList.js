function openTodoDialog(button) {
    const dialog = document.getElementById('TodoDialog');
    dialog.style.display = 'block';
}



function openUpdateDialog(button) {
  // button.dataset なら data-* 属性がすべて取れる
  const id       = button.dataset.id;
  const title    = button.dataset.title ?? '';
  const detail   = button.dataset.detail  ?? '';
  const deadline = button.dataset.deadline ?? '';
  const time     = button.dataset.time ?? '';
  const priority = button.dataset.priority ?? '';
  const done     = button.dataset.done === 'true';

  document.getElementById('update_id').value       = id;
  document.getElementById('update_title').value    = title;
  document.getElementById('update_detail').value   = detail;
  document.getElementById('update_deadline').value = deadline;
  document.getElementById('update_time').value     = time;
  document.getElementById('update_priority').value = priority;
  document.getElementById('update_status').selectedIndex = done ? 1 : 0;

  document.getElementById('updateDialog').style.display = 'block';
}

// 現在時刻の初期値設定
window.onload = function(){
    var getToday = new Date();
    var y = getToday.getFullYear();
    var m = getToday.getMonth() + 1;
    var d = getToday.getDate();
    var today = y + "-" + m.toString().padStart(2,'0') + "-" + d.toString().padStart(2,'0');
    document.getElementById("add_deadline").setAttribute("value",today);
}
//値の保持
let currentDateFilter = {
  years: [],
  months: [],
  days: []
};

let currentPriorityFilter = [];

function applyFilters() {
  const rows = document.querySelectorAll('#taskTable tbody tr');

  rows.forEach(row => {
    // 期限判定
    const deadline = row.cells[3].textContent.trim();
    let dateMatch = false;
    if (!deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
      dateMatch = false;
    } else {
      const [y, m, d] = deadline.split('-');
      const yearOk = currentDateFilter.years.length === 0 || currentDateFilter.years.includes(y);
      const monthOk = currentDateFilter.months.length === 0 || currentDateFilter.months.includes(m);
      const dayOk = currentDateFilter.days.length === 0 || currentDateFilter.days.includes(d);
      dateMatch = yearOk && monthOk && dayOk;
    }

    // 優先度判定
    const priority = row.cells[5].textContent.trim();
    const priorityMatch = currentPriorityFilter.length === 0 || currentPriorityFilter.includes(priority);

    // 両方を満たす場合に表示
    if (dateMatch && priorityMatch) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// 他の onload ハンドラと衝突しないように
window.addEventListener('DOMContentLoaded', () => {
  // 既存の初期化処理
  // ...（add_deadline 設定や色付け処理など）

  // 時計スタート
  startClock();
});

// ↓期限フィルター
function getUniqueDates() {
  const rows = document.querySelectorAll('#taskTable tbody tr');
  const years = new Set();
  const months = new Set();
  const days = new Set();

  rows.forEach(row => {
    const deadline = row.cells[3].textContent.trim();
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

// ポップアップ開く時にチェックボックスを生成する（ボタンのイベントに追加）
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

// 絞り込み実行（チェックボックス版）
document.getElementById('applyCheckboxFilterBtn').addEventListener('click', () => {
  currentDateFilter.years = Array.from(document.querySelectorAll('input[name=year]:checked')).map(cb => cb.value);
  currentDateFilter.months = Array.from(document.querySelectorAll('input[name=month]:checked')).map(cb => cb.value);
  currentDateFilter.days = Array.from(document.querySelectorAll('input[name=day]:checked')).map(cb => cb.value);

  applyFilters();

  //closeDateFilterPopup(); //必要なら有効化
});

// クリアボタン（チェック外して全表示）
document.getElementById('clearCheckboxFilterBtn').addEventListener('click', () => {
  ['year', 'month', 'day'].forEach(name => {
    document.querySelectorAll(`input[name=${name}]`).forEach(cb => cb.checked = false);
  });

  currentDateFilter = { years: [], months: [], days: [] };

  applyFilters();

  //closeDateFilterPopup(); //必要なら有効化
});

// ポップアップ閉じる関数
function closeDateFilterPopup() {
  document.getElementById('dateFilterPopup').style.display = 'none';
}

function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // マウス押した時
  el.addEventListener('mousedown', (e) => {
  isDragging = true;

  // transformを外す
  //el.style.transform = 'none';

  // 現在のポップアップの中央表示のleftは50%なので、
  // transform分の横幅の半分を足してピクセル位置に直す
  const rect = el.getBoundingClientRect();

  // 親要素のビューポート左端からの距離にtransform補正分を加算
  const computedStyle = window.getComputedStyle(el);
  const width = parseFloat(computedStyle.width);
  const leftPx = rect.left;

  // ここで transform: translateX(-50%) は横幅の半分ずらしてるので、
  // 左端のピクセル位置は rect.left + (width / 2)
  // だけどrect.leftはすでにビューポート左からの位置なので、そのままでOK

  el.style.left = leftPx + 'px';
  el.style.top = rect.top + 'px';
  el.style.position = 'fixed';

  offsetX = e.clientX - leftPx;
  offsetY = e.clientY - rect.top;

  document.body.style.userSelect = 'none';
});

  // マウス動いた時
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // ウィンドウの外にはみ出ないよう制限（必要に応じて調整）
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.position = 'fixed'; // 必ず固定表示
  });

  // マウス離した時
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = ''; // 選択禁止解除
    }
  });
}

// ポップアップのドラッグ有効化（ページ読み込み時などに呼ぶ）
window.addEventListener('load', () => {
  const popup = document.getElementById('dateFilterPopup');
  makeDraggable(popup);
});
// ↑期限フィルター
//↓優先度フィルター
// 優先度一覧
const priorities = ['高', '中', '低'];

function closePriorityFilterPopup() {
  document.getElementById('priorityFilterPopup').style.display = 'none';
}

// 優先度フィルターのポップアップを開く処理
document.getElementById('filterPriorityBtn').addEventListener('click', () => {
  const popup = document.getElementById('priorityFilterPopup');

  if (popup.style.display === 'none' || popup.style.display === '') {
    // チェックボックス生成
    createCheckboxList('priorityFilterContainer', priorities, 'priority');

    // ポップアップ位置調整（ボタンのすぐ下に表示）
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

// 絞り込み実行ボタン
document.getElementById('applyPriorityFilterBtn').addEventListener('click', () => {
  currentPriorityFilter = Array.from(document.querySelectorAll('input[name=priority]:checked')).map(cb => cb.value);

  applyFilters();

  //closePriorityFilterPopup(); //必要なら有効化
});

// クリアボタン
document.getElementById('clearPriorityFilterBtn').addEventListener('click', () => {
  document.querySelectorAll('input[name=priority]').forEach(cb => cb.checked = false);

  currentPriorityFilter = [];

  applyFilters();

  //closePriorityFilterPopup(); //必要なら有効化
});


window.addEventListener('load', () => {
  const priorityPopup = document.getElementById('priorityFilterPopup');
  makeDraggable(priorityPopup);
});
// 完了未完了フィルター
let currentStatusFilter = []; // '完了' or '未完了'

// チェックボックス自動生成（createCheckboxListは共通のを使う）
const statuses = ['完了', '未完了'];

// ポップアップ開く
document.getElementById('filterDoneBtn').addEventListener('click', () => {
  const popup = document.getElementById('statusFilterPopup');

  if (popup.style.display === 'none' || popup.style.display === '') {
    createCheckboxList('statusFilterContainer', statuses, 'status');

    // ボタン位置にポップアップ表示
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

// 絞り込み実行
document.getElementById('applyStatusFilterBtn').addEventListener('click', () => {
  currentStatusFilter = Array.from(document.querySelectorAll('input[name=status]:checked')).map(cb => cb.value);
  applyFilters();
});

// クリアボタン
document.getElementById('clearStatusFilterBtn').addEventListener('click', () => {
  document.querySelectorAll('input[name=status]').forEach(cb => cb.checked = false);
  currentStatusFilter = [];
  applyFilters();
});

function closeStatusFilterPopup() {
  document.getElementById('statusFilterPopup').style.display = 'none';
}

// ドラッグ対応
window.addEventListener('load', () => {
  const popup = document.getElementById('statusFilterPopup');
  makeDraggable(popup);
});

function applyFilters() {
  const rows = document.querySelectorAll('#taskTable tbody tr');

  rows.forEach(row => {
    const deadline = row.cells[3].textContent.trim();
    const priority = row.cells[5].textContent.trim();
    const status = row.cells[6].textContent.trim(); // 完了 or 未完了

    // 期限判定
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

function openDetailDialogFromTitle(tdElement) {
  const row = tdElement.closest('tr');

  const title = row.cells[1].textContent.trim();  // タスク名（2列目）
  const detail = row.cells[2].textContent.trim(); // 詳細（3列目）
  const deadline = row.cells[3].textContent.trim(); // 期限（4列目）

  document.getElementById('detailTitle').textContent = title;
  document.getElementById('detailDeadline').textContent = deadline;
  document.getElementById('detailContent').textContent = detail;

  document.getElementById('detailPopup').style.display = 'block';
}