// SpringJPAが提供するリポジトリ機能を拡張して、
// TaskItemテーブルに対するデータ操作を行うためのもの
// save/findById/delete等でカバーしきれない機能追加
package com.example.TaskManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.TaskManagement.entity.TaskItem;

import java.time.LocalDate;
import java.time.LocalTime;
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

        // 以下のDB操作の記述にはJPQL(Java Persistence Query Language)を使用
        // JPQLはEntityクラス名やフィールド名を使ってクエリを記述する言語
        // JPAが@を参考にテーブルやカラムを参照し、そのマッピング情報をもとに適切なSQLに変換してデータベースへ発行してくれる
        // @Queryは実行するJPQLの指定

        /*
         * // ユーザのタスクリスト取得
         * 
         * @Query("SELECT t FROM TaskItem t WHERE t.userId = :userId")
         * List<TaskItem> findByUserId(@Param("userId") String userId);
         */

        // 未完了のタスクリスト取得
        @Query("SELECT t FROM TaskItem t WHERE t.done = false AND t.userId = :userId")
        List<TaskItem> findByFalseList(@Param("userId") String userId);

        // タスクの時間順かつ優先度順
        @Query("SELECT t FROM TaskItem t WHERE t.userId = :userId order by t.deadline, t.time, "
                        + "CASE priority WHEN'高'THEN 3 WHEN'中'THEN 2 WHEN'低'THEN 1 ELSE 0 END DESC")
        List<TaskItem> findByUserId(@Param("userId") String userId);

        // 本日のタスクリスト取得
        @Query("SELECT t FROM TaskItem t WHERE t.done = false AND t.userId = :userId AND t.deadline <= :deadline  "
                        +
                        "ORDER BY  t.deadline ASC, CASE  t.priority WHEN '高' THEN 1 WHEN '中' THEN 2 WHEN '低' THEN 3 END ASC , "
                        +
                        " t.time ASC")
        List<TaskItem> findByUserIdAndDeadline(@Param("userId") String userId,
                        @DateTimeFormat(pattern = "yyyy-MM-dd") @Param("deadline") LocalDate deadline);

        @Transactional
        @Modifying // DELETEクエリを使う場合は @Modifying アノテーションが必須
        @Query("DELETE FROM TaskItem t WHERE t.id = :id AND t.userId = :userId")
        // このメソッドの名前は自由 Spring Data JPAが勝手に↑のJPQLに@Paramで指定したものを埋め込んでくれる
        void deleteTask(@Param("id") Long id, @Param("userId") String userId);

        @Transactional // トランザクション領域で実行
        @Modifying // 実行するのはデータ変更クエリ
        @Query("UPDATE TaskItem t SET t.title = :title, t.detail = :detail, t.deadline = :deadline, t.time = :time, t.priority = :priority, t.done = :done WHERE t.id = :id AND t.userId = :userId")
        void updateTask(@Param("id") Long id, @Param("title") String title, @Param("detail") String detail,
                        @DateTimeFormat(pattern = "yyyy-MM-dd") @Param("deadline") LocalDate deadline,
                        @DateTimeFormat(pattern = "HH:mm") @Param("time") LocalTime time,
                        @Param("priority") String priority,
                        @Param("done") boolean done, @Param("userId") String userId);

        // チェックボタン一括選択での完了処理
        @Transactional
        @Modifying
        @Query("UPDATE TaskItem t SET t.done = true WHERE t.id IN :ids")
        void selectedTasksCompleted(@Param("ids") List<Long> ids);

        // チェックボタン一括選択での削除処理
        @Transactional
        @Modifying
        @Query("DELETE FROM TaskItem t WHERE t.id IN :ids")
        void deleteSelectTasks(@Param("ids") List<Long> ids);

        // チェックボタン押下後即完了処理
        @Transactional
        @Modifying
        @Query("UPDATE TaskItem t SET t.done = true WHERE t.id = :id")
        void markTaskAsCompleted(@Param("id") Long id);

        // チェックボタン押下後即未完了処理
        @Transactional
        @Modifying
        @Query("UPDATE TaskItem t SET t.done = false WHERE t.id = :id")
        void markTaskAsUncompleted(@Param("id") Long id);

}
