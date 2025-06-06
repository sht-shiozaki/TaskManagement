package com.example.TaskManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.TaskManagement.entity.TaskItem;

import java.util.List;

// データベースの「TaskItem」エンティティ（テーブル）にアクセスするためのインターフェースです。
// <TaskItem, Long>操作対象のエンティティクラス, エンティティの主キー
public interface TaskItemRepository extends JpaRepository<TaskItem, Long> {
    /*
     * // 「メソッド名クエリ」と呼ばれるSpring Data JPAの機能
     * // 「userId」フィールドを条件に検索するクエリとして自動的に解釈される
     * // 戻り値は Optional<TaskItem>
     * で、見つかった場合は中にUserRegistrationオブジェクトが入り、見つからない場合は空のOptionalになります。
     */

    // ユーザのタスクリスト取得
    @Query("SELECT t FROM TaskItem t WHERE t.userId = :userId")
    List<TaskItem> findByUserId(@Param("userId") String userId);

    // 未完了のタスクリスト取得
    @Query("SELECT t FROM TaskItem t WHERE t.done = false AND t.userId = :userId")
    List<TaskItem> findByFalseList(@Param("userId") String userId);

    @Transactional
    @Modifying // DELETEクエリを使う場合は @Modifying アノテーションが必須
    @Query("DELETE FROM TaskItem t WHERE t.id = :id AND t.userId = :userId")
    void deleteTask(@Param("id") Long id, @Param("userId") String userId);

    @Transactional
    @Modifying
    @Query("UPDATE TaskItem t SET t.task = :task, t.deadline = :deadline, t.done = :done WHERE t.id = :id AND t.userId = :userId")
    void updateTask(@Param("id") Long id, @Param("task") String task, @Param("deadline") String deadline,
            @Param("done") boolean done, @Param("userId") String userId);
}