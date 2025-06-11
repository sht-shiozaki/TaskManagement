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

    // 公開アプリ用マッピング
    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login";
    }

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
    public String registerUser(Registry registry, HttpSession session, Model model,
            @RequestParam("inviteCode") String inviteCode) {

        // 文字数制限  
        String Msg = registryService.checkUser(registry.getUsername(),registry.getPassword(),registry.getEmail()      
        if(Msg != null){
            model.addAttribute("error", Msg);
            return "register";
        }  

        // 招待コードが無効の場合
        if(!registryService.isInviteCodeValid(inviteCode))
        {
            model.addAttribute("error", "招待コードが無効です");
            model.addAttribute("user", registry);
            return "register"; // 再度登録画面へ
        }

        // ユーザーの登録
        registryService.registerUser(registry);return"redirect:/login"; // URL変更
    }
}
