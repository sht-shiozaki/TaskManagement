//色付けのメソッドとチェックボックスの完了未完了表示
function applyRowColor(row) {
    const statusText = row.cells[7].textContent.trim();
    const deadline = row.cells[4].textContent.trim();
    const time = row.cells[5].textContent.trim();

        //完了したタスクのみをグレーアウトする
    if(statusText === '完了') {
        row.style.backgroundColor = 'rgb(136, 136, 136)';
        const checkobox = row.querySelector('input[name="taskCheckbox"]');
        if(checkobox){
            checkobox.checked = true;
        }
        return;
    }
    
    //現在時刻と比較し色分け
    if(deadline && time) { //期限（日付と時間）が存在しているとき
        const taskDateTime = new Date(`${deadline}T${time}`); //期限をDate型に変換
        const now = new Date(); //現在時刻
        
        //期限が過ぎている⇒赤
        if(taskDateTime < now) { 
            row.style.backgroundColor = 'rgb(255, 161, 175)';
            
            //期限の1時間前⇒オレンジ
        }else if((taskDateTime - now) <= 60 * 60 * 1000) {
            row.style.backgroundColor = 'rgb(251, 255, 26)';
            
        }else {
            row.style.backgroundColor = 'white';//通常
        }
        
    }else{
        row.style.backgroundColor = 'white';//日付や時間がない
    }
}

//通常モードと一括選択モードの切り替えボタン
let isBatchMode = false;
const completeSelectedButton = document.getElementById('completeSelectedButton');
const deleteTasks = document.getElementById('deleteTasks');
const checkAllButton = document.getElementById('checkAllButton');

completeSelectedButton.style.visibility = 'hidden'; // 見えないけど位置は保持
deleteTasks.style.visibility = 'hidden';
checkAllButton.style.visibility = 'hidden';
    
document.getElementById('selectList').addEventListener('click',function() {
    if(getComputedStyle(completeSelectedButton).visibility === "visible"){
        completeSelectedButton.style.visibility = 'hidden'; // 見えないけど位置は保持
        deleteTasks.style.visibility = 'hidden';
        checkAllButton.style.visibility = 'hidden';
    }else{
        completeSelectedButton.style.visibility = 'visible'; // 見えないけど位置は保持
        deleteTasks.style.visibility = 'visible';
        checkAllButton.style.visibility = 'visible';
    }       

    
    // isBatchModeを切り替え
    isBatchMode = !isBatchMode;
    
    //チェックボックスのスタイル変化
    switchCheckboxStyle(isBatchMode);
    
    //一括選択モードの切り替え（thisはクリックされたbutton）
    this.textContent = isBatchMode ? '選択解除' : '一括選択モード';
    
    //モード変更の際にすべてのチェックを外す
    document.querySelectorAll('input[name="taskCheckbox"]').forEach(cb => {
        cb.checked = false;
    });
    //通常モードに戻る際に、完了未完了をチェックボックスに反映させる
    if(!isBatchMode){
        const rows = document.querySelectorAll('table tbody tr');
        rows.forEach(applyRowColor); 
    }
});

//モード変換時のチェックボックスの見た目変化
function switchCheckboxStyle(isBatchMode) {
    document.querySelectorAll('input[name="taskCheckbox"]').forEach(cb => {
        const label = cb.closest('label');
        if(label){
            //一括選択モードの時
            if(isBatchMode) {
                label.classList.remove('circle-checkbox');
                
                cb.style.appearance = '';
                cb.style.webkitAppearance = '';
                cb.style.mozAppearance = '';
                return;
                //通常モード
            }else {
                label.classList.add('circle-checkbox');
                
                cb.style.appearance = 'none';
                cb.style.webkitAppearance = 'none';
                cb.style.mozAppearance = 'none';
                return;
            }
        }
    });
}

//全選択ボタン（すべてにチェックをつける）一括選択モードのみ
checkAllButton.addEventListener('click', function() {
    if(!isBatchMode) return; //通常時は機能しない
    
    document.querySelectorAll('input[name="taskCheckbox"]').forEach(cb => {
        cb.checked = true;
    });
});

//チェックボックス一括処理
const completeBtn = document.getElementById('completeSelectedButton');
const deleteBtn = document.getElementById('deleteTasks');
function submitBatchAction(actionUrl) {
    if(isBatchMode){
        const checkedBoxes = document.querySelectorAll('input[name="taskCheckbox"]:checked');
        const ids = Array.from(checkedBoxes).map(cb => cb.value);
    
        if(ids.length === 0) {
            alert("タスクを選択してください");
            return;
        }

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = actionUrl;

        ids.forEach(id => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'ids';
            input.value = id;
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
    }
}

//完了ボタンを押下
completeBtn.addEventListener('click', function(){
    submitBatchAction('/list/complete-selected');
});

//削除ボタンを押下
deleteBtn.addEventListener('click', function(){
    submitBatchAction('/list/delete-selected');
});

//リストの色付け（初回）
document.addEventListener('DOMContentLoaded', function(){
const rows = document.querySelectorAll('table tbody tr');
rows.forEach(applyRowColor);

//チェックボタン押下後即完了処理
document.querySelectorAll('input[name="taskCheckbox"]').forEach(cb => {
    cb.addEventListener('change', function() {
        if(!isBatchMode) {    
            const isChecked = this.checked;        
            const taskId = this.value;
            //完了の時
            if(isChecked){
            
                fetch('/list/complete', {
                    method: 'POST',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({ id: taskId})
                })
                .then(response => { 
                    if(response.ok) {
                        const td = this.closest('tr').querySelector('td:nth-child(8)'); // 状態のセル
                        td.textContent = '完了';
                        this.closest('tr').setAttribute('data-done', 'true');
                        this.closest('tr').style.backgroundColor = 'rgb(136, 136, 136)';
                        updateTodayTaskCounts();
                        updateAllTaskCounts();
                    }
                });
                //未完了の時
            }else if(!isChecked){
                fetch('/list/uncomplete', {
                    method: 'POST',
                    headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams({ id: taskId})
                })
                .then(response => { 
                    if(response.ok) {
                        const td = this.closest('tr').querySelector('td:nth-child(8)'); // 状態のセル
                        td.textContent = '未完了';
                        this.closest('tr').setAttribute('data-done', 'false');
                        const row = this.closest('tr');
                        applyRowColor(row);
                        updateTodayTaskCounts();
                        updateAllTaskCounts();
                    }
                });
            }
        }
    });
});
});

function updateTodayTaskCounts(){
    const incompleteTodayTasks = document.querySelectorAll('tbody tr[data-deadline]');
    const countDisplay = document.getElementById("todayIncompleteTasks");

    if(!countDisplay) return;

    const today = new Date();
    today.setHours(0,0,0,0);
    
    let count = 0;

    incompleteTodayTasks.forEach(row=>{
        const deadlineStr = row.getAttribute('data-deadline');  // 例: '2025-06-16'
        if (!deadlineStr) return;

        const deadlineDate = new Date(deadlineStr);
        deadlineDate.setHours(0, 0, 0, 0);

        if (deadlineDate <= today && row.getAttribute('data-done') === 'false') {
            count++;
        }
    });
        countDisplay.textContent = count + '件';
    
}
//全未完了タスク件数の表示（チェックボックスを押下した時）
function updateAllTaskCounts(){
    const incompleteTasks = document.querySelectorAll('tbody tr[data-done="false"]');
    const countDisplay = document.getElementById("allIncompleteTasks");
    if(countDisplay){
        countDisplay.textContent = incompleteTasks.length + '件';
    }
}