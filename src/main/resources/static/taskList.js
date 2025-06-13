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