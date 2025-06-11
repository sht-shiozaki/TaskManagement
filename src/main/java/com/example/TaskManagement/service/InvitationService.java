package com.example.TaskManagement.service;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TaskManagement.entity.Invitation;
import com.example.TaskManagement.repository.InvitationRepository;

@Service
public class InvitationService {

    @Autowired
    private InvitationRepository invitationRepository;

    // 招待コードの発行
    public String invitation() {
        LocalDate twoDaysAgo = LocalDate.now().minusDays(2);
        invitationRepository.deleteByIssueDateBefore(twoDaysAgo);
        String invitationCode = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8); // ランダム8文字生成
        while (invitationRepository.checkInvitationCode(invitationCode)) {// 重複する招待コードが存在するか確認。存在すればtrue。
            invitationCode = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);// 重複のためもう一度生成
        }
        return invitationCode;
    }

    // 招待コードをInvitationテーブルに追加
    public void addCode(String userId, String inviteCode) {
        Invitation invitation = new Invitation();
        LocalDate issueDate = LocalDate.now();
        invitation.setUserId(userId);
        invitation.setIssueDate(LocalDate.now());
        invitation.setExpirationDate(issueDate.plusDays(1));
        invitation.setInvitationCode(inviteCode);
        invitationRepository.save(invitation);
    }
}
