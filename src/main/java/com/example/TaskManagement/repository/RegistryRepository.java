package com.example.TaskManagement.repository;

import com.example.TaskManagement.entity.Registry;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// RegistryRepository は JpaRepository を継承したリポジトリインターフェイスです。
public interface RegistryRepository extends JpaRepository<Registry, Long> {
    Optional<Registry> findByUsername(String username); // 名前を1件取得。なければ空のOptional

    Optional<Registry> findByEmail(String email); // emailを1件取得。なければ空のOptional

    // COUNT(r) > 0 によって、該当レコードが存在すれば true、なければ false を返すようにしています
    @Query("SELECT COUNT(r) > 0 FROM Registry r WHERE r.userId = :userId") // 変数として使う場合は :userId とコロンが必要
    boolean checkUserId(@Param("userId") String userId); // @Param("userId"):引数がある場合は左記が必要

    // ユーザ情報取得
    @Query("SELECT r FROM Registry r WHERE r.userId = :userId")
    Optional<Registry> findByUserId(@Param("userId") String userId);

    // メールアドレスの重複を確認
    boolean existsByEmail(String email);

}
