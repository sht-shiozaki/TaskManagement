package com.example.TaskManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.TaskManagement.entity.Invitation;
import com.example.TaskManagement.service.InvitationService;

//import jakarta.servlet.http.HttpSession;

@Controller
public class MyPageController {

    @Autowired
    private InvitationService invitationService;

    @PostMapping("/mypage")
    public String invitation(Invitation invitation /* HttpSession session, Model model */) {
        invitationService.invitation(invitation);
        return "redirect:/mypage"; // URL変更
    }
}
