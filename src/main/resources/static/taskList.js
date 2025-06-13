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

// 今日の日付を初期値設定
window.onload = function(){
    var getToday = new Date();
    var y = getToday.getFullYear();
    var m = getToday.getMonth() + 1;
    var d = getToday.getDate();
    var today = y + "-" + m.toString().padStart(2,'0') + "-" + d.toString().padStart(2,'0');
    document.getElementById("add_deadline").setAttribute("value",today);
}

// 既存の openTodoDialog／openUpdateDialog はそのまま

// ページ読み込み後に実行
window.addEventListener('DOMContentLoaded', () => {
  // 今日の日付を add_deadline にセット（既存コード）
  const getToday = new Date();
  const y = getToday.getFullYear();
  const m = String(getToday.getMonth() + 1).padStart(2, '0');
  const d = String(getToday.getDate()).padStart(2, '0');
  document.getElementById("add_deadline").value = `${y}-${m}-${d}`;

  // タスク要素に色付け
  document.querySelectorAll('.today-item, .tasklist tr[data-deadline-date]').forEach(item => {
    const dateStr = item.dataset.deadlineDate;
    const timeStr = item.dataset.deadlineTime || '00:00';
    const deadline = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    const diffMinutes = (deadline - now) / 1000 / 60;

    if (diffMinutes < 0) {
      item.classList.add('expired');
    } else if (diffMinutes <= 60) {
      item.classList.add('soon');
    }
  });
});

// 1秒ごとに時計を更新する
function startClock() {
  const clockEl = document.getElementById('clock');
  if (!clockEl) return;

  function update() {

    const now = new Date();
    // ── 月日部分を作成
    const month = now.getMonth() + 1;
    const day   = now.getDate();
    const days  = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = days[now.getDay()];
    document.getElementById('taskDate').textContent = `${month}月${day}日(${weekday})のタスク`;

    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}時${m}分${s}秒`;
  }

  update();                             // 初回呼び出し
  setInterval(update, 1000);            // 以降1秒ごと
}

// 他の onload ハンドラと衝突しないように
window.addEventListener('DOMContentLoaded', () => {
  // 既存の初期化処理
  // ...（add_deadline 設定や色付け処理など）

  // 時計スタート
  startClock();
});