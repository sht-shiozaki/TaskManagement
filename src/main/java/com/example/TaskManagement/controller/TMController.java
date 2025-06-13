// タスク管理の一覧表示、追加、削除、更新を行うためのコントローラー
package com.example.TaskManagement.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestBody;

// リストコントローラー
@Controller // Spring MVCのコントローラーであることを示す
@RequestMapping("/list") // URLの先頭部分を指定
public class TMController {

    //
    @Autowired
    private TaskItemService TIService;
    @Autowired
    private TaskItemRepository taskItemRepository;

    @GetMapping("/dashboard")
    public String showDashboard(HttpSession session, Model model) { // ここでsessionは既存のセッション or 新規セッションを取得
        String userId = (String) session.getAttribute("userId");
        // 本日のタスクだけ取得
        List<TaskItem> todayList = TIService.getTodayList(userId);
        model.addAttribute("todayList", todayList);
        // TISevice.getAllList()でサービスクラスメソッドよび、リポジトリクラスのメソッドでDBから表データを取り出し
        model.addAttribute("taskList", TIService.getAllList(userId));
        model.addAttribute("currentPage", "dashboard");// ヘッダーの条件分岐の為
        return "dashboard";
    }

    @PostMapping("/add")
    String addItem(@RequestParam("title") String title, @RequestParam("detail") String detail,
            @DateTimeFormat(pattern = "yyyy-MM-dd") @RequestParam("deadline") LocalDate deadline,
            @DateTimeFormat(pattern = "HH:mm") @RequestParam("time") LocalTime time,
            @RequestParam("priority") String priority, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        TaskItem item = new TaskItem();
        item.setTitle(title);
        item.setDetail(detail);
        item.setDeadline(deadline);
        item.setTime(time);
        item.setPriority(priority);
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
    String updateItem(@RequestParam("id") Long id, @RequestParam("title") String title,
            @RequestParam("detail") String detail,
            @DateTimeFormat(pattern = "yyyy-MM-dd") @RequestParam("deadline") LocalDate deadline,
            @DateTimeFormat(pattern = "HH:mm") @RequestParam("time") LocalTime time,
            @RequestParam("priority") String priority,
            @RequestParam("done") boolean done, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        taskItemRepository.updateTask(id, title, detail, deadline, time, priority, done, userId); // saveだとidかつuserIdが指定できないためカスタムクエリ使用
        return "redirect:/list/dashboard";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) { // ここでsessionは既存のセッション or 新規セッションを取得
        session.invalidate();
        return "redirect:/login";
    }

    // 一括選択モード中の完了ボタン押下処理
    @PostMapping("/complete-selected")
    public String completeSelectedCheckedbox(@RequestParam("ids") List<Long> ids) {
        taskItemRepository.selectedTasksCompleted(ids);
        return "redirect:/list/dashboard";
    }

    // 一括選択モード中の削除ボタン押下処理
    @PostMapping("/delete-selected")
    public String deleteSelectTasks(@RequestParam("ids") List<Long> ids) {
        taskItemRepository.deleteSelectTasks(ids);
        return "redirect:/list/dashboard";
    }

    // チェックボックス押下後タスク完了
    @PostMapping("/complete")
    public String completeCheckedbox(@RequestParam("id") Long id) {
        taskItemRepository.markTaskAsCompleted(id);
        return "redirect:/list/dashboard";
    }

    // チェックボックス押下後タスク未完了
    @PostMapping("/uncomplete")
    public String markTaskAsUncompleted(@RequestParam("id") Long id) {
        taskItemRepository.markTaskAsUncompleted(id);
        return "redirect:/list/dashboard";
    }

}