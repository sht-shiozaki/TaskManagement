package com.example.TaskManagement.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TaskManagement.entity.Invitation;
import com.example.TaskManagement.repository.InvitationRepository;

@Service
public class InvitationService {

    @Autowired
    private InvitationRepository invitationRepository;

    public void invitation(Invitation invitation) {
        String invitationCode = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8); // ランダム8文字生成
        while (invitationRepository.checkInvitationCode(invitationCode)) {// 重複する招待コードが存在するか確認。存在すればtrue。
            invitationCode = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);// 重複のためもう一度生成
        }
        invitation.setInvitationCode(invitationCode); // invitationCode登録
        invitationRepository.save(invitation); // 上記で細かい処理をしてから、Spring Data JPAの機能使用
    }
}
