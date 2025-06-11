package com.example.TaskManagement.service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TaskManagement.entity.Registry;
import com.example.TaskManagement.repository.InvitationRepository;
import com.example.TaskManagement.repository.RegistryRepository;

@Service
public class RegistryService {

    // @Autowired
    // によって、インターフェイスであるRegistryRepositoryをSpringに注入し、自動生成された実装インスタンスが注入されたクラスが使えるようになります。
    @Autowired
    private RegistryRepository registryRepository; // importしたインターフェイス
    @Autowired
    private InvitationRepository invitationRepository;

    public Optional<Registry> login(String username, String password) {
        Optional<Registry> user = registryRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user; // ログイン成功時ににuser情報を返す
        }
        return Optional.empty(); // ログイン失敗時にOptionalを空で返す
    }

    // ユーザ情報登録
    public void registerUser(Registry registry) {
        String userId = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8); // ランダム8文字生成
        while (registryRepository.checkUserId(userId)) {
            userId = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8);
        }
        registry.setUserId(userId); // userId登録
        registryRepository.save(registry); // 上記で細かい処理をしてから、Spring Data JPAの機能使用
    }

    // ユーザー情報取得
    public Optional<Registry> getUserByUserId(String userId) {
        return registryRepository.findByUserId(userId);
    }

    // 招待コード判定
    public boolean isInviteCodeValid(String inviteCode) {
        LocalDate today = LocalDate.now();// 今日の日付
        // コードと有効期限が共に有効であれば「ture」でそれ以外は「false」
        return invitationRepository.findByInvitationCodeAndExpirationDateGreaterThanEqual(inviteCode, today)
                .isPresent();
    }
}
