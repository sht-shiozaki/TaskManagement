// 詳細ポップアップを開く処理
function openDetailDialogFromTitle(tdElement) {//tdElementはクリックされたセル（<td>）要素を表す
  const row = tdElement.closest('tr');//セルが属している行全体を取得

  const title = row.cells[2].textContent.trim();// タイトルを取得
  const detail = row.cells[3].textContent.trim();// 詳細を取得
  const deadline = row.cells[4].textContent.trim();// 期日を取得

  document.getElementById('detailTitle').textContent = title;// htmlのid名(()の中身)にセット
  document.getElementById('detailDeadline').textContent = deadline;
  document.getElementById('detailContent').textContent = detail;

  document.getElementById('detailModal').style.display = 'flex';
  document.getElementById('detailPopup').style.display = 'block';// popで表示
}

// フィルターの選択された値を保持の処理
let currentDateFilter = {//年月日
  years: [],
  months: [],
  days: []
};

let currentPriorityFilter = [];// 高中低

let currentStatusFilter = []; // '完了' or '未完了'

//フィルターの一致で表示、不一致で非表示の処理
function applyFilters() {
  const rows = document.querySelectorAll('#taskTable tbody tr');// #taskTableの中のすべての行（<tr>）を取得。これがフィルターの対象。

  rows.forEach(row => {
    const deadline = row.cells[4].textContent.trim(); // 期限は5列目(index=4)
    const priority = row.cells[6].textContent.trim(); // 優先度は7列目(index=6)
    const status = row.cells[7].textContent.trim();   // 状態は8列目(index=7)

    let dateMatch = false;
    if (deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {// deadlineを 年・月・日 に分割
      const [y, m, d] = deadline.split('-');// ↓一致するかチェック。条件が何も選ばれていない（length === 0）場合は「すべて通す」
      const yearOk = currentDateFilter.years.length === 0 || currentDateFilter.years.includes(y);
      const monthOk = currentDateFilter.months.length === 0 || currentDateFilter.months.includes(m);
      const dayOk = currentDateFilter.days.length === 0 || currentDateFilter.days.includes(d);
      dateMatch = yearOk && monthOk && dayOk;
    }
    // 優先度、状態の一致チェック
    const priorityMatch = currentPriorityFilter.length === 0 || currentPriorityFilter.includes(priority);
    const statusMatch = currentStatusFilter.length === 0 || currentStatusFilter.includes(status);
    // 3つの条件が一致でその行を表示。無ければ非表示。
    row.style.display = (dateMatch && priorityMatch && statusMatch) ? '' : 'none';
  });
}

// 期限フィルター用ユニーク日付取得の処理
function getUniqueDates() {
  const rows = document.querySelectorAll('#taskTable tbody tr');// タスク一覧を取得
  const years = new Set();//「Set」はJSのデータ構造で重複を自動的に除いてくれる配列のようなもの。同じ年月日が何回出てきても1回のみ登録。
  const months = new Set();
  const days = new Set();

  rows.forEach(row => {
    const deadline = row.cells[4].textContent.trim();// 期限は5列目（index=4）
    if (!deadline.match(/^\d{4}-\d{2}-\d{2}$/)) return;// yyyy-mm-dd形式でないものはスキップ
    const [y, m, d] = deadline.split('-');// 文字列を分割して年・月・日に
    years.add(y);
    months.add(m);
    days.add(d);
  });

  return {//SetからArrayに変換して（Array.from(...)）小さい順に並び替えて返す（sort()）
    years: Array.from(years).sort(),
    months: Array.from(months).sort(),
    days: Array.from(days).sort(),
  };
}

// チェックボックスを自動生成の処理
function createCheckboxList(containerId, values, namePrefix, selectedValues = []) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // 前回のチェックボックスの中身を空にしてリセット

  values.forEach(value => { // ループ。(values = ['2024', '2025']なら２回転)
    const id = `${namePrefix}_${value}`; // 例: year_2024

    const label = document.createElement('label'); // <label> を作成
    label.htmlFor = id; // htmlFor にチェックボックスのIDを設定すると、ラベルクリックでチェックが入る
    label.style.marginRight = '10px';
    label.style.cursor = 'pointer';

    const checkbox = document.createElement('input'); // チェックボックス生成
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.name = namePrefix;
    checkbox.value = value;

    // 既にチェックされていた値があれば復元する
    if (selectedValues.includes(value)) {
      checkbox.checked = true;
    }

    label.appendChild(checkbox); // チェックボックスを追加
    label.appendChild(document.createTextNode(value)); // 「2024」などの文字を追加
    container.appendChild(label); // すべてを container に追加
  });
}

// 期限フィルター用ポップアップ表示切替の処理
document.getElementById('filterDateBtn').addEventListener('click', () => {
  const popup = document.getElementById('dateFilterPopup');
  const btn = document.getElementById('filterDateBtn');
  const rect = btn.getBoundingClientRect();
  // 年、月、日のチェックボックスリストを生成し配置
  if (popup.style.display === 'none' || popup.style.display === '') {
    const { years, months, days } = getUniqueDates();
    createCheckboxList('yearFilterContainer', years, 'year', currentDateFilter.years);
    createCheckboxList('monthFilterContainer', months, 'month', currentDateFilter.months);
    createCheckboxList('dayFilterContainer', days, 'day', currentDateFilter.days);


  popup.style.position = 'absolute';// 絶対位置に設定
  popup.style.display = 'block';
  popup.style.left = `${rect.left + window.scrollX}px`;// 左端はボタンの左端に合わせる
  const popupHeight = popup.offsetHeight;// ポップアップの高さを取得
  popup.style.top = `${rect.top + window.scrollY - popupHeight}px`;// ボタンの上に出す

  } else {
    popup.style.display = 'none';// ポップアップが表示中なら非表示にする
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
  const btn = document.getElementById('filterPriorityBtn');
  const rect = btn.getBoundingClientRect();// ←ボタンの位置を取得

  if (popup.style.display === 'none' || popup.style.display === '') {
    createCheckboxList('priorityFilterContainer', priorities, 'priority', currentPriorityFilter);

    popup.style.position = 'absolute';
    popup.style.display = 'block';
    popup.style.left = `${rect.left + window.scrollX}px`;
    const popupHeight = popup.offsetHeight;
    popup.style.top = `${rect.top + window.scrollY - popupHeight}px`; 

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
  const btn = document.getElementById('filterDoneBtn');
  const rect = btn.getBoundingClientRect();

  if (popup.style.display === 'none' || popup.style.display === '') {
    createCheckboxList('statusFilterContainer', statuses, 'status', currentStatusFilter);

    popup.style.position = 'absolute';
    popup.style.display = 'block';
    popup.style.left = `${rect.left + window.scrollX}px`;
    const popupHeight = popup.offsetHeight;
    popup.style.top = `${rect.top + window.scrollY - popupHeight}px`;

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

//フィルターリセット
document.getElementById('clearAllFiltersBtn').addEventListener('click', () => {
  // 期限フィルタークリア
  ['year', 'month', 'day'].forEach(name => {
    document.querySelectorAll(`input[name=${name}]`).forEach(cb => cb.checked = false);
  });
  currentDateFilter = { years: [], months: [], days: [] };

  // 優先度フィルタークリア
  document.querySelectorAll('input[name=priority]').forEach(cb => cb.checked = false);
  currentPriorityFilter = [];

  // 状態フィルタークリア
  document.querySelectorAll('input[name=status]').forEach(cb => cb.checked = false);
  currentStatusFilter = [];

  // フィルター適用（すべてクリア状態で全表示）
  applyFilters();
});
