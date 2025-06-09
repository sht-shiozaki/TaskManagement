package com.example.TaskManagement.exception;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class GlobalExceptionHandler {

    @ExceptionHandler(RegistrationException.class)
    public String handleRegistrationException(RegistrationException ex, Model model) {
        model.addAttribute("errorMessage", ex.getMessage());
        return "taskError"; // エラー表示用テンプレート名
    }

}
