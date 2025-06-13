package com.example.TaskManagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TaskManagement.entity.TaskItem;
import com.example.TaskManagement.repository.TaskItemRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TaskItemService {

    @Autowired
    private TaskItemRepository taskItemRepository;

    public List<TaskItem> getAllList(String userId) {
        return taskItemRepository.findByUserId(userId);
    }

    public List<TaskItem> getTodayList(String userId) {
        LocalDate today = LocalDate.now();
        return taskItemRepository
                .findByUserIdAndDeadline(userId, today) // 元の JPA クエリ結果
                .stream()
                // リスト中の null 要素を排除
                .filter(Objects::nonNull)
                // タイムフィールドやタイトルが null の場合も排除したいなら追加
                .filter(item -> item.getTime() != null)
                .filter(item -> item.getTitle() != null)
                .collect(Collectors.toList());
    }
}
