// JPAを使用してデータベースのTaskItemテーブルと対応付けを
// 行うための実体(アプリケーションで扱いたい意味あるまとまり)定義
// JPAによるテーブル設計図と
// Spring MVCのデータバイディング対象(フォームやJSONの受け皿)

package com.example.TaskManagement.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity // JPAが自動的にSQLオブジェクト間の変換を行う Entity(実体)
@Table(name = "TaskItem") // テーブル名を指定
public class TaskItem {
    // idを自動採番(IDENTITY)で指定 IDENTITY(独自性)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // タイトル 追加
    @Column(nullable = false)
    private String title;

    // カラム名変更（task⇒detail）
    @Column(nullable = false, length = 400)
    private String detail;

    @Column(nullable = false)
    private LocalDate deadline;

    // 締め切り時間 追加
    @Column(nullable = false)
    private LocalTime time;

    // 優先度 追加
    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private boolean done = false; // Java側で初期値を設定

    @Column(nullable = false)
    private String userId;

    // JPAがりフレクションする際に必要なコンストラクタ
    // リフレクションとは
    // 実行時にアノテーションをもとにフレームワークが読み取りを行うこと
    // 実行時にクラス構造を調べたり動かしたりする機能
    public TaskItem() { // JPA用の無引数コンストラクタ
    }

    // 以降はクライアントから立ってきたデータをオブジェクトに詰める役割(データバインディング)
    // 引数ありコンストラクタ
    public TaskItem(Long id, String title, String detail, LocalDate deadline, LocalTime time, String priority,
            boolean done,
            String userId) {
        this.id = id;
        this.title = title;
        this.detail = detail;
        this.deadline = deadline;
        this.time = time;
        this.priority = priority;
        this.done = done;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}