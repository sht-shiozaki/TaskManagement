package com.example.TaskManagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TaskManagement.entity.TaskItem;
import com.example.TaskManagement.repository.TaskItemRepository;
import java.util.List;

@Service
public class TaskItemService {

    @Autowired
    private TaskItemRepository taskItemRepository;
    
    public List<TaskItem> getAllList(String userId){
        return taskItemRepository.findByUserId (userId);
    }
}
