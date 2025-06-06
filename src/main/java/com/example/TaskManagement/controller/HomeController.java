package com.example.TaskManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestParam;
import com.example.TaskManagement.entity.Registry;
import com.example.TaskManagement.service.RegistryService;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;

@Controller
public class HomeController {

    @Autowired
    private RegistryService registryService;

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username, @RequestParam String password, HttpSession session,
            Model model) {
        Optional<Registry> user = registryService.login(username, password);
        if (user.isPresent()) {
            session.setAttribute("userId", user.get().getUserId());
            return "redirect:/list/dashboard"; // user/dashboardの@getへ
        } else {
            session.invalidate();
            model.addAttribute("error", "ユーザー名かパスワードが違います");
            return "login"; // login.htmlへ
        }
    }

    // login.htmlから新規登録押下された時に処理される。
    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new Registry()); // Registryクラスをコンストラクタ＝空オブジェクト作成
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(Registry registry, HttpSession session, Model model) {
        registryService.registerUser(registry);
        return "redirect:/login"; // URL変更
    }
}
