// SpringJPAが提供するリポジトリ機能を拡張して、
// TaskItemテーブルに対するデータ操作を行うためのもの
// save/findById/delete等でカバーしきれない機能追加
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

    // 以下のDB操作の記述にはJPQL(Java Persistence Query Language)を使用
    // JPQLはEntityクラス名やフィールド名を使ってクエリを記述する言語
    // JPAが@を参考にテーブルやカラムを参照し、そのマッピング情報をもとに適切なSQLに変換してデータベースへ発行してくれる
    // @Queryは実行するJPQLの指定
    // ユーザのタスクリスト取得
    @Query("SELECT t FROM TaskItem t WHERE t.userId = :userId")
    List<TaskItem> findByUserId(@Param("userId") String userId);

    // 未完了のタスクリスト取得
    @Query("SELECT t FROM TaskItem t WHERE t.done = false AND t.userId = :userId")
    List<TaskItem> findByFalseList(@Param("userId") String userId);

    @Transactional
    @Modifying // DELETEクエリを使う場合は @Modifying アノテーションが必須
    @Query("DELETE FROM TaskItem t WHERE t.id = :id AND t.userId = :userId")
    // このメソッドの名前は自由 Spring Data JPAが勝手に↑のJPQLに@Paramで指定したものを埋め込んでくれる
    void deleteTask(@Param("id") Long id, @Param("userId") String userId);

    @Transactional // トランザクション領域で実行
    @Modifying // 実行するのはデータ変更クエリ
    @Query("UPDATE TaskItem t SET t.title = :title, t.detail = :detail, t.deadline = :deadline, t.time = :time, t.priority = :priority, t.done = :done WHERE t.id = :id AND t.userId = :userId")
    void updateTask(@Param("id") Long id, @Param("title") String title, @Param("detail") String detail,
            @Param("deadline") String deadline, @Param("time") String time, @Param("priority") String priority,
            @Param("done") boolean done, @Param("userId") String userId);
}