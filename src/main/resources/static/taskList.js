function openUpdateDialog(button) {
    const row = button.closest('tr'); // 一番近い <tr> を取得。<tr>を繰り返しで表示している為
    const cells = row.cells; // row.cells：<tr>の要素を配列風に取得できる

    const id = cells[0].textContent.trim(); // <tr>の1つ目の<td>
    const title = cells[1].textContent.trim(); // <tr>の2つ目の<td>
    const detail = cells[2].textContent.trim();
    const deadline = cells[3].textContent.trim();
    const time = cells[4].textContent.trim();
    const priority = cells[5].textContent.trim();
    const statusText = cells[6].textContent.trim();

    document.getElementById('update_id').value = id;
    document.getElementById('update_title').value = title;
    document.getElementById('update_detail').value = detail
    document.getElementById('update_deadline').value = deadline;
    document.getElementById('update_time').value = time;
    document.getElementById('update_priority').value = priority;
    document.getElementById('update_status').selectedIndex = (statusText === '完了') ? 1 : 0; // statusText が文字列 '完了' ならインデックス1を選択、それ以外は0を選択

    const dialog = document.getElementById('updateDialog');
    // dialog.style.left = ((window.innerWidth - 500) / 2) + 'px'; // window.innerWidth：ブラウザ画面の幅
    dialog.style.display = 'block';
}
function openTodoDialog(button) {
    // const row = button.closest('tr'); // 一番近い <tr> を取得。<tr>を繰り返しで表示している為
    // const cells = row.cells; // row.cells：<tr>の要素を配列風に取得できる

    // const id = cells[0].textContent.trim(); // <tr>の1つ目の<td>
    // const title = cells[1].textContent.trim(); // <tr>の2つ目の<td>
    // const detail = cells[2].textContent.trim();
    // const deadline = cells[3].textContent.trim();
    // const time = cells[4].textContent.trim();
    // const priority = cells[5].textContent.trim();
    // const statusText = cells[6].textContent.trim();

    // document.getElementById('update_id').value = id;
    // document.getElementById('update_title').value = title;
    // document.getElementById('update_detail').value = detail
    // document.getElementById('update_deadline').value = deadline;
    // document.getElementById('update_time').value = time;
    // document.getElementById('update_priority').value = priority;
    // document.getElementById('update_status').selectedIndex = (statusText === '完了') ? 1 : 0; // statusText が文字列 '完了' ならインデックス1を選択、それ以外は0を選択

    const dialog = document.getElementById('TodoDialog');
    // dialog.style.left = ((window.innerWidth - 500) / 2) + 'px'; // window.innerWidth：ブラウザ画面の幅
    dialog.style.display = 'block';
}

