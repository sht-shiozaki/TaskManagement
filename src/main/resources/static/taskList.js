//詳細pop
function openDetailDialogFromTitle(tdElem) {
    const row = tdElem.parentElement;
    const title = tdElem.textContent.trim();
    const deadline = row.cells[3].textContent.trim();// 3番目のセルに期限が入っている
    const detail = row.cells[2].textContent.trim(); // 2番目のセルに詳細が入っている

    const popup = document.getElementById('detailPopup');
    document.getElementById('detailTitle').textContent = title;
    document.getElementById('detailDeadline').textContent = deadline;
    document.getElementById('detailContent').textContent = detail;

    popup.style.display = 'block';
}

function closeDateFilterPopup() {
  document.getElementById('dateFilterPopup').style.display = 'none';
}


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

// ↓期限フィルター
document.getElementById('filterDateBtn').addEventListener('click', () => {// ボタン押下で表示切替
    const popup = document.getElementById('dateFilterPopup');
    popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
});
// 絞り込み実行
document.getElementById('applyDateFilterBtn').addEventListener('click', () => {
    const year = document.getElementById('filterYear').value;
    let month = document.getElementById('filterMonth').value;
    let day = document.getElementById('filterDay').value;

    if(month) month = month.padStart(2, '0');
    if(day) day = day.padStart(2, '0');

  const rows = document.querySelectorAll('#taskTable tbody tr');
  rows.forEach(row => {
    const deadlineText = row.cells[3].textContent.trim(); // 期限は4番目のセル（index=3）

    if (!deadlineText.match(/^\d{4}-\d{2}-\d{2}$/)) {
      row.style.display = 'none';
      return;
    }

    const [dYear, dMonth, dDay] = deadlineText.split('-');

    let show = true;
    if (year && dYear !== year) show = false;
    if (month && dMonth !== month) show = false;
    if (day && dDay !== day) show = false;

    row.style.display = show ? '' : 'none';
  });
});
// フィルタークリア
document.getElementById('clearDateFilterBtn').addEventListener('click', () => {
  document.getElementById('filterYear').value = '';
  document.getElementById('filterMonth').value = '';
  document.getElementById('filterDay').value = '';

  // 全行表示
  const rows = document.querySelectorAll('#taskTable tbody tr');
  rows.forEach(row => row.style.display = '');
});
// ↑期限フィルター