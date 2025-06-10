package com.example.TaskManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.TaskManagement.entity.TaskItem;
import com.example.TaskManagement.repository.TaskItemRepository;
import com.example.TaskManagement.service.TaskItemService;

import jakarta.servlet.http.HttpSession;

// リストコンローラー
@Controller
@RequestMapping("/list")
public class TMController {

    @Autowired
    private TaskItemService TIService;
    @Autowired
    private TaskItemRepository taskItemRepository;

    @GetMapping("/dashboard")
    public String showDashboard(HttpSession session, Model model) { // ここでsessionは既存のセッション or 新規セッションを取得
        String userId = (String) session.getAttribute("userId");
        model.addAttribute("taskList", TIService.getAllList(userId));
        model.addAttribute("currentPage", "dashboard");// ヘッダーの条件分岐の為
        return "dashboard";
    }

    @PostMapping("/add")
    String addItem(@RequestParam("task") String task, @RequestParam("deadline") String deadline, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        TaskItem item = new TaskItem();
        item.setDetail(task);
        item.setDeadline(deadline);
        item.setUserId(userId);
        taskItemRepository.save(item); // 細かい処理不要のため、Spring Data JPAの機能使用
        return "redirect:/list/dashboard";
    }

    @PostMapping("/delete")
    String deleteItem(@RequestParam("id") Long id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        taskItemRepository.deleteTask(id, userId);
        return "redirect:/list/dashboard";
    }

    @PostMapping("/update")
    String updateItem(@RequestParam("id") Long id, @RequestParam("task") String task,
            @RequestParam("deadline") String deadline, @RequestParam("done") boolean done, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        taskItemRepository.updateTask(id, task, deadline, done, userId); // saveだとidかつuserIdが指定できないためカスタムクエリ使用
        return "redirect:/list/dashboard";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) { // ここでsessionは既存のセッション or 新規セッションを取得
        session.invalidate();
        return "redirect:/login";
    }
}