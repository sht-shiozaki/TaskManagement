package com.example.TaskManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.TaskManagement.entity.Invitation;
import com.example.TaskManagement.service.InvitationService;

import java.util.Optional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;
import com.example.TaskManagement.entity.Registry;
import com.example.TaskManagement.service.RegistryService;

@Controller
public class MyPageController {

    @Autowired
    private InvitationService invitationService;
    @Autowired
    private RegistryService registryService;

    @GetMapping("/mypage")
    public String showMyPage(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("userId");
        Optional<Registry> user = registryService.getUserByUserId(userId);
        if (user.isPresent()) {
            model.addAttribute("userId", user.get().getUserId());
            model.addAttribute("username", user.get().getUsername());
            model.addAttribute("mail", user.get().getEmail());
            model.addAttribute("currentPage", "mypage");
            // ↑ヘッダー表示用
            return "mypage";
        } else {
            session.invalidate();
            model.addAttribute("error", "ユーザー情報が見つかりませんでした");
            return "login";
        }
    }

    @PostMapping("/makeinvitecode")
    public String makeInviteCode(Invitation invitation, HttpSession session, Model model) {
        String userId = (String) session.getAttribute("userId");
        String inviteCode = invitationService.invitation();
        invitationService.addCode(userId, inviteCode);
        Optional<Registry> user = registryService.getUserByUserId(userId);

        model.addAttribute("userId", user.get().getUserId());
        model.addAttribute("username", user.get().getUsername());
        model.addAttribute("mail", user.get().getEmail());
        model.addAttribute("currentPage", "mypage"); // ヘッダー表示用
        model.addAttribute("invitecode", inviteCode);
        return "mypage";
    }
}
