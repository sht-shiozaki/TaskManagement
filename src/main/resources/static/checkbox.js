//リストの色付け（初回）
document.addEventListener('DOMContentLoaded', function(){
    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach(applyRowColor);
});
//色付けのメソッド
function applyRowColor(row) {
    const statusText = row.cells[6].textContent.trim();
    const deadline = row.cells[3].textContent.trim();
    const time = row.cells[4].textContent.trim();

        //完了したタスクのみをグレーアウトする
    if(statusText === '完了') {
        row.style.backgroundColor = 'rgb(136, 136, 136)';
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
document.addEventListener('DOMContentLoaded', function() {
    const completeSelectedButton = document.getElementById('completeSelectedButton');
    const deleteTasks = document.getElementById('deleteTasks');
    const checkAllButton = document.getElementById('checkAllButton');

    completeSelectedButton.style.display = 'none';
    deleteTasks.style.display = 'none';
    checkAllButton.style.display = 'none';

    document.getElementById('selectList').addEventListener('click',function() {
       
        //ボタンの表示（表示中かの確認）
        const isVisible = completeSelectedButton.style.display === 'none';
        
        completeSelectedButton.style.display = isVisible ? 'inline' : 'none';
        deleteTasks.style.display = isVisible ? 'inline' : 'none';
        checkAllButton.style.display = isVisible ? 'inline' : 'none';

    // isBatchModeを切り替え
        isBatchMode = !isBatchMode;

        //一括選択モードの切り替え（thisはクリックされたbutton）
        this.textContent = isBatchMode ? '選択解除' : '一括選択モード';

        //モード変更の際にすべてのチェックを外す
        document.querySelectorAll('input[name="taskCheckbox"]').forEach(cb => {
            cb.checked = false;
        });
    });
});
//全選択ボタン（すべてにチェックをつける）一括選択モードのみ
checkAllButton.addEventListener('click', function() {
    if(!isBatchMode) return; //通常時は機能しない

    document.querySelectorAll('input[name="taskCheckbox"]').forEach(cb => {
        cb.checked = true;
    });
});

//チェックボタン押下後即完了処理
document.addEventListener('DOMContentLoaded',function() {
    document.querySelectorAll('input[name="taskCheckbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            if(!isBatchMode && this.checked) {
                //チェックは1つ以上はつけれなくする処理
                document.querySelectorAll('input[name="taskCheckbox"]').forEach(otherCb => {
                    if(otherCb !== this) {
                        otherCb.checked = false;
                    }
                });
                
                const doneValue = this.closest('tr').getAttribute('data-done');
                const taskId = this.value;
                //未完了の時
                if(doneValue === "false"){
                
                    fetch('/list/complete', {
                        method: 'POST',
                        headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                        body: new URLSearchParams({ id: taskId})
                    })
                    .then(response => { 
                        if(response.ok) {
                            const td = this.closest('tr').querySelector('td:nth-child(7)'); // 状態のセル
                            td.textContent = '完了';
                            this.closest('tr').setAttribute('data-done', 'true');
                            //window.location.href = response.url;
                            this.closest('tr').style.backgroundColor = 'rgb(136, 136, 136)';
                        }
                    });
                    //完了の時
                }else if(doneValue === "true"){
                    fetch('/list/uncomplete', {
                        method: 'POST',
                        headers: { 'Content-Type' : 'application/x-www-form-urlencoded'},
                        body: new URLSearchParams({ id: taskId})
                    })
                    .then(response => { 
                        if(response.ok) {
                            const td = this.closest('tr').querySelector('td:nth-child(7)'); // 状態のセル
                            td.textContent = '未完了';
                            this.closest('tr').setAttribute('data-done', 'false');
                            //window.location.href = response.url;
                            const row = this.closest('tr');
                            applyRowColor(row);
                        }
                    });
                }
            }
        });
    });
});

//チェックボックス一括処理
document.addEventListener('DOMContentLoaded', function() {
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
});