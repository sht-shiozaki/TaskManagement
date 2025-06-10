package com.example.TaskManagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.TaskManagement.entity.Invitation;

public interface InvitationRepository extends JpaRepository<Invitation, String> {
    Optional<Invitation> findByUserId(String userId);// 名前を1件取得。なければ空のOptional
    // COUNT(r) > 0 によって、該当レコードが存在すれば true、なければ false を返すようにしています

    @Query("SELECT COUNT(r) > 0 FROM Invitation r WHERE r.invitationCode = :invitationCode") // 変数として使う場合は:invitationCodeと
    boolean checkInvitationCode(@Param("invitationCode") String invitationCode); // @Param("invitationCode"):引数がある場合は左記が必要

}
